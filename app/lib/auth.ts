import { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';
import Email from 'next-auth/providers/email';

import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongodb';

import { Resend } from 'resend';
import { connectDB } from './dbConnection';
import User from '@/app/models/User';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const authOptions: NextAuthOptions = {

  adapter: MongoDBAdapter(clientPromise),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    Email({
      from: process.env.EMAIL_FROM!,
      async sendVerificationRequest({ identifier, url }) {
        try {
          const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: identifier,
            subject: 'Magic link from soundeffectpro.com',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">Welcome Back!</h1>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px;">Click the button below to sign in to your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Sign In</a>
                    </div>
                    <p style="font-size: 14px; color: #666;">If you didn't request this email, you can safely ignore it.</p>
                    <p style="font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #667eea; word-break: break-all; text-align: center;">${url}</p>
                  </div>
                </body>
              </html>
            `,
          });

          if (error) {
            throw new Error("Resend failed");
          }
        } catch (err) {
          console.error('Failed to send verify email', err);
          throw err;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {

    async signIn({ user, account }) {
      try {
        await connectDB();

        const dbUser = await User.findOne({ email: user.email });

        const name = user.name ?? null;
        const email = user.email!;
        const image = user.image ?? null;
        const provider = account?.provider ?? 'credentials';

        const isProfileCompleted = Boolean(name && image);

        if (!dbUser) {

          await User.create({
            name,
            email,
            image,
            provider,
            isProfileCompleted,
          });
        } else {
          let updated = false;

          if (!dbUser.name && name) {
            dbUser.name = name;
            updated = true;
          }

          if (!dbUser.image && image) {
            dbUser.image = image;
            updated = true;
          }

          if (dbUser.provider !== provider) {
            dbUser.provider = provider;
            updated = true;
          }

          if (updated) {
            await dbUser.save();
          }
        }

        return true;
      } catch (error) {
        console.error('signIn callback error:', error);
        return false;
      }
    },


    async jwt({ token, user }) {
      try {
        if (user) {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });

          if (dbUser) {
            token.uid = dbUser.uid;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.image = dbUser.image;
            token.isProfileCompleted = dbUser.isProfileCompleted;
            token.emailVerified = dbUser.emailVerified;
            token.favCount = dbUser.favCount;
            token.filesCount = dbUser.filesCount;
            token.categoriesCount = dbUser.categoriesCount;
            token.preference = dbUser.preference;
          }
        }

      } catch (err) {
        console.error("JWT refresh error:", err);
      }

      return token;
    },


    async session({ session, token }) {
      if (session.user) {
        session.user.uid = token.uid as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.isProfileCompleted = token.isProfileCompleted as boolean;
        session.user.email = token.email as string;
        session.user.emailVerified = token.emailVerified as Date;
        session.user.favCount = token.favCount as number;
        session.user.filesCount = token.filesCount as number;
        session.user.categoriesCount = token.categoriesCount as number;
        session.user.preference = token.preference ;
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
    verifyRequest: "/verify-email",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
