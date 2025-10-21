import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, offers: 0 });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const products = await api.getProducts().catch(() => []);
        const offers = await api.getSpecialOffers(100).catch(() => []);
        if (!mounted) return;
        setStats({ products: (products as any[]).length, offers: (offers as any[]).length });
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Visão Geral</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-forest-green/5 rounded">
          <h3 className="text-sm text-gray-600">Produtos</h3>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="p-4 bg-joy-orange/5 rounded">
          <h3 className="text-sm text-gray-600">Ofertas</h3>
          <p className="text-2xl font-bold">{stats.offers}</p>
        </div>
      </div>
    </div>
  );
}
