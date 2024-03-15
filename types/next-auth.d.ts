import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
  }

  interface User {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
  }
}
