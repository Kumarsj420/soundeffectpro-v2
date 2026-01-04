import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';
import { requireAuth } from '../lib/getSession';

export default async function LoginPage() {
  const session = await requireAuth();

  if (session) {
    redirect('/');
  }

  return <LoginClient />;
}
