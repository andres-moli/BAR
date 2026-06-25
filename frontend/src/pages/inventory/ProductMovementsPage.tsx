import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package, Plus, Minus, RefreshCw, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { inventoryService, Movement } from '@/services/inventory';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/format';

export default function ProductMovementsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [adjustModal, setAdjustModal] = useState(false);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustDesc, setAdjustDesc] = useState('');

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['inventory-product', productId],
    queryFn: () => inventoryService.getProductStock(productId!),
    enabled: !!productId,
  });

  const { data: movements, isLoading: movementsLoading } = useQuery({
    queryKey: ['inventory-movements', productId],
    queryFn: () => inventoryService.getMovements(productId!),
    enabled: !!productId,
  });

  const adjustMutation = useMutation({
    mutationFn: (payload: { quantity: number; description?: string }) =>
      inventoryService.adjustStock(productId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-product', productId] });
      queryClient.invalidateQueries({ queryKey: ['inventory-movements', productId] });
      toast.success('Stock ajustado');
      setAdjustModal(false);
    },
    onError: () => toast.error('Error al ajustar stock'),
  });

  const getMovementIcon = (tipo: string) => {
    switch (tipo) {
      case 'ENTRY': return <Plus size={16} className="text-emerald-400" />;
      case 'EXIT': return <Minus size={16} className="text-red-400" />;
      case 'ADJUSTMENT': return <Edit3 size={16} className="text-amber-400" />;
      default: return <RefreshCw size={16} className="text-dark-400" />;
    }
  };

  const getMovementLabel = (tipo: string) => {
    const map: Record<string, string> = { ENTRY: 'Entrada', EXIT: 'Salida', ADJUSTMENT: 'Ajuste' };
    return map[tipo] || tipo;
  };

  const stockClass = product
    ? product.stock <= 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
    : '';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/inventory')} className="p-2 rounded-lg hover:bg-dark-800 transition-colors">
          <ArrowLeft size={20} className="text-dark-400" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{product?.nombre || 'Cargando...'}</h1>
          </div>
          <p className="text-dark-400 text-sm mt-1">
            {product?.category?.nombre || product?.category?.name || 'Sin categoría'} · {product && formatCurrency(product.precio)}
          </p>
        </div>
        {product && (
          <div className="ml-auto text-right">
            <p className={`text-2xl font-bold ${stockClass}`}>{product.stock}</p>
            <Badge variant={product.stock <= 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'} size="sm">
              {product.stock <= 0 ? 'Sin stock' : product.stock <= 5 ? 'Stock bajo' : 'En stock'}
            </Badge>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Edit3 size={14} />} onClick={() => { setAdjustModal(true); setAdjustQty(product?.stock || 0); }}>
            Ajustar Stock
          </Button>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Historial de Movimientos</h2>

        {movementsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-dark-800 rounded-lg h-16" />
            ))}
          </div>
        ) : !movements || movements.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Sin movimientos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {movements.map((m: Movement) => (
              <div key={m.id} className="glass-card rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                  {getMovementIcon(m.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{getMovementLabel(m.tipo)}</span>
                    <Badge variant={m.tipo === 'ENTRY' ? 'success' : m.tipo === 'EXIT' ? 'danger' : 'warning'} size="sm">
                      {m.tipo === 'ENTRY' ? '+' : m.tipo === 'EXIT' ? '-' : '='}{m.cantidad}
                    </Badge>
                  </div>
                  {m.descripcion && (
                    <p className="text-xs text-dark-400 mt-0.5">{m.descripcion}</p>
                  )}
                </div>
                <div className="text-right text-xs text-dark-400">
                  <p>{m.user?.nombre || 'Usuario'}</p>
                  <p>{new Date(m.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={adjustModal}
        onClose={() => setAdjustModal(false)}
        title="Ajustar Stock"
        size="sm"
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="ghost" onClick={() => setAdjustModal(false)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => adjustMutation.mutate({ quantity: adjustQty, description: adjustDesc || undefined })}
              loading={adjustMutation.isPending}
              disabled={adjustQty < 0}
            >
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="glass-panel rounded-lg p-3">
            <p className="text-sm text-dark-400">Producto</p>
            <p className="text-white font-medium">{product?.nombre}</p>
            <p className="text-xs text-dark-400 mt-1">Stock actual: {product?.stock}</p>
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Nueva cantidad</label>
            <Input
              type="number"
              min={0}
              value={adjustQty}
              onChange={(e) => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Descripción (opcional)</label>
            <Input
              value={adjustDesc}
              onChange={(e) => setAdjustDesc(e.target.value)}
              placeholder="Motivo del ajuste..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
