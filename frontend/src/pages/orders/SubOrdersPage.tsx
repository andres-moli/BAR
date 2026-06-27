import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { subOrdersService } from '@/services/subOrders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency } from '@/utils/format';
import { handleError } from '@/utils/errorHandler';
import type { OrderItem } from '@/types';

export default function SubOrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [itemMap, setItemMap] = useState<Record<string, OrderItem[]>>({});

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['sub-orders', 'pending'],
    queryFn: () => subOrdersService.getPending(),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (pending.length === 0) { setItemMap({}); return; }
    let cancelled = false;
    const ids = pending.map((s) => s.id);
    Promise.all(ids.map((id) => subOrdersService.getItems(id))).then((results) => {
      if (cancelled) return;
      const map: Record<string, OrderItem[]> = {};
      ids.forEach((id, i) => { map[id] = results[i]; });
      setItemMap(map);
    });
    return () => { cancelled = true; };
  }, [pending]);

  const deliverMutation = useMutation({
    mutationFn: (id: string) => subOrdersService.deliver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Sub-orden entregada');
    },
    onError: (err) => handleError(err, 'Error al entregar sub-orden'),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Sub-órdenes Pendientes</h1>
          <span className="text-sm text-dark-400 bg-dark-800 px-3 py-1 rounded-full">{pending.length} pendientes</span>
        </div>
        <Button variant="secondary" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={() => queryClient.invalidateQueries({ queryKey: ['sub-orders'] })}>
          Refrescar
        </Button>
      </div>

      {pending.length === 0 ? (
        <EmptyState title="No hay sub-órdenes pendientes" description="Todas las sub-órdenes han sido entregadas" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.map((so) => {
            const items = itemMap[so.id] || [];
            const total = items.reduce((s, i) => s + Number(i.subtotal), 0);
            return (
              <Card key={so.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Suborden #{so.id.slice(-6)}
                    </p>
                    <p className="text-xs text-dark-400">
                      {so.mesa_numero ? `${so.mesa_nombre || `Mesa #${so.mesa_numero}`} · ` : ''}Creado por: {so.creado_por}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    Pendiente
                  </span>
                </div>
                <div className="space-y-1">
                  {items.length === 0 ? (
                    <p className="text-sm text-dark-500">Cargando items...</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-dark-300">{item.cantidad}x {item.combo_nombre || item.producto_nombre || `Producto #${item.producto_id || ''}`}</span>
                        <span className="text-dark-200">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dark-700">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-lg font-bold text-primary-400">{formatCurrency(total)}</span>
                </div>
                <Button
                  className="w-full"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => deliverMutation.mutate(so.id)}
                  loading={deliverMutation.isPending}
                >
                  Marcar como Entregada
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
