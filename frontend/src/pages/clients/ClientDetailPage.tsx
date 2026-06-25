import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Phone, Mail, MapPin, ShoppingBag, FileText } from 'lucide-react';
import { clientsService } from '@/services/clients';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ORDER_STATUS_LABELS, COLLECTION_STATUS_LABELS } from '@/utils/constants';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = parseInt(id || '0');

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsService.getById(clientId),
    enabled: !!clientId,
  });

  const { data: orders } = useQuery({
    queryKey: ['client', clientId, 'orders'],
    queryFn: () => clientsService.getOrders(clientId),
    enabled: !!clientId,
  });

  const { data: collectionAccounts } = useQuery({
    queryKey: ['client', clientId, 'collections'],
    queryFn: () => clientsService.getCollectionAccounts(clientId),
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <EmptyState
        title="Cliente no encontrado"
        action={<Button onClick={() => navigate('/clients')} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>}
      />
    );
  }

  const totalCompras = orders?.reduce((sum, o) => sum + o.total, 0) || 0;
  const deudaTotal = collectionAccounts?.reduce((sum, c) => sum + (c.pendiente || 0), 0) || 0;
  const totalPedidos = orders?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Detalle del Cliente</h1>
      </div>

      <Card>
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{client.nombre}</h2>
            <p className="text-dark-400 text-sm">{client.documento}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-dark-300">
                <Phone className="w-4 h-4 text-dark-400" /> {client.telefono}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-dark-300">
                <Mail className="w-4 h-4 text-dark-400" /> {client.email}
              </div>
              {client.direccion && (
                <div className="flex items-center gap-1.5 text-sm text-dark-300">
                  <MapPin className="w-4 h-4 text-dark-400" /> {client.direccion}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPedidos}</p>
              <p className="text-xs text-dark-400">Total Compras</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/10">
              <ShoppingBag className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCompras)}</p>
              <p className="text-xs text-dark-400">Monto Total</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10">
              <FileText className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(deudaTotal)}</p>
              <p className="text-xs text-dark-400">Deuda Pendiente</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Historial de Compras</h3>
        {orders && orders.length > 0 ? (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-dark-700/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-primary-400 font-bold">#{order.id}</span>
                  <StatusBadge status={order.estado} label={ORDER_STATUS_LABELS[order.estado]} />
                  <span className="text-dark-400 text-xs">{formatDateTime(order.created_at)}</span>
                </div>
                <span className="font-semibold text-white">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dark-400 text-center py-4">No hay compras registradas</p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Cuentas de Cobro Pendientes</h3>
        {collectionAccounts && collectionAccounts.length > 0 ? (
          <div className="space-y-2">
            {collectionAccounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-dark-700/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/invoices/${acc.id}`)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-primary-400 font-bold">{acc.consecutivo}</span>
                  <StatusBadge status={acc.estado} label={COLLECTION_STATUS_LABELS[acc.estado]} />
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-dark-400">Total: {formatCurrency(acc.total)}</span>
                  <span className="text-sm text-red-400 font-medium">Pendiente: {formatCurrency(acc.pendiente)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dark-400 text-center py-4">No hay cuentas de cobro pendientes</p>
        )}
      </Card>
    </div>
  );
}
