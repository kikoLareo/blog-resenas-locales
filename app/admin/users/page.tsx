import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail } from "lucide-react";

export default async function AdminUsersPage() {
  // Obtener la allowlist de emails desde las variables de entorno
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [
    'admin@example.com',
    'tu-email@gmail.com'
  ];

  // Roles por email
  const userRoles: Record<string, 'ADMIN' | 'EDITOR'> = {
    'admin@example.com': 'ADMIN',
    'editor@example.com': 'EDITOR',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios del sistema ({adminEmails.length})</p>
      </div>

      {/* Información del sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>
            Sistema de autenticación simplificado sin base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Autenticación OAuth</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Modo JWT (sin base de datos)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Allowlist de emails</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios autorizados */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Autorizados ({adminEmails.length})</CardTitle>
          <CardDescription>
            Emails que pueden acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminEmails.map((email, index) => {
              const role = userRoles[email] || 'ADMIN';
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{email}</h3>
                      <p className="text-sm text-gray-500">Usuario autorizado</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones de configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Para añadir o modificar usuarios autorizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Variables de Entorno</h4>
              <p className="text-sm text-blue-800 mb-3">
                Edita la variable <code className="bg-blue-100 px-1 rounded">ADMIN_EMAILS</code> en tu archivo <code className="bg-blue-100 px-1 rounded">.env</code>:
              </p>
              <pre className="text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`ADMIN_EMAILS="admin@example.com,tu-email@gmail.com,otro@ejemplo.com"`}
              </pre>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Proveedores OAuth</h4>
              <p className="text-sm text-green-800 mb-3">
                Configura las credenciales de OAuth en tu <code className="bg-green-100 px-1 rounded">.env</code>:
              </p>
              <pre className="text-xs bg-green-100 p-2 rounded overflow-x-auto">
{`GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GITHUB_ID=tu-github-client-id
GITHUB_SECRET=tu-github-client-secret`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
