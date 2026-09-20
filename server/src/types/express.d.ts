export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "ADMIN";
    }

    interface Request {
      user?: User;
    }
  }
}