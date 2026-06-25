import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, AlertTriangle, Plus, Minus, RefreshCw, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { inventoryService } from '@/services/inventory';
import { categoriesService } from '@/services/categories';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/format';

export default function InventoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [bajoStock, setBajoStock] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [movementModal, setMovementModal] = useState<{ product: Product; type: 'ENTRY' | 'EXIT' } | null>(null);
  const [movementQty, setMovementQty] = useState(1);
  const [movementDesc, setMovementDesc] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['inventory', search, bajoStock, categoryFilter],
    queryFn: () => inventoryService.getAll({ search: search || undefined, bajoStock: bajoStock || undefined, categoria_id: categoryFilter as any }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const movementMutation = useMutation({
    mutationFn: (payload: { productId: string; type: 'ENTRY' | 'EXIT'; quantity: number; description?: string }) =>
      inventoryService.createMovement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Movimiento registrado');
      setMovementModal(null);
      setMovementQty(1);
      setMovementDesc('');
    },
    onError: () => toast.error('Error al registrar movimiento'),
  });

  const lowStockCount = (products || []).filter((p) => p.stock <= 5).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventario</h1>
          <p className="text-dark-400 text-sm mt-1">
            {(products || []).length} productos
            {lowStockCount > 0 && (
              <span className="text-red-400 ml-2">· {lowStockCount} con stock bajo</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setBajoStock(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            !bajoStock ? 'bg-amber-500/20 text-amber-400' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
          }`}
        >
          <Package size={16} />
          Todos
        </button>
        <button
          onClick={() => setBajoStock(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            bajoStock ? 'bg-red-500/20 text-red-400' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
          }`}
        >
          <AlertTriangle size={16} />
          Stock Bajo
        </button>
        {(categories || []).filter((c: any) => c.activo).map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(categoryFilter === cat.id ? undefined : cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat.id ? 'bg-amber-500/20 text-amber-400' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="relative">
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-dark-800 rounded-xl h-20" />
          ))}
        </div>
      ) : (products || []).length === 0 ? (
        <div className="text-center py-16 text-dark-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No se encontraron productos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(products || []).map((product) => {
            const stockClass = product.stock <= 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400';
            const stockLabel = product.stock <= 0 ? 'Sin stock' : product.stock <= 5 ? 'Stock bajo' : 'En stock';

            return (
              <div
                key={product.id}
                className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-amber-500/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/inventory/${product.id}`)}
              >
                <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-dark-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.nombre}</p>
                  <p className="text-xs text-dark-400 truncate">
                    {product.category?.nombre || product.category?.name || 'Sin categoría'} · {formatCurrency(product.precio)}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${stockClass}`}>{product.stock}</p>
                  <Badge variant={product.stock <= 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'} size="sm">
                    {stockLabel}
                  </Badge>
                </div>

                {isAdmin && (
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-emerald-400 hover:!bg-emerald-500/10"
                      onClick={() => { setMovementModal({ product, type: 'ENTRY' }); setMovementQty(1); setMovementDesc(''); }}
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-red-400 hover:!bg-red-500/10"
                      onClick={() => { setMovementModal({ product, type: 'EXIT' }); setMovementQty(1); setMovementDesc(''); }}
                      disabled={product.stock <= 0}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!movementModal}
        onClose={() => setMovementModal(null)}
        title={movementModal?.type === 'ENTRY' ? 'Entrada de Stock' : 'Salida de Stock'}
        size="sm"
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="ghost" onClick={() => setMovementModal(null)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => movementModal && movementMutation.mutate({
                productId: String(movementModal.product.id),
                type: movementModal.type,
                quantity: movementQty,
                description: movementDesc || undefined,
              })}
              loading={movementMutation.isPending}
              disabled={movementQty <= 0}
            >
              Confirmar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="glass-panel rounded-lg p-3">
            <p className="text-sm text-dark-400">Producto</p>
            <p className="text-white font-medium">{movementModal?.product.nombre}</p>
            <p className="text-xs text-dark-400 mt-1">Stock actual: {movementModal?.product.stock}</p>
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Cantidad</label>
            <Input
              type="number"
              min={1}
              value={movementQty}
              onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Descripción (opcional)</label>
            <Input
              value={movementDesc}
              onChange={(e) => setMovementDesc(e.target.value)}
              placeholder="Motivo del movimiento..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
