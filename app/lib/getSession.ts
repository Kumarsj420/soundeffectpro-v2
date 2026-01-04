import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session;
}
