"use client"
import React, { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react'
import Button from '../components/form/Button';
import { Head1, Para } from '../components/Ui';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

export default function LoginClient() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const isUploadRedirection = searchParams.get('redirection') === 'upload';
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const toastShown = useRef(false);

    useEffect(() => {
        if (isUploadRedirection && !toastShown.current) {
            toast.info('Sign in to continue uploading');
            toastShown.current = true;
        }
    }, [isUploadRedirection])

    const handleSubmit = async () => {
        if (!email) return;
        setIsLoading(true);
        await signIn("email", {
            email,
            callbackUrl,
        })
        setTimeout(() => {
            setIsLoading(false);
            alert('Magic link sent to your email!');
        }, 2000);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br flex justify-center ">

            <div className="relative w-full max-w-lg">
                {/* Logo placeholder */}
                <div className="text-center mb-8">
                    <Head1>Welcome To S.E.P</Head1>
                    <Para className='text-center max-w-2xl m-auto mt-3'>Sign in to your account to continue</Para>
                </div>

                {/* Main card */}
                <div className="bg-white dark:bg-zinc-900 backdrop-blur-lg rounded-3xl shadow-2xl shadow-gray-300 dark:shadow-black p-8 ring-1 ring-gray-300 dark:ring-zinc-800">
                    {/* Social login buttons */}
                    <div className="space-y-3 mb-6">
                        <Button onClick={() => signIn('google', { callbackUrl })} className='w-full  gap-3' size='lg' variant='outline'>
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <path
                                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                    fill="#EA4335"
                                />
                                <path
                                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                    fill="#34A853"
                                />
                            </svg>
                            Continue With Google
                        </Button>
                        <Button onClick={() => signIn('discord', { callbackUrl })} className='w-full bg-indigo-500 hover:bg-indigo-400 ring-1 ring-inset ring-indigo-300 gap-3.5 ' size='lg' variant='custom'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='size-5 scale-140 text-indigo-100' viewBox="0 0 24 24"><path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12" strokeWidth={0.01} stroke="currentColor"></path></svg>
                            Continue With Discord
                        </Button>
                        <Button onClick={() => signIn('twitch', { callbackUrl })} className='w-full bg-violet-500 hover:bg-violet-400 ring-1 ring-inset ring-violet-300 gap-3' size='lg' variant='custom'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='size-5   scale-130 text-violet-100' viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M20 2a1 1 0 0 1 1 1v9a1 1 0 0 1-.2.6l-3 4q-.076.102-.175.181l-2.5 2A1 1 0 0 1 14.5 19h-3.086l-2.707 2.707A1 1 0 0 1 7 21v-2H4a1 1 0 0 1-1-1V6l.005-.099a1 1 0 0 1 .288-.608l3-3l.073-.066A1 1 0 0 1 7 2zM8 15h2a1 1 0 0 1 1 1v.364l1.36-1.133A1 1 0 0 1 13 15h3.501L19 11.667V4H8zm3-4V7.5a1 1 0 1 1 2 0V11a1 1 0 1 1-2 0m4 0V7.5a1 1 0 1 1 2 0V11a1 1 0 1 1-2 0" strokeWidth={0.01} stroke="currentColor"></path></g>
                            </svg>
                            Continue With Twitch
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-200/70 dark:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 py-0.5 font-medium">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email form */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">
                                Email address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-gray-400/80 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !email}
                            className={`w-full py-2.5 px-3.5 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading || !email
                                ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500/70 dark:text-zinc-500 cursor-not-allowed'
                                : ' text-white bg-blue-500 hover:bg-blue-400 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Sending magic link...</span>
                                </div>
                            ) : (
                                'Send magic link'
                            )}
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-gray-600/90 dark:text-zinc-400 text-center leading-relaxed">
                        We&apos;ll email you a magic link for a password-free sign-in. By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}