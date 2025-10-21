import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const p = await api.getProducts();
        if (!mounted) return;
        setProducts(p as any[]);
      } catch (e) {
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Erro ao remover produto');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link to="/admin/products/new" className="bg-joy-orange text-white px-4 py-2 rounded">Novo Produto</Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Título</th>
                <th className="p-2">Preço</th>
                <th className="p-2">Estoque</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2 align-top">{p.id}</td>
                  <td className="p-2 align-top">{p.title}</td>
                  <td className="p-2 align-top">{(p.price/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                  <td className="p-2 align-top">{p.stock ?? '-'}</td>
                  <td className="p-2 align-top">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="px-3 py-1 rounded bg-forest-green/10 text-forest-green">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="px-3 py-1 rounded bg-rose-50 text-rose-600">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
