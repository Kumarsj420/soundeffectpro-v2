'use client'
import Profile from "@/app/components/userProfile"
import { useSession } from 'next-auth/react';

function page() {
  const { data: session } = useSession();
  const uid = session?.user?.uid;

  if (!uid) return;

  return (
    <>
      <Profile userType="private" uid={uid} />
    </>
  )
}

export default page
