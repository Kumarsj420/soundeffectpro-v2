"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
    const router = useRouter();
    useEffect(() => {

        const timer = setTimeout(() => {
            router.push('/')
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full rounded-xl border p-6 text-center space-y-4">
                <CheckCircle className="mx-auto text-green-500" size={48} />

                <h1 className="text-xl font-semibold">
                    Check your email
                </h1>

                <p className="text-sm text-muted-foreground">
                    We’ve sent you a magic sign-in link.
                    <br />
                    Please check your inbox and spam folder.
                </p>

                <p className="text-xs text-muted-foreground">
                    You can close this tab after signing in.
                </p>
            </div>
        </div>
    );
}
