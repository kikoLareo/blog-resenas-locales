import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales incompletas");
          return null;
        }

        const email = credentials.email.toLowerCase();
        
        if (email !== process.env.ADMIN_EMAIL) {
          console.log(`❌ Email no autorizado: ${email}`);
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH || ""
        );

        if (!isValidPassword) {
          console.log(`❌ Contraseña incorrecta para: ${email}`);
          return null;
        }

        console.log(`✅ Login exitoso para: ${email}`);
        return {
          id: "admin",
          email,
          name: "Administrador",
          role: "ADMIN"
        };
      }
    }),
  ],
  pages: {
    signIn: "/acceso",
    error: "/acceso",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Tipos para TypeScript
declare module "next-auth" {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}