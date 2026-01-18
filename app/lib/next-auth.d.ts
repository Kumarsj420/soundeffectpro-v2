import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

  interface Session {
    user: {
      uid: string;
      email: string;
      name?: string | null;
      image?: string | null;
      isProfileCompleted: boolean;
      emailVerified: Date;
      favCount?: number;
      filesCount?: number;
      categoriesCount?: number;
      lastSyncedAt?: number;
      preference?: {
        theme: string,
        nsfw: boolean,
        cookies: boolean,
        language: "en" | "hi" | "ar" | "ur" | "fr" | "de" | "es" | "pt" | "zh";
      }
    } & DefaultSession["user"];
  }

  interface User {
    uid: string;
    isProfileCompleted: boolean;
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    uid: string;
    email: string;
    name?: string | null;
    image?: string | null;
    isProfileCompleted: boolean;
    emailVerified: Date;
    favCount?: number;
    filesCount?: number;
    categoriesCount?: number;
     preference?: {
        theme: string,
        nsfw: boolean,
        cookies: boolean,
        language: "en" | "hi" | "ar" | "ur" | "fr" | "de" | "es" | "pt" | "zh";
      }
  }
}
