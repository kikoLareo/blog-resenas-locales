"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Aún cargando
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión o no es admin, no mostrar nada (se está redirigiendo)
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  // Mostrar el panel de admin
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
