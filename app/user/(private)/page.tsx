'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { userService } from '@/app/services/userService';
import { useQuery } from '@tanstack/react-query';

function page() {
  // const { data: session } = useSession();

  // const uid = session?.user?.uid;

  // const {
  //   data: userData,
  //   isLoading: isUserLoading,
  // } = useQuery({
  //   queryKey: ["sound", id],
  //   queryFn: () => fileService.getFilesById(id!),
  //   enabled: !!id,
  //   staleTime: 1000 * 60 * 5,
  // });


  return (
    <div>
      profile page
    </div>
  )
}

export default page
