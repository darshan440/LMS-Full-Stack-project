import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth/next';
import { Providers } from '@/app/Provider';
import { Exo } from 'next/font/google';

export const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    ],
    secret:process.env.SECRET,
};

export default NextAuth(authOption); 