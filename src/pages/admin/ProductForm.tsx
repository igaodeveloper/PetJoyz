import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Record<string, any>>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    category: '',
    badges: [],
    variants: []
  });

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const p = await api.getProducts();
        const found = (p as any[]).find(x => x.id === id);
        if (mounted) setProduct(found || product);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (key: string, value: any) => {
    setProduct((prev: Record<string, any>) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.updateProduct(id, product);
      } else {
        await api.createProduct(product);
      }
      navigate('/admin/products');
    } catch (e) {
      alert('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Editar Produto' : 'Novo Produto'}</h1>
      {loading ? <div>Carregando...</div> : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input value={product.title} onChange={e => handleChange('title', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input value={product.slug} onChange={e => handleChange('slug', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <textarea value={product.description} onChange={e => handleChange('description', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Preço (em centavos)</label>
              <input type="number" value={product.price} onChange={e => handleChange('price', Number(e.target.value))} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Estoque</label>
              <input type="number" value={product.stock} onChange={e => handleChange('stock', Number(e.target.value))} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Imagens (URLs separadas por vírgula)</label>
            <input value={(product.images || []).join(',')} onChange={e => handleChange('images', e.target.value.split(',').map(s => s.trim()))} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-joy-orange text-white px-4 py-2 rounded">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
