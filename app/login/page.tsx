"use client"
import React, { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Magic link sent to your email!');
        }, 2000);
    };

    const socialButtons = [
        {
            name: 'Google',
            icon: (
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
            ),
            bg: 'bg-zinc-800 hover:bg-zinc-700',
            text: 'text-white',
            border: 'border border-zinc-700 hover:border-zinc-600'
        },
        {
            name: 'Discord',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className='size-5 scale-120' viewBox="0 0 16 16"><path fill="currentColor" d="M9 8.5c0 .826.615 1.5 1.36 1.5c.762 0 1.35-.671 1.36-1.5S11.125 7 10.36 7C9.592 7 9 7.677 9 8.5M5.63 10c-.747 0-1.36-.671-1.36-1.5S4.866 7 5.63 7S7.01 7.677 7 8.5c-.013.826-.602 1.5-1.36 1.5z" strokeWidth="0.01" stroke="currentColor"/><path fill="currentColor" fillRule="evenodd" d="M13.3 2.72a1 1 0 0 1 .41.342c1.71 2.47 2.57 5.29 2.25 8.53a1 1 0 0 1-.405.71c-1.16.851-2.47 1.5-3.85 1.91a.99.99 0 0 1-1.08-.357a10 10 0 0 1-.665-1.01a9.4 9.4 0 0 1-3.87 0a9 9 0 0 1-.664 1.01a1 1 0 0 1-1.09.357a12.8 12.8 0 0 1-3.85-1.91a1 1 0 0 1-.405-.711c-.269-2.79.277-5.64 2.25-8.52c.103-.151.246-.271.413-.347c.999-.452 2.05-.774 3.14-.957c.415-.07.83.128 1.04.494l.089.161q1.01-.087 2.03 0l.088-.161a1 1 0 0 1 1.04-.494c1.08.181 2.14.502 3.14.955zm-3.67.776a11 11 0 0 0-3.21 0a8 8 0 0 0-.37-.744c-.998.168-1.97.465-2.89.882c-1.83 2.68-2.32 5.29-2.08 7.86c1.07.783 2.27 1.38 3.54 1.76a8 8 0 0 0 .461-.681q.158-.26.297-.53a7.5 7.5 0 0 1-1.195-.565q.15-.109.293-.218a8.5 8.5 0 0 0 1.886.62a8.4 8.4 0 0 0 4.146-.217a8 8 0 0 0 1.04-.404q.144.117.293.218a11 11 0 0 1-.282.157a8 8 0 0 1-.915.41a9 9 0 0 0 .518.872q.117.17.241.337c1.27-.38 2.47-.975 3.54-1.76c.291-2.98-.497-5.57-2.08-7.86c-.92-.417-1.89-.712-2.89-.879q-.204.362-.37.744z" clipRule="evenodd" strokeWidth="0.01" stroke="currentColor"/></svg>
            ),
            bg: 'bg-indigo-500 hover:bg-indigo-400',
            text: 'text-white',
            border: 'border border-indigo-400 hover:border-indigo-300'
        },
        {
            name: 'Apple',
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" className='size-5 scale-150' viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25" strokeWidth="0.01" stroke="currentColor"/></svg>
            ),
            bg: 'bg-black hover:bg-zinc-900',
            text: 'text-white',
            border: 'border border-white/20'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br flex justify-center mt-8">

            <div className="relative w-full max-w-xl">
                {/* Logo placeholder */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-zinc-200 mb-2 text-center">Welcome To S.E.P</h1>
                    <p className="text-zinc-400 text-center max-w-2xl m-auto mt-3">Sign in to your account to continue</p>
                </div>

                {/* Main card */}
                <div className="bg-zinc-900 backdrop-blur-lg rounded-2xl shadow-2xl p-8 ring-1 ring-zinc-800">
                    {/* Social login buttons */}
                    <div className="space-y-3 mb-6">
                        {socialButtons.map((social) => (
                            <button
                                key={social.name}
                                className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] ${social.bg} ${social.text} ${social.border} shadow-sm hover:shadow-md`}
                            >
                                {social.icon}
                                <span>Continue with {social.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-zinc-800 text-zinc-300 py-0.5 font-medium">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email form */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                Email address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-zinc-400/80"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !email}
                            className={`w-full py-2.5 px-3.5 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading || !email
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
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

                    <p className="mt-6 text-xs text-zinc-400 text-center leading-relaxed">
                        We'll email you a magic link for a password-free sign-in. By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}