import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Printer, CheckCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersService } from '@/services/orders';
import { billingService } from '@/services/billing';
import { paymentMethodsService } from '@/services/paymentMethods';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaymentPayload } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/utils/constants';
import { printOrderReceipt } from '@/utils/print';
import { handleError } from '@/utils/errorHandler';

export default function BillingDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const oid = parseInt(orderId || '0');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethodId: '',
    monto: 0,
    propina: 0,
    referencia: '',
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', oid],
    queryFn: () => ordersService.getById(oid),
    enabled: !!oid,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments', oid],
    queryFn: () => billingService.getPaymentsByOrder(oid),
    enabled: !!oid,
  });

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentMethodsService.getAll({ activo: true }),
  });

  const totalPaid = payments.reduce((s, p) => s + p.monto, 0);
  const remaining = order ? Math.max(0, order.total - totalPaid) : 0;
  const isPaid = remaining <= 0;

  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentData.paymentMethodId) {
      setPaymentData((prev) => ({ ...prev, paymentMethodId: paymentMethods[0].id.toString() }));
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (order && paymentData.monto === 0) {
      setPaymentData((prev) => ({ ...prev, monto: remaining }));
    }
  }, [order, remaining]);

  const paymentMutation = useMutation({
    mutationFn: (payload: PaymentPayload) => billingService.processPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', oid] });
      queryClient.invalidateQueries({ queryKey: ['payments', oid] });
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setShowPaymentModal(false);
      setPaymentData((prev) => ({ ...prev, monto: 0, propina: 0, referencia: '' }));
      if (remaining - paymentData.monto <= 0) {
        toast.success('Pedido pagado completamente');
        navigate('/tables');
      } else {
        toast.success('Pago procesado exitosamente');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Error al procesar el pago');
    },
  });

  const printMutation = useMutation({
    mutationFn: () => printOrderReceipt(oid),
    onSuccess: () => toast.success('Imprimiendo...'),
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: () => billingService.generateInvoice(oid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', oid] });
      toast.success('Factura generada');
    },
    onError: (err) => handleError(err, 'Error al generar factura'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (estado: string) => ordersService.updateStatus(oid, estado as import('@/types').OrderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', oid] });
      toast.success('Estado actualizado');
    },
    onError: (err) => handleError(err, 'Error al actualizar estado'),
  });

  const handleProcessPayment = () => {
    if (paymentData.monto <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    if (paymentData.monto > remaining) {
      toast.error(`El monto no puede superar el pendiente (${formatCurrency(remaining)})`);
      return;
    }
    paymentMutation.mutate({
      pedido_id: oid,
      paymentMethodId: paymentData.paymentMethodId,
      monto: paymentData.monto,
      propina: paymentData.propina,
      referencia: paymentData.referencia || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Pedido no encontrado"
        action={<Button onClick={() => navigate('/billing')} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/billing')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Facturación #{order.id}</h1>
            <p className="text-dark-400 text-sm">{order.mesa_nombre || `Mesa ${order.mesa_numero || order.mesa_id}`} &middot; {formatDateTime(order.created_at)}</p>
          </div>
          <StatusBadge status={order.estado} label={ORDER_STATUS_LABELS[order.estado]} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Productos</h3>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-dark-400 text-sm w-8 text-center font-mono">{item.cantidad}x</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.combo_nombre || item.producto_nombre || `Producto #${item.producto_id || ''}`}</p>
                      <p className="text-xs text-dark-400">{formatCurrency(item.precio_unitario)} c/u</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </Card>

          {payments.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Historial de Pagos</h3>
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-sm text-white">{formatCurrency(p.monto)}</p>
                        <p className="text-xs text-dark-400">
                          {PAYMENT_METHOD_LABELS[p.paymentMethodId as keyof typeof PAYMENT_METHOD_LABELS] || p.paymentMethodId}
                          {p.referencia ? ` · Ref: ${p.referencia}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-dark-400">{formatDateTime(p.created_at)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Resumen</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Total pedido</span>
                <span className="text-white">{formatCurrency(order.total)}</span>
              </div>
              {totalPaid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Total pagado</span>
                  <span className="text-green-400">{formatCurrency(totalPaid)}</span>
                </div>
              )}
              {remaining > 0 && (
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700">
                  <span className="text-white">Pendiente</span>
                  <span className="text-primary-400">{formatCurrency(remaining)}</span>
                </div>
              )}
              {isPaid && (
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700">
                  <span className="text-green-400">Pagado</span>
                  <span className="text-green-400">{formatCurrency(totalPaid)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
            <div className="space-y-3">
              {!isPaid && (
                <>
                  <Button className="w-full" size="lg" onClick={() => setShowPaymentModal(true)}>
                    <CheckCircle className="w-4 h-4" />
                    {totalPaid > 0 ? 'Agregar Pago' : 'Procesar Pago'}
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => updateStatusMutation.mutate('entregada')}>
                    Marcar como Entregada
                  </Button>
                </>
              )}
              {isPaid && (
                <>
                  <Button variant="secondary" className="w-full" icon={<Printer className="w-4 h-4" />} onClick={() => printMutation.mutate()}>
                    Imprimir Factura
                  </Button>
                  <Button variant="secondary" className="w-full" icon={<Printer className="w-4 h-4" />} onClick={() => generateInvoiceMutation.mutate()}>
                    Regenerar Factura
                  </Button>
                </>
              )}
            </div>
          </Card>

          {order.metodo_pago && (
            <Card>
              <h3 className="text-sm font-medium text-dark-400 mb-2">Método de Pago</h3>
              <p className="text-white font-semibold">{PAYMENT_METHOD_LABELS[order.metodo_pago as keyof typeof PAYMENT_METHOD_LABELS] || order.metodo_pago}</p>
            </Card>
          )}

          {order.cliente_nombre && (
            <Card>
              <h3 className="text-sm font-medium text-dark-400 mb-2">Cliente</h3>
              <p className="text-white font-semibold">{order.cliente_nombre}</p>
            </Card>
          )}
        </div>
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`${totalPaid > 0 ? 'Agregar Pago' : 'Procesar Pago'} - Pedido #${order.id}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
            <Button onClick={handleProcessPayment} loading={paymentMutation.isPending}>
              <CheckCircle className="w-4 h-4" />
              {totalPaid > 0 ? 'Agregar Pago' : 'Procesar Pago'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-dark-700/50 rounded-lg p-4 text-center">
            <p className="text-sm text-dark-400 mb-1">Pendiente por Pagar</p>
            <p className="text-3xl font-bold text-primary-400">{formatCurrency(remaining)}</p>
            {totalPaid > 0 && (
              <p className="text-xs text-dark-400 mt-1">Total pedido: {formatCurrency(order.total)}</p>
            )}
          </div>

          <Select
            label="Método de Pago"
            value={paymentData.paymentMethodId}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMethodId: e.target.value })}
            options={paymentMethods.length > 0
              ? paymentMethods.map(pm => ({ value: pm.id.toString(), label: pm.nombre }))
              : [
                  { value: '1', label: 'Efectivo' },
                  { value: '2', label: 'Tarjeta' },
                  { value: '3', label: 'Transferencia' },
                  { value: '4', label: 'Nequi' },
                  { value: '5', label: 'Bancolombia' },
                ]
            }
          />

          <Input
            label="Monto a pagar"
            type="number"
            value={paymentData.monto}
            onChange={(e) => setPaymentData({ ...paymentData, monto: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="Propina"
            type="number"
            value={paymentData.propina || ''}
            onChange={(e) => setPaymentData({ ...paymentData, propina: parseFloat(e.target.value) || 0 })}
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
