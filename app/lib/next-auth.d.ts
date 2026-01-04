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
       lastSyncedAt?: number;
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
     lastSyncedAt?: number;
  }
}
