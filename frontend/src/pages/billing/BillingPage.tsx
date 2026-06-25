import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Printer, FileText, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { billingService } from '@/services/billing';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

export default function BillingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['billing', 'pending'],
    queryFn: billingService.getOrdersForBilling,
    refetchInterval: 30000,
  });

  const filteredOrders = (orders || []).filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toString().includes(q) ||
      (o.mesa_numero?.toString().includes(q)) ||
      (o.usuario_nombre?.toLowerCase().includes(q))
    );
  });

  const printMutation = useMutation({
    mutationFn: (orderId: number) => billingService.printInvoice(orderId),
    onSuccess: () => toast.success('Imprimiendo factura...'),
    onError: () => toast.error('Error al imprimir'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Facturación</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-dark-400 mb-4">Error al cargar pedidos pendientes</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Pedido', render: (o) => <span className="font-mono text-primary-400 font-bold">#{o.id}</span> },
    { key: 'mesa_numero', header: 'Mesa', render: (o) => <span>Mesa {o.mesa_numero || o.mesa_id}</span> },
    { key: 'usuario_nombre', header: 'Mesero', render: (o) => <span>{o.usuario_nombre || `#${o.usuario_id}`}</span> },
    { key: 'estado', header: 'Estado', render: (o) => <StatusBadge status={o.estado} label={ORDER_STATUS_LABELS[o.estado]} /> },
    { key: 'items', header: 'Productos', render: (o) => <span>{o.items?.reduce((a, b) => a + b.cantidad, 0) || 0}</span> },
    { key: 'total', header: 'Total', render: (o) => <span className="font-bold text-white">{formatCurrency(o.total)}</span> },
    { key: 'created_at', header: 'Fecha', render: (o) => <span className="text-dark-400 text-xs">{formatDateTime(o.created_at)}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Facturación</h1>
          <p className="text-dark-400 text-sm mt-1">{orders?.length || 0} pedidos pendientes de facturar</p>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos pendientes"
          description="Todos los pedidos han sido facturados."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-dark-800/80 border border-dark-700 rounded-xl p-4 hover:border-dark-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-primary-400 font-bold text-lg">#{order.id}</span>
                  <StatusBadge status={order.estado} label={ORDER_STATUS_LABELS[order.estado]} />
                  <span className="text-dark-400 text-sm">Mesa {order.mesa_numero || order.mesa_id}</span>
                  <span className="text-dark-400 text-sm">{order.usuario_nombre || `Mesero #${order.usuario_id}`}</span>
                </div>
                <span className="text-xl font-bold text-white">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {order.items?.slice(0, 5).map((item) => (
                    <span key={item.id} className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded-md">
                      {item.producto_nombre || `Producto #${item.producto_id}`} x{item.cantidad}
                    </span>
                  ))}
                  {(order.items?.length || 0) > 5 && (
                    <span className="text-xs bg-dark-700 text-dark-400 px-2 py-1 rounded-md">
                      +{order.items!.length - 5} más
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => billingService.generateInvoice(order.id)}>
                    <FileText className="w-4 h-4" />
                    Factura
                  </Button>
                  {order.estado === 'facturada' && (
                    <Button variant="ghost" size="sm" onClick={() => printMutation.mutate(order.id)}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  )}
                  {order.estado !== 'facturada' && (
                    <Button size="sm" onClick={() => navigate(`/billing/${order.id}`)}>
                      <CreditCard className="w-4 h-4" />
                      Cobrar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
