import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

// Valores por defecto para desarrollo
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$10$nqdaPIhyOycDi1Ze18PkqOygPVAQaBUijDno6vknoF0JmEkl7Zgki";

console.log("🔧 Configuración de autenticación:");
console.log("ADMIN_EMAIL:", ADMIN_EMAIL);
console.log("ADMIN_PASSWORD_HASH:", ADMIN_PASSWORD_HASH ? "Configurado" : "No configurado");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Intentando autenticar:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales faltantes");
          return null;
        }

        const email = credentials.email.toLowerCase();
        
        if (email !== ADMIN_EMAIL) {
          console.log("❌ Email no coincide:", { provided: email, expected: ADMIN_EMAIL });
          return null;
        }

        console.log("🔐 Contraseña:", credentials.password);
        console.log("🔐 Hash de la contraseña:", ADMIN_PASSWORD_HASH);

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          ADMIN_PASSWORD_HASH
        );

        if (!isValidPassword) {
          console.log("❌ Contraseña incorrecta");
          return null;
        }

        console.log("✅ Autenticación exitosa para:", email);
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