import { createAdminMetadata } from "@/lib/seo-protection";

export const metadata = createAdminMetadata("Acceso Admin");

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
