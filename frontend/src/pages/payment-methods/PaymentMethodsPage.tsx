import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentMethodsService } from '@/services/paymentMethods';
import { accountsService } from '@/services/accounts';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PaymentMethod } from '@/types';

export default function PaymentMethodsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PaymentMethod | null>(null);
  const [deleteItem, setDeleteItem] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({ nombre: '', accountId: 0, activo: true });

  const { data, isLoading } = useQuery({
    queryKey: ['payment-methods', search],
    queryFn: () => paymentMethodsService.getAll({ search: search || undefined }),
  });

  const { data: accounts } = useQuery({
    queryKey: ['accounts', 'active'],
    queryFn: () => accountsService.getAll({ activo: true }),
  });

  const createMutation = useMutation({
    mutationFn: () => paymentMethodsService.create({
      nombre: formData.nombre,
      name: formData.nombre,
      accountId: formData.accountId,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Método de pago creado');
      closeModal();
    },
    onError: () => toast.error('Error al crear método de pago'),
  });

  const updateMutation = useMutation({
    mutationFn: () => paymentMethodsService.update(editItem!.id, {
      nombre: formData.nombre,
      name: formData.nombre,
      accountId: formData.accountId,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Método de pago actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar método de pago'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => paymentMethodsService.remove(deleteItem!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Método de pago eliminado');
      setDeleteItem(null);
    },
    onError: () => toast.error('Error al eliminar método de pago'),
  });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nombre: '', accountId: 0, activo: true });
    setShowModal(true);
  };

  const openEdit = (item: PaymentMethod) => {
    setEditItem(item);
    setFormData({
      nombre: item.nombre,
      accountId: item.accountId,
      activo: item.activo,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ nombre: '', accountId: 0, activo: true });
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!formData.accountId) {
      toast.error('Seleccione una cuenta asociada');
      return;
    }
    if (editItem) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const columns: Column<PaymentMethod>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (p) => <span className="font-medium text-white">{p.nombre}</span> },
    { key: 'cuenta', header: 'Cuenta Asociada', render: (p) => <span className="text-dark-300">{p.account?.nombre || p.account?.name || `ID: ${p.accountId}`}</span> },
    { key: 'activo', header: 'Estado', render: (p) => <StatusBadge status={p.activo ? 'disponible' : 'cancelada'} label={p.activo ? 'Activo' : 'Inactivo'} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Métodos de Pago</h1>
          <p className="text-dark-400 text-sm mt-1">{(data || []).length} métodos registrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nuevo Método
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        keyExtractor={(p) => p.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nombre..."
        onSearch={(q) => setSearch(q)}
        actions={(pm) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(pm)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteItem(pm)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editItem ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
              {editItem ? 'Guardar Cambios' : 'Crear Método'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej: Efectivo, Nequi, Tarjeta" />
          <Select
            label="Cuenta Asociada"
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target as unknown as string) || 0 })}
            placeholder="Seleccione una cuenta"
            options={(accounts || []).map((a) => ({ value: a.id, label: a.nombre }))}
          />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pmActivo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="pmActivo" className="text-sm text-dark-300">Método activo</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Método de Pago"
        message={`¿Está seguro de eliminar "${deleteItem?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
