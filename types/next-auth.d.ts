import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
    username: string;
  }

  interface User {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    preferredLanguage: string | null;
    username: string;
  }
}

interface SentenceData {
  text?: string;
  POS?: string;
  detailed_POS?: string[];
  start?: number;
  end?: number;
  meaning_in_english?: string;
  dictionary_form?: string;
  link?: string;
  components?: SentenceData[];
}
