import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getAuthToken, clearAuthToken } from '../../lib/auth';
import { LogOut, Grid, Box, PlusSquare } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-bold text-xl text-deep-navy">Admin • Focinhus</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="text-sm px-3 py-2 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-lg p-4 shadow">
            <nav className="space-y-2">
              <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                <Grid className="h-4 w-4" /> Dashboard
              </Link>
              <Link to="/admin/products" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                <Box className="h-4 w-4" /> Produtos
              </Link>
              <Link to="/admin/products/new" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                <PlusSquare className="h-4 w-4" /> Novo Produto
              </Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-lg p-6 shadow">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
