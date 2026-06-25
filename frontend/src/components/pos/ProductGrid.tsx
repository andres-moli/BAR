import React, { useState, useMemo } from 'react';
import { Search, Coffee, Beer, Wine, UtensilsCrossed, Cake, GlassWater, MoreHorizontal } from 'lucide-react';
import type { Product, Category } from '../../types';
import { SearchInput } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  loading?: boolean;
  categories?: Category[];
}

const defaultCategoryIcons: Record<string, React.ReactNode> = {
  comida: <UtensilsCrossed size={16} />,
  bebida: <GlassWater size={16} />,
  licor: <Wine size={16} />,
  cerveza: <Beer size={16} />,
  vino: <Wine size={16} />,
  cafe: <Coffee size={16} />,
  postre: <Cake size={16} />,
  otro: <MoreHorizontal size={16} />,
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  loading = false,
  categories = [],
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');

  const availableCategories = useMemo(() => {
    const catIds = new Set(products.map((p) => p.categoria_id));
    return categories.filter((c) => catIds.has(c.id));
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.categoria_id === activeCategory;
      const matchesSearch =
        !search ||
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const getCategoryIcon = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    const iconKey = cat?.nombre?.toLowerCase() || 'otro';
    return defaultCategoryIcons[iconKey] || defaultCategoryIcons.otro;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-10 bg-gray-800 rounded-lg" />
        <div className="animate-pulse flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-800 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {getCategoryIcon(cat.id)}
            {cat.nombre}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductClick(product)}
              disabled={!product.activo}
              className={`relative glass-card rounded-xl p-3 text-left transition-all duration-200 group ${
                product.activo
                  ? 'hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer active:scale-[0.98]'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              {!product.activo && (
                <Badge variant="danger" size="sm" className="absolute top-2 right-2">
                  Inactivo
                </Badge>
              )}
              <div className="w-full h-20 bg-gray-800 rounded-lg mb-2.5 flex items-center justify-center overflow-hidden">
                {product.imagen ? (
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-600 group-hover:text-amber-500/50 transition-colors">
                    {getCategoryIcon(product.categoria_id)}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                  {product.nombre}
                </p>
                <p className="text-sm font-bold text-amber-400">
                  {formatPrice(product.precio)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
