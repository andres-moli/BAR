import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Eye, Printer, DollarSign, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoicesService } from '@/services/invoices';
import { clientsService } from '@/services/clients';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { CollectionAccount } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { COLLECTION_STATUS_LABELS } from '@/utils/constants';
import { handleError } from '@/utils/errorHandler';

export default function CollectionAccountsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CollectionAccount | null>(null);

  const [createData, setCreateData] = useState({
    cliente_id: 0,
    pedidos: '',
    fecha_vencimiento: '',
  });

  const [paymentData, setPaymentData] = useState({
    monto: 0,
    paymentMethodId: '1',
    referencia: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['collection-accounts', page, statusFilter, search],
    queryFn: () => invoicesService.getAll({ page, limit: 15, estado: statusFilter || undefined, search: search || undefined }),
  });

  const { data: clients } = useQuery({
    queryKey: ['clients', 'all'],
    queryFn: () => clientsService.getAll({ limit: 200 }),
    enabled: showCreateModal,
  });

  const createMutation = useMutation({
    mutationFn: () => invoicesService.create({
      cliente_id: createData.cliente_id,
      pedidos: createData.pedidos.split(',').map((p) => parseInt(p.trim())).filter((n) => !isNaN(n)),
      fecha_vencimiento: createData.fecha_vencimiento,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-accounts'] });
      toast.success('Cuenta de cobro creada');
      setShowCreateModal(false);
      setCreateData({ cliente_id: 0, pedidos: '', fecha_vencimiento: '' });
    },
    onError: (err) => handleError(err, 'Error al crear cuenta de cobro'),
  });

  const paymentMutation = useMutation({
    mutationFn: () => invoicesService.registerPayment({
      cuenta_cobro_id: selectedAccount!.id,
      monto: paymentData.monto,
      paymentMethodId: paymentData.paymentMethodId,
      referencia: paymentData.referencia || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-accounts'] });
      toast.success('Pago registrado');
      setShowPaymentModal(false);
      setSelectedAccount(null);
      setPaymentData({ monto: 0, paymentMethodId: '1', referencia: '' });
    },
    onError: (err) => handleError(err, 'Error al registrar pago'),
  });

  const columns: Column<CollectionAccount>[] = [
    { key: 'consecutivo', header: 'Consecutivo', render: (c) => <span className="font-mono text-primary-400 font-bold">{c.consecutivo}</span> },
    { key: 'cliente_nombre', header: 'Cliente', sortable: true, render: (c) => <span className="font-medium text-white">{c.cliente_nombre || `Cliente #${c.cliente_id}`}</span> },
    { key: 'total', header: 'Total', sortable: true, render: (c) => <span className="font-semibold">{formatCurrency(c.total)}</span> },
    { key: 'abonado', header: 'Abonado', render: (c) => <span className="text-green-400">{formatCurrency(c.abonado)}</span> },
    { key: 'pendiente', header: 'Pendiente', render: (c) => <span className="text-red-400 font-semibold">{formatCurrency(c.pendiente)}</span> },
    { key: 'estado', header: 'Estado', render: (c) => <StatusBadge status={c.estado} label={COLLECTION_STATUS_LABELS[c.estado]} /> },
    { key: 'fecha_vencimiento', header: 'Vencimiento', render: (c) => <span className="text-dark-400 text-xs">{formatDate(c.fecha_vencimiento)}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cuentas de Cobro</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.total || 0} cuentas registradas</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Nueva Cuenta
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'parcial', label: 'Parcial' },
            { value: 'pagada', label: 'Pagada' },
            { value: 'vencida', label: 'Vencida' },
            { value: 'anulada', label: 'Anulada' },
          ]}
          className="w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(c) => c.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por cliente o consecutivo..."
        onSearch={(q) => { setSearch(q); setPage(1); }}
        page={page}
        totalPages={data?.totalPages || 1}
        total={data?.total}
        onPageChange={setPage}
        actions={(account) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/invoices/${account.id}`)}>
              <Eye className="w-4 h-4" />
            </Button>
            {account.estado !== 'pagada' && account.estado !== 'anulada' && (
              <Button variant="ghost" size="sm" onClick={() => {
                setSelectedAccount(account);
                setPaymentData({ ...paymentData, monto: account.pendiente });
                setShowPaymentModal(true);
              }}>
                <DollarSign className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => invoicesService.print(account.id)}>
              <Printer className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreateData({ cliente_id: 0, pedidos: '', fecha_vencimiento: '' }); }}
        title="Nueva Cuenta de Cobro"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); setCreateData({ cliente_id: 0, pedidos: '', fecha_vencimiento: '' }); }}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending}>Crear Cuenta</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Cliente"
            value={createData.cliente_id}
            onChange={(e) => setCreateData({ ...createData, cliente_id: parseInt(e.target.value) || 0 })}
            placeholder="Seleccione un cliente"
            options={(clients?.data || []).map((c) => ({ value: c.id, label: `${c.nombre} (${c.documento})` }))}
          />
          <Input
            label="IDs de Pedidos (separados por coma)"
            placeholder="Ej: 1, 2, 3"
            value={createData.pedidos}
            onChange={(e) => setCreateData({ ...createData, pedidos: e.target.value })}
          />
          <Input
            label="Fecha de Vencimiento"
            type="date"
            value={createData.fecha_vencimiento}
            onChange={(e) => setCreateData({ ...createData, fecha_vencimiento: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); setSelectedAccount(null); }}
        title="Registrar Pago"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowPaymentModal(false); setSelectedAccount(null); }}>Cancelar</Button>
            <Button onClick={() => paymentMutation.mutate()} loading={paymentMutation.isPending}>
              <DollarSign className="w-4 h-4" />
              Registrar Pago
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {selectedAccount && (
            <div className="bg-dark-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-400">Total</span>
                <span className="text-white font-semibold">{formatCurrency(selectedAccount.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Abonado</span>
                <span className="text-green-400">{formatCurrency(selectedAccount.abonado)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700">
                <span className="text-dark-300">Pendiente</span>
                <span className="text-red-400">{formatCurrency(selectedAccount.pendiente)}</span>
              </div>
            </div>
          )}
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
