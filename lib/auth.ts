import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseServiceRole } from "@/lib/supabase-server";
import { TwoFactorService } from "@/lib/two-factor-service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in Supabase
          const { data: user, error } = await supabaseServiceRole
            .from('User')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Check if user has 2FA enabled
          const has2FA = user.settings?.twoFactorEnabled === true && user.settings?.twoFactorSecret;
          
          if (has2FA) {
            // 2FA is required but no code provided
            if (!credentials.twoFactorCode) {
              throw new Error('2FA_REQUIRED');
            }

            // Verify 2FA code
            const isValid2FA = await TwoFactorService.verifyTwoFactor(
              user.id,
              credentials.twoFactorCode
            );

            if (!isValid2FA.success) {
              throw new Error('INVALID_2FA_CODE');
            }
          }

          // Update last login
          await supabaseServiceRole
            .from('User')
            .update({ 
              lastLoginAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .eq('id', user.id);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            has2FA: has2FA,
          };
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof Error) {
            if (error.message === '2FA_REQUIRED') {
              throw new Error('Two-factor authentication is required');
            }
            if (error.message === 'INVALID_2FA_CODE') {
              throw new Error('Invalid two-factor authentication code');
            }
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
