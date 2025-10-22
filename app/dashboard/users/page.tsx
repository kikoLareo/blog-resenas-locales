"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Shield, Edit, Trash2, CheckCircle, XCircle, Key, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: 'ADMIN' | 'EDITOR' | 'MEMBER' | 'GUEST';
  createdAt: string;
  updatedAt: string;
  emailVerified: Date | null;
  image: string | null;
  _count: {
    accounts: number;
    sessions: number;
    paywallSubscriptions: number;
  };
}

interface Stats {
  total: number;
  byRole: {
    ADMIN: number;
    EDITOR: number;
    MEMBER: number;
    GUEST: number;
  };
  verified: number;
  withImage: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState('');
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Formulario para crear usuario
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
  const [creating, setCreating] = useState(false);

  // Edición de usuario
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');

  // Cambio de contraseña
  const [changingPassword, setChangingPassword] = useState<string | null>(null);
  const [newUserPassword, setNewUserPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuarios cuando cambian los filtros
  useEffect(() => {
    let filtered = users;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    const secret = localStorage.getItem('admin-secret') || '';
    setAdminSecret(secret);
    
    if (!secret) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-secret': secret
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        setStats(data.stats);
      } else {
        setMessage({ type: 'error', text: 'Error al cargar usuarios. Verifica el secret.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecret = () => {
    localStorage.setItem('admin-secret', adminSecret);
    loadUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName || null,
          role: newRole
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Usuario ${data.user.email} creado exitosamente` });
        setNewEmail('');
        setNewPassword('');
        setNewName('');
        setNewRole('MEMBER');
        setShowCreateForm(false);
        loadUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al crear usuario' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al crear usuario' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify({
          role: editRole,
          name: editName || null,
          username: editUsername || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario actualizado exitosamente' });
        setEditingUser(null);
        loadUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al actualizar usuario' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al actualizar usuario' });
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!newUserPassword || newUserPassword.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify({
          password: newUserPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
        setChangingPassword(null);
        setNewUserPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al cambiar contraseña' });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}?`)) {
      return;
    }

    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario eliminado exitosamente' });
        loadUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al eliminar usuario' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al eliminar usuario' });
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user.id);
    setEditRole(user.role);
    setEditName(user.name || '');
    setEditUsername(user.username || '');
  };

  const startChangePassword = (userId: string) => {
    setChangingPassword(userId);
    setNewUserPassword('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'EDITOR': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      case 'GUEST': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!adminSecret) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Requiere autenticación con Admin Secret</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Configurar Admin Secret</CardTitle>
            <CardDescription>
              Ingresa el Admin API Secret configurado en las variables de entorno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="secret">Admin API Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Ingresa el secret"
                />
              </div>
              <Button onClick={handleSaveSecret}>
                Guardar y Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios y sus roles</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {showCreateForm ? 'Cancelar' : 'Nuevo Usuario'}
        </Button>
      </div>

      {/* Mensaje de feedback */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.verified} verificados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byRole.ADMIN}</div>
              <p className="text-xs text-muted-foreground">
                Acceso completo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Editores</CardTitle>
              <Edit className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
              <div className="text-2xl font-bold">{stats.byRole.EDITOR}</div>
              <p className="text-xs text-muted-foreground">
                Edición de contenido
              </p>
        </CardContent>
      </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byRole.MEMBER + stats.byRole.GUEST}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios básicos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Usuario</CardTitle>
            <CardDescription>
              Completa los datos para crear un nuevo usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="newEmail">Email *</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="newName">Nombre</Label>
                <Input
                  id="newName"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Contraseña *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <Label htmlFor="newRole">Rol *</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GUEST">GUEST - Invitado</SelectItem>
                    <SelectItem value="MEMBER">MEMBER - Usuario básico</SelectItem>
                    <SelectItem value="EDITOR">EDITOR - Editor de contenido</SelectItem>
                    <SelectItem value="ADMIN">ADMIN - Administrador completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creando...' : 'Crear Usuario'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por email, nombre o username..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="roleFilter">Filtrar por Rol</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="EDITOR">EDITOR</SelectItem>
                  <SelectItem value="MEMBER">MEMBER</SelectItem>
                  <SelectItem value="GUEST">GUEST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchTerm || roleFilter !== 'all') && (
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'} 
            {(searchTerm || roleFilter !== 'all') && ` encontrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                {editingUser === user.id ? (
                  // Modo edición
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Nombre</Label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nombre del usuario"
                        />
                      </div>
                      <div>
                        <Label>Username</Label>
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          placeholder="Username único"
                        />
                      </div>
                      <div>
                        <Label>Rol</Label>
                        <Select value={editRole} onValueChange={setEditRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GUEST">GUEST</SelectItem>
                            <SelectItem value="MEMBER">MEMBER</SelectItem>
                            <SelectItem value="EDITOR">EDITOR</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateUser(user.id)} size="sm">
                        Guardar Cambios
                      </Button>
                      <Button onClick={() => setEditingUser(null)} variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : changingPassword === user.id ? (
                  // Modo cambio de contraseña
                  <div className="space-y-4">
                    <div className="max-w-md">
                      <Label>Nueva Contraseña para {user.email}</Label>
                      <Input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleChangePassword(user.id)} size="sm">
                        Cambiar Contraseña
                      </Button>
                      <Button onClick={() => {
                        setChangingPassword(null);
                        setNewUserPassword('');
                      }} variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name || user.email}</span>
                            {user.emailVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-600" title="Email verificado" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" title="Email no verificado" />
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.username && (
                            <div className="text-xs text-gray-400">@{user.username}</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Creado: {new Date(user.createdAt).toLocaleDateString('es-ES')} • 
                            {user._count.sessions} sesiones • 
                            {user._count.paywallSubscriptions} suscripciones
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(user)} variant="outline" size="sm" title="Editar usuario">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => startChangePassword(user.id)} variant="outline" size="sm" title="Cambiar contraseña">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteUser(user.id, user.email || '')} 
                        variant="destructive" 
                        size="sm"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm || roleFilter !== 'all' 
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'No hay usuarios registrados aún'
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
