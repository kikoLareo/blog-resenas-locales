"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, MapPin, Settings, Users, Home, BookOpen, Tag, Star, Layout, TrendingUp, QrCode, Layers } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Reseñas", href: "/dashboard/reviews", icon: FileText },
  { name: "Locales", href: "/dashboard/venues", icon: MapPin },
  { name: "Ciudades", href: "/dashboard/cities", icon: BarChart3 },
  { name: "Categorías", href: "/dashboard/categories", icon: Tag },
  { name: "Contenidos SEO", href: "/dashboard/content", icon: Layers },
  { name: "Destacados", href: "/dashboard/featured", icon: Star },
  { name: "Secciones Homepage", href: "/dashboard/homepage-sections", icon: Layout },
  { name: "Blog", href: "/dashboard/blog", icon: BookOpen },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Códigos QR", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white dark:bg-card border-r border-gray-200 dark:border-border min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
            const activeClasses = "bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500";
            const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100";
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}