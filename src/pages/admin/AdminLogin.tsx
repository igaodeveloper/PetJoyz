import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { setAuthToken } from '../../lib/auth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminLogin(username, password);
      setAuthToken(res.token);
      navigate('/admin');
    } catch (e: any) {
      setError(e?.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Painel Admin — Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Usuário</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-joy-orange text-white px-4 py-2 rounded">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
