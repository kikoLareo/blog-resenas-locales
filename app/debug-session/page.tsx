"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug de Sesión</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Status:</strong> {status}
              </div>
              
              <div>
                <strong>Session:</strong>
                <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              
              <div>
                <strong>Variables de entorno:</strong>
                <div className="bg-gray-100 p-4 rounded mt-2">
                  <div>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'No configurado'}</div>
                  <div>ADMIN_USERNAME: {process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'No configurado'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


