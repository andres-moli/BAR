import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Circle, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { tablesService } from '@/services/tables';
import { ordersService } from '@/services/orders';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Table, TableStatus } from '@/types';
import { TABLE_STATUS_LABELS, TABLE_STATUS_COLORS } from '@/utils/constants';
import { formatCurrency, formatTimeAgo } from '@/utils/format';

export default function TablesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({ numero: 0, capacidad: 2, ubicacion: '' });

  const { data: tables, isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: tablesService.getAll,
  });

  const { data: activeOrders } = useQuery({
    queryKey: ['orders', 'active'],
    queryFn: () => ordersService.getAll({ estado: 'activa', limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: () => tablesService.create({ numero: formData.numero, number: formData.numero, capacidad: formData.capacidad, capacity: formData.capacidad, estado: 'disponible', status: 'disponible', ubicacion: formData.ubicacion, location: formData.ubicacion }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Mesa creada exitosamente');
      setShowCreateModal(false);
      resetForm();
    },
    onError: () => toast.error('Error al crear la mesa'),
  });

  const updateMutation = useMutation({
    mutationFn: () => tablesService.update(selectedTable!.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Mesa actualizada');
      setShowEditModal(false);
      setSelectedTable(null);
      resetForm();
    },
    onError: () => toast.error('Error al actualizar la mesa'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => tablesService.delete(selectedTable!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Mesa eliminada');
      setShowDeleteConfirm(false);
      setSelectedTable(null);
    },
    onError: () => toast.error('Error al eliminar la mesa'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: TableStatus }) => tablesService.updateStatus(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Estado actualizado');
    },
    onError: () => toast.error('Error al actualizar estado'),
  });

  const resetForm = () => setFormData({ numero: 0, capacidad: 2, ubicacion: '' });

  const openEdit = (table: Table) => {
    setSelectedTable(table);
    setFormData({ numero: table.numero, capacidad: table.capacidad, ubicacion: table.ubicacion });
    setShowEditModal(true);
  };

  const openDelete = (table: Table) => {
    setSelectedTable(table);
    setShowDeleteConfirm(true);
  };

  const handleTableClick = (table: Table) => {
    if (table.estado === 'disponible') {
      navigate(`/tables/${table.id}`);
    } else if (table.estado === 'ocupada') {
      const order = activeOrders?.data?.find((o) => o.mesa_id === table.id);
      if (order) {
        navigate(`/orders/${order.id}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mesas</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mesas</h1>
          {isAdmin && (
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
              Nueva Mesa
            </Button>
          )}
        </div>
        <EmptyState
          title="No hay mesas registradas"
          description="Cree su primera mesa para comenzar a gestionar el salón."
          action={isAdmin ? <Button onClick={() => setShowCreateModal(true)}>Crear Mesa</Button> : undefined}
        />
      </div>
    );
  }

  const getTableOrder = (tableId: number) => activeOrders?.data?.find((o) => o.mesa_id === tableId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mesas</h1>
          <p className="text-dark-400 text-sm mt-1">
            {tables.filter((t) => t.estado === 'disponible').length} disponibles &middot;{' '}
            {tables.filter((t) => t.estado === 'ocupada').length} ocupadas &middot;{' '}
            {tables.filter((t) => t.estado === 'reservada').length} reservadas
          </p>
        </div>
        {isAdmin && (
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            Nueva Mesa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables
          .sort((a, b) => a.numero - b.numero)
          .map((table) => {
            const order = getTableOrder(table.id);
            return (
              <Card
                key={table.id}
                hover
                onClick={() => handleTableClick(table)}
                className="relative text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 ${TABLE_STATUS_COLORS[table.estado] || 'border-dark-600 text-dark-400'}`}>
                    {table.numero}
                  </div>
                  <StatusBadge status={table.estado} label={TABLE_STATUS_LABELS[table.estado]} />
                  <div className="flex items-center gap-1 text-xs text-dark-400">
                    <Users className="w-3 h-3" />
                    {table.capacidad} pers.
                  </div>
                  {table.ubicacion && (
                    <span className="text-xs text-dark-500">{table.ubicacion}</span>
                  )}
                  {order && (
                    <div className="w-full mt-1 pt-2 border-t border-dark-700">
                      <p className="text-xs text-primary-400 font-medium">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-dark-500 mt-0.5">{formatTimeAgo(order.created_at)}</p>
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(table); }}
                      className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDelete(table); }}
                      className="p-1 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="Nueva Mesa"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending}>Crear Mesa</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Número de Mesa"
            type="number"
            value={formData.numero || ''}
            onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Capacidad"
            type="number"
            value={formData.capacidad}
            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 2 })}
          />
          <Input
            label="Ubicación"
            placeholder="Ej: Terraza, Interior, VIP"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedTable(null); resetForm(); }}
        title={`Editar Mesa #${selectedTable?.numero}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowEditModal(false); setSelectedTable(null); resetForm(); }}>Cancelar</Button>
            <Button onClick={() => updateMutation.mutate()} loading={updateMutation.isPending}>Guardar Cambios</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Número de Mesa"
            type="number"
            value={formData.numero || ''}
            onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Capacidad"
            type="number"
            value={formData.capacidad}
            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 2 })}
          />
          <Input
            label="Ubicación"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          />
          {isAdmin && (
            <Select
              label="Estado"
              value={selectedTable?.estado || 'disponible'}
              onChange={(e) => selectedTable && statusMutation.mutate({ id: selectedTable.id, estado: e.target.value as TableStatus })}
              options={[
                { value: 'disponible', label: 'Disponible' },
                { value: 'ocupada', label: 'Ocupada' },
                { value: 'reservada', label: 'Reservada' },
              ]}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setSelectedTable(null); }}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Mesa"
        message={`¿Está seguro de eliminar la mesa #${selectedTable?.numero}? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
