import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';

const CreateUserForm = dynamic(() => import('@/components/admin/CreateUserForm'), { ssr: false });

export default async function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600">Crea usuarios nuevos y gestiona el acceso al panel.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear Usuario</CardTitle>
          <CardDescription>Introduce email y contraseña para generar el usuario en la base de datos segura.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas de Seguridad</CardTitle>
          <CardDescription>No se muestra información sensible (hashes/contraseñas).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700">
            <p>La creación de usuarios requiere la cabecera <code>x-admin-secret</code> con un secreto configurado en las variables de entorno (<code>ADMIN_API_SECRET</code>).</p>
            <p className="mt-2">Asegúrate de configurar <code>DATABASE_URL</code> en Vercel y ejecutar las migraciones de Prisma.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
