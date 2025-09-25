"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/dashboard/acceso" });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <h1 className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Panel de Control
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.name || user.email}</span>
              <span className="text-gray-400">•</span>
              <span className="capitalize">{user.role?.toLowerCase()}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}