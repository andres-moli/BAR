import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Printer, DollarSign, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoicesService } from '@/services/invoices';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { COLLECTION_STATUS_LABELS } from '@/utils/constants';

export default function CollectionAccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accountId = parseInt(id || '0');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    monto: 0,
    paymentMethodId: '1',
    referencia: '',
  });

  const { data: account, isLoading } = useQuery({
    queryKey: ['collection-account', accountId],
    queryFn: () => invoicesService.getById(accountId),
    enabled: !!accountId,
  });

  const { data: payments } = useQuery({
    queryKey: ['collection-payments', accountId],
    queryFn: () => invoicesService.getPayments(accountId),
    enabled: !!accountId,
  });

  const paymentMutation = useMutation({
    mutationFn: () => invoicesService.registerPayment({
      cuenta_cobro_id: accountId,
      monto: paymentData.monto,
      paymentMethodId: paymentData.paymentMethodId,
      referencia: paymentData.referencia || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-account', accountId] });
      queryClient.invalidateQueries({ queryKey: ['collection-payments', accountId] });
      queryClient.invalidateQueries({ queryKey: ['collection-accounts'] });
      toast.success('Pago registrado');
      setShowPaymentModal(false);
      setPaymentData({ monto: 0, paymentMethodId: '1', referencia: '' });
    },
    onError: () => toast.error('Error al registrar pago'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!account) {
    return (
      <EmptyState
        title="Cuenta no encontrada"
        action={<Button onClick={() => navigate('/invoices')} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono">{account.consecutivo}</h1>
              <StatusBadge status={account.estado} label={COLLECTION_STATUS_LABELS[account.estado]} size="md" />
            </div>
            <p className="text-dark-400 text-sm mt-1">Creada el {formatDate(account.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {account.estado !== 'pagada' && account.estado !== 'anulada' && (
            <Button onClick={() => {
              setPaymentData({ ...paymentData, monto: account.pendiente });
              setShowPaymentModal(true);
            }}>
              <DollarSign className="w-4 h-4" />
              Registrar Pago
            </Button>
          )}
          <Button variant="secondary" onClick={() => invoicesService.print(accountId)}>
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Información del Cliente</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">{account.cliente_nombre || `Cliente #${account.cliente_id}`}</p>
                <p className="text-sm text-dark-400">ID: {account.cliente_id}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Pedidos Asociados</h3>
            <div className="flex flex-wrap gap-2">
              {account.pedidos?.map((pid) => (
                <span
                  key={pid}
                  className="px-3 py-1.5 bg-dark-700 rounded-lg text-sm font-mono text-primary-400 cursor-pointer hover:bg-dark-600 transition-colors"
                  onClick={() => navigate(`/orders/${pid}`)}
                >
                  #{pid}
                </span>
              ))}
              {(!account.pedidos || account.pedidos.length === 0) && (
                <p className="text-sm text-dark-400">Sin pedidos asociados</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Historial de Pagos</h3>
            {payments && payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{formatCurrency(p.monto)}</p>
                      <p className="text-xs text-dark-400">{formatDateTime(p.created_at)}</p>
                    </div>
                    <span className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded-md">{p.paymentMethod?.name || p.paymentMethodId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400 text-center py-4">No hay pagos registrados</p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Resumen de Saldo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-dark-400">Total</span>
                <span className="text-xl font-bold text-white">{formatCurrency(account.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400">Abonado</span>
                <span className="text-lg font-semibold text-green-400">{formatCurrency(account.abonado)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dark-700">
                <span className="text-dark-300 font-medium">Pendiente</span>
                <span className="text-2xl font-bold text-red-400">{formatCurrency(account.pendiente)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-dark-400" />
                <span className="text-dark-400">Emisión:</span>
                <span className="text-white">{formatDate(account.fecha_emision)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-dark-400" />
                <span className="text-dark-400">Vencimiento:</span>
                <span className="text-white">{formatDate(account.fecha_vencimiento)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); }}
        title="Registrar Pago"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
            <Button onClick={() => paymentMutation.mutate()} loading={paymentMutation.isPending}>
              <DollarSign className="w-4 h-4" />
              Registrar Pago
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-dark-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-dark-400">Total</span>
              <span className="text-white font-semibold">{formatCurrency(account.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Abonado</span>
              <span className="text-green-400">{formatCurrency(account.abonado)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700">
              <span className="text-dark-300">Pendiente</span>
              <span className="text-red-400">{formatCurrency(account.pendiente)}</span>
            </div>
          </div>
          <Input
            label="Monto a Pagar"
            type="number"
            value={paymentData.monto || ''}
            onChange={(e) => setPaymentData({ ...paymentData, monto: parseFloat(e.target.value) || 0 })}
          />
          <Select
            label="Método de Pago"
            value={paymentData.paymentMethodId}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMethodId: e.target.value })}
            options={[
              { value: '1', label: 'Efectivo' },
              { value: '2', label: 'Tarjeta' },
              { value: '3', label: 'Transferencia' },
              { value: '4', label: 'Nequi' },
              { value: '5', label: 'Bancolombia' },
            ]}
          />
          <Input
            label="Referencia (opcional)"
            placeholder="Número de referencia"
            value={paymentData.referencia}
            onChange={(e) => setPaymentData({ ...paymentData, referencia: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
