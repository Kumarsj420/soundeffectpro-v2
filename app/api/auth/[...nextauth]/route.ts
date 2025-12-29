import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';
import Email from 'next-auth/providers/email';
import { Resend } from 'resend';

import { connectDB } from '@/app/lib/dbConnection';
import User from '@/app/models/User';
import { generateUID } from '@/app/lib/generateUID';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongodb';


const resend = new Resend(process.env.RESEND_API_KEY!);

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),

        Twitch({
            clientId: process.env.TWITCH_CLIENT_ID!,
            clientSecret: process.env.TWITCH_CLIENT_SECRET!,
        }),

        Email({
            from: process.env.EMAIL_FROM!,
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                await resend.emails.send({
                    from: provider.from,
                    to: identifier,
                    subject: 'Sign in to SoundEffectPro',
                    html: `
            <h2>Login to SoundEffectPro</h2>
            <p>Click the button below to login:</p>
            <a href="${url}" style="
              padding: 10px 16px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            ">
              Login
            </a>
            <p>If you did not request this, ignore this email.</p>
          `,
                });
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async signIn({ user, account }: { user: any, account: any }) {
            await connectDB();

            if (!user.email) return false;

            const existingUser = await User.findOne({ email: user.email });

            if (existingUser) {
                user.uid = existingUser.uid;
            }

            if (!existingUser) {
                let uid: string;

                while (true) {
                    uid = generateUID();
                    const exists = await User.exists({ uid });
                    if (!exists) break;
                }

                await User.create({
                    uid,
                    name: user.name ?? null,
                    email: user.email,
                    picture: user.image ?? null,
                    oauth: account
                        ? {
                            provider: account.provider,
                            uid: account.providerAccountId,
                        }
                        : null,
                    favCount: 0,
                    createdAt: new Date(),
                });
            }

            return true;
        },

        async jwt({ token, user }: { token: any, user: any }) {
            if (user?.uid) {
                token.uid = user.uid;
            }
            return token;
        },

        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.uid = token.uid as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
