export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: "STUDENT" | "ADMIN";
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: User;
    }
  }
}