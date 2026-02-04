import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';
import { requireAuth } from '../../lib/getSession';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In To Your Account | Sound Effect Pro",
  description: "Sign in to Sound Effect Pro to upload sound effects, create custom soundboards, save your favorites, and access your personalized dashboard.",
};

export default async function LoginPage() {
  const session = await requireAuth();

  if (session) {
    redirect('/');
  }

  return <LoginClient />;
}
