'use client'

import { useState } from 'react';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [adminSecret, setAdminSecret] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret || ''
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data?.error || 'Error');
        return;
      }

      setStatus('success');
      setMessage('Usuario creado: ' + data.user.email);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Error de red');
    }
  }

  return (
    <form role="form" onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" type="email" required />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" type="password" required />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300">
          <option value="MEMBER">MEMBER</option>
          <option value="EDITOR">EDITOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <div>
        <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700">Admin API Secret</label>
        <input id="adminSecret" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" type="password" placeholder="Secreto admin para la API" required />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creando…' : 'Crear usuario'}
        </button>
      </div>

      {message && (
        <div className={`py-2 px-3 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
