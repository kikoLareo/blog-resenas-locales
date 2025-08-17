import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { authConfig } from "./auth.config";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

// Debug: Mostrar configuración cargada
console.log("DEBUG CONFIG:", {
  email: authConfig.adminEmail,
  hashPreview: authConfig.adminPasswordHash.substring(0, 7) + "..."
});

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
        
        // Debug: Comparar emails
        console.log("DEBUG Compare:", {
          input: email,
          configured: authConfig.adminEmail,
          match: email === authConfig.adminEmail
        });

        if (email !== authConfig.adminEmail) {
          console.log(`❌ Email no autorizado: ${email}`);
          return null;
        }

        // Debug: Mostrar información de la contraseña
        console.log("DEBUG Password:", {
          inputLength: credentials.password.length,
          hashLength: authConfig.adminPasswordHash.length,
          hashStart: authConfig.adminPasswordHash.substring(0, 7)
        });

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          authConfig.adminPasswordHash
        );

        console.log("DEBUG bcrypt result:", isValidPassword);

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
    signIn: "/dashboard/acceso",
    error: "/dashboard/acceso",
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