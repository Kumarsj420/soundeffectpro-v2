'use client';
import React from 'react';
import Profile from '@/app/components/userProfile';

function UserIDPage({
    params,
}: {
    params: Promise<{ uid: string }>;
}) {
    const { uid } = React.use(params);

    return (
        <>
            <Profile userType="public" uid={uid} />
        </>
    );
}

export default UserIDPage
