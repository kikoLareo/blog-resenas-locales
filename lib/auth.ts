import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from './prisma';

if (!process.env.NEXTAUTH_SECRET) {
  // Don't throw here to avoid breaking build-time collection and server-side
  // code analysis in environments where auth isn't configured (CI/local).
  // Individual API routes should guard usage of auth as needed.
  console.warn("NEXTAUTH_SECRET is not set — authentication will be disabled in this environment.");
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
        const password = credentials.password;

        // 1) Try DB user first (admin users stored in prisma)
        try {
          const userRecord = await prisma.user.findUnique({ where: { email } });
          if (userRecord) {
            console.log('ℹ️ Usuario encontrado en DB:', { email, id: userRecord.id });
            if (userRecord.passwordHash) {
              const ok = await bcrypt.compare(password, userRecord.passwordHash);
              if (ok) {
                console.log('✅ Autenticación vía DB exitosa para', email);
                return {
                  id: String(userRecord.id),
                  email,
                  name: userRecord.email,
                  role: userRecord.role ?? 'ADMIN',
                };
              }
              console.log('❌ Contraseña inválida para usuario en DB:', email);
              return null;
            }
            console.log('⚠️ Usuario en DB no tiene passwordHash, no se puede autenticar via DB');
          }
        } catch (dbErr) {
          console.error('Error comprobando usuario en DB:', dbErr);
          // proceed to fallback
        }

        // 2) Fallback: check environment-stored admin credentials
        if (email !== ADMIN_EMAIL) {
          console.log('❌ Email no coincide con ADMIN_EMAIL env:', { provided: email, expected: ADMIN_EMAIL });
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isValidPassword) {
          console.log('❌ Contraseña incorrecta para ADMIN_EMAIL');
          return null;
        }

        console.log('✅ Autenticación exitosa vía env para:', email);
        return {
          id: 'admin',
          email,
          name: 'Administrador',
          role: 'ADMIN',
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