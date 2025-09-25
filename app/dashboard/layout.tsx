import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { createAdminMetadata } from "@/lib/seo-protection";

export const metadata = createAdminMetadata("Dashboard Admin");

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // El middleware ya maneja la autenticación, solo renderizar el layout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}