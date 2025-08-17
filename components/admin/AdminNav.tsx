"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  FileText, 
  MapPin, 
  Settings, 
  Users,
  Home
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Reseñas", href: "/admin/reviews", icon: FileText },
  { name: "Locales", href: "/admin/venues", icon: MapPin },
  { name: "Ciudades", href: "/admin/cities", icon: MapPin },
  { name: "Categorías", href: "/admin/categories", icon: FileText },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Usuarios", href: "/admin/users", icon: Users },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
            const activeClasses = "bg-blue-50 text-blue-700 border-r-2 border-blue-700";
            const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
            
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
