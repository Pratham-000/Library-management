import { createPublicKey, createVerify } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { syncAuth0User } from "../features/auth/auth.service";

type Jwk = {
  kty: string;
  n: string;
  e: string;
  kid: string;
  alg?: string;
  use?: string;
};

type JwtHeader = { alg: string; kid: string };
type JwtPayload = {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat?: number;
  nbf?: number;
};

let jwksCache: { expiresAt: number; keys: Jwk[] } | null = null;

function base64UrlDecode(value: string) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  return Buffer.from(normalized, "base64").toString("utf8");
}

function decodePart<T>(value: string): T {
  return JSON.parse(base64UrlDecode(value)) as T;
}

async function getSigningKey(kid: string) {
  const domain = process.env.AUTH0_DOMAIN;
  if (!domain) throw new Error("AUTH0_DOMAIN is not configured");

  if (!jwksCache || jwksCache.expiresAt < Date.now()) {
    const response = await fetch("https://" + domain + "/.well-known/jwks.json");
    if (!response.ok) throw new Error("Unable to load Auth0 signing keys");

    const data = (await response.json()) as { keys: Jwk[] };
    jwksCache = {
      keys: data.keys,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
  }

  const key = jwksCache.keys.find((item) => item.kid === kid);
  if (!key) throw new Error("Auth0 signing key not found");

  return createPublicKey({ key: key as JsonWebKey, format: "jwk" });
}

async function verifyAuth0Token(token: string): Promise<JwtPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed JWT");

  const header = decodePart<JwtHeader>(parts[0]);
  const payload = decodePart<JwtPayload>(parts[1]);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Unsupported Auth0 token");
  }

  const domain = process.env.AUTH0_DOMAIN;
  const audience = process.env.AUTH0_AUDIENCE;
  const issuer = domain ? "https://" + domain + "/" : "";

  if (!domain || !audience) {
    throw new Error("Auth0 API configuration is missing");
  }

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (payload.iss !== issuer) throw new Error("Invalid token issuer");
  if (!audiences.includes(audience)) throw new Error("Invalid token audience");

  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub || !payload.exp || payload.exp <= now) {
    throw new Error("Token is expired or missing subject");
  }

  if (payload.nbf && payload.nbf > now) {
    throw new Error("Token is not active yet");
  }

  const signingKey = await getSigningKey(header.kid);
  const verifier = createVerify("RSA-SHA256");
  verifier.update(parts[0] + "." + parts[1]);
  verifier.end();

  const signature = Buffer.from(
    parts[2]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[2].length / 4) * 4, "="),
    "base64",
  );

  if (!verifier.verify(signingKey, signature)) {
    throw new Error("Invalid token signature");
  }

  return payload;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = await verifyAuth0Token(token);

    const domain = process.env.AUTH0_DOMAIN;
    if (!domain) throw new Error("AUTH0_DOMAIN is not configured");

    const userInfoResponse = await fetch("https://" + domain + "/userinfo", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Unable to load Auth0 user profile");
    }

    const profile = (await userInfoResponse.json()) as {
      sub?: string;
      email?: string;
      name?: string;
    };

    if (!profile.email || profile.sub !== payload.sub) {
      throw new Error("Auth0 profile is missing a valid email");
    }

    req.user = await syncAuth0User({
      sub: payload.sub,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
    });

    next();
  } catch (error) {
    console.error("Auth0 verification failed:", error);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token",
    });
  }
};