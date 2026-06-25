import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Eye,
  Printer,
  XCircle,
  ArrowLeftRight,
  Copy,
  Search,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersService } from '@/services/orders';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, POLLING_INTERVAL, TABLE_STATUS_LABELS } from '@/utils/constants';

export default function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [showChangeTable, setShowChangeTable] = useState(false);
  const [changeTableOrder, setChangeTableOrder] = useState<Order | null>(null);
  const [newTableId, setNewTableId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, statusFilter, search, sortColumn, sortOrder],
    queryFn: () => ordersService.getAll({
      page, limit: 15, estado: statusFilter || undefined, search: search || undefined,
      sortBy: sortColumn, sortOrder,
    }),
    refetchInterval: POLLING_INTERVAL,
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => import('@/services/tables').then((m) => m.tablesService.getAll()),
    enabled: showChangeTable,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => ordersService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido cancelado');
      setCancelOrderId(null);
    },
    onError: () => toast.error('Error al cancelar pedido'),
  });

  const changeTableMutation = useMutation({
    mutationFn: () => ordersService.changeTable(changeTableOrder!.id, parseInt(newTableId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Mesa cambiada');
      setShowChangeTable(false);
      setChangeTableOrder(null);
      setNewTableId('');
    },
    onError: () => toast.error('Error al cambiar mesa'),
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const columns: Column<Order>[] = [
    { key: 'id', header: 'ID', sortable: true, render: (o) => <span className="font-mono text-primary-400">#{o.id}</span> },
    {
      key: 'mesa_numero', header: 'Mesa', sortable: true,
      render: (o) => <span className="font-medium">Mesa {o.mesa_numero || o.mesa_id}</span>,
    },
    {
      key: 'usuario_nombre', header: 'Mesero', sortable: true,
      render: (o) => <span>{o.usuario_nombre || `#${o.usuario_id}`}</span>,
    },
    {
      key: 'estado', header: 'Estado', sortable: true,
      render: (o) => <StatusBadge status={o.estado} label={ORDER_STATUS_LABELS[o.estado]} />,
    },
    {
      key: 'items', header: 'Productos',
      render: (o) => <span>{o.items?.reduce((a, b) => a + b.cantidad, 0) || 0}</span>,
    },
    {
      key: 'total', header: 'Total', sortable: true,
      render: (o) => <span className="font-semibold text-white">{formatCurrency(o.total)}</span>,
    },
    {
      key: 'created_at', header: 'Fecha', sortable: true,
      render: (o) => <span className="text-dark-400 text-xs">{formatDateTime(o.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-dark-400 text-sm mt-1">Gestión de pedidos activos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'activa', label: 'Activa' },
            { value: 'en_preparacion', label: 'En Preparación' },
            { value: 'lista', label: 'Lista' },
            { value: 'entregada', label: 'Entregada' },
            { value: 'cancelada', label: 'Cancelada' },
            { value: 'facturada', label: 'Facturada' },
          ]}
          className="w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(o) => o.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por ID o mesa..."
        onSearch={(q) => { setSearch(q); setPage(1); }}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        totalPages={data?.totalPages || 1}
        total={data?.total}
        onPageChange={setPage}
        actions={(order) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
              <Eye className="w-4 h-4" />
            </Button>
            {order.estado !== 'cancelada' && order.estado !== 'facturada' && (
              <>
                <Button variant="ghost" size="sm" onClick={() => ordersService.print(order.id)}>
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => { setChangeTableOrder(order); setShowChangeTable(true); }}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  className="!text-red-400 hover:!bg-red-500/10"
                  onClick={() => setCancelOrderId(order.id)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
          </>
        )}
      />

      <ConfirmDialog
        isOpen={!!cancelOrderId}
        onClose={() => setCancelOrderId(null)}
        onConfirm={() => cancelOrderId && cancelMutation.mutate(cancelOrderId)}
        title="Cancelar Pedido"
        message="¿Está seguro de cancelar este pedido? Esta acción no se puede deshacer."
        loading={cancelMutation.isPending}
      />

      <Modal
        isOpen={showChangeTable}
        onClose={() => { setShowChangeTable(false); setChangeTableOrder(null); setNewTableId(''); }}
        title="Cambiar Mesa"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowChangeTable(false); setChangeTableOrder(null); }}>Cancelar</Button>
            <Button onClick={() => changeTableMutation.mutate()} loading={changeTableMutation.isPending}>Cambiar Mesa</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-300">
            Pedido #{changeTableOrder?.id} - Mesa actual: {changeTableOrder?.mesa_numero || changeTableOrder?.mesa_id}
          </p>
          <Select
            label="Nueva Mesa"
            value={newTableId}
            onChange={(e) => setNewTableId(e.target.value)}
            placeholder="Seleccione una mesa"
            options={(tables || [])
              .filter((t) => t.estado === 'disponible' || t.id === changeTableOrder?.mesa_id)
              .map((t) => ({ value: t.id.toString(), label: `Mesa #${t.numero} (${t.capacidad} pers.)` }))}
          />
        </div>
      </Modal>
    </div>
  );
}
