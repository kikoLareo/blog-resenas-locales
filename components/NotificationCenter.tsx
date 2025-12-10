"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Notification, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock data for initial development
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Bienvenido a SaborLocal",
    message: "Gracias por unirte a nuestra comunidad de amantes de la gastronomía.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Nueva reseña publicada",
    message: "Tu reseña sobre 'Casa Botín' ha sido publicada exitosamente.",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    link: "/madrid/casa-botin/review/cena-inolvidable-casa-botin"
  },
  {
    id: "3",
    title: "Actualización de perfil",
    message: "Recuerda completar tu perfil para obtener mejores recomendaciones.",
    type: "warning",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50 transition-colors">
          <Bell className="h-5 w-5 text-foreground/80" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full animate-in zoom-in duration-300"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Marcar todo como leído
              </Button>
            )}
          </div>
          <SheetDescription>
            Mantente al día con las últimas novedades de tu cuenta y la comunidad.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
              <Bell className="h-12 w-12 opacity-20" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "group relative flex gap-4 p-4 rounded-xl transition-all duration-200 border",
                    notification.read 
                      ? "bg-background border-border/40 opacity-70 hover:opacity-100" 
                      : "bg-card border-border shadow-sm hover:shadow-md"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn("text-sm font-semibold leading-none", !notification.read && "text-primary")}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>

                    {notification.link && (
                      <Link 
                        href={notification.link}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className="inline-block text-xs font-medium text-primary hover:underline mt-2"
                      >
                        Ver detalles →
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 bg-background/80 backdrop-blur-sm rounded-lg p-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-primary"
                        onClick={() => markAsRead(notification.id)}
                        title="Marcar como leída"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
