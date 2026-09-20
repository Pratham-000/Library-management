import bcrypt from "bcrypt";
import crypto from "node:crypto";
import * as authRepository from "./auth.repository";

export type Auth0Profile = {
  sub: string;
  email: string;
  name: string;
};

export const syncAuth0User = async (profile: Auth0Profile) => {
  const existing = await authRepository.findUserByEmail(profile.email);

  if (existing) {
    return {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
    };
  }

  const password = await bcrypt.hash(
    "auth0-only-" + crypto.randomUUID(),
    12,
  );

  const user = await authRepository.createUser({
    name: profile.name || profile.email.split("@")[0],
    email: profile.email,
    password,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};