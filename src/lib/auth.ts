import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    name?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.isActive) {
          return null;
        }

        // Check if account is locked
        if (user.lockedUntil && new Date() < user.lockedUntil) {
          throw new Error("Account is temporarily locked. Please try again later.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          // Increment failed attempts
          await db.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: { increment: 1 },
              ...(user.failedLoginAttempts >= 4
                ? { lockedUntil: new Date(Date.now() + 30 * 60 * 1000) } // Lock for 30 minutes
                : {}),
            },
          });
          return null;
        }

        // Reset failed attempts and update last login
        await db.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        });

        // Get profile name based on role
        let name = user.email;
        if (user.role === "student") {
          const student = await db.student.findUnique({
            where: { userId: user.id },
          });
          name = student?.fullName || user.email;
        } else if (user.role === "organization") {
          const org = await db.organization.findUnique({
            where: { userId: user.id },
          });
          name = org?.companyName || user.email;
        } else if (user.role === "college") {
          const college = await db.college.findUnique({
            where: { userId: user.id },
          });
          name = college?.collegeName || user.email;
        } else if (user.role === "admin") {
          name = "Administrator";
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
          name: token.name,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "internship-provision-system-secret",
};
