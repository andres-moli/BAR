import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { accountsService } from '@/services/accounts';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Account, AccountType } from '@/types';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_COLORS } from '@/utils/constants';

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Account | null>(null);
  const [deleteItem, setDeleteItem] = useState<Account | null>(null);
  const [formData, setFormData] = useState({ nombre: '', tipo: 'CASH' as AccountType, activo: true });

  const { data, isLoading } = useQuery({
    queryKey: ['accounts', search],
    queryFn: () => accountsService.getAll({ search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: () => accountsService.create({
      nombre: formData.nombre,
      name: formData.nombre,
      tipo: formData.tipo,
      type: formData.tipo,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Cuenta creada');
      closeModal();
    },
    onError: () => toast.error('Error al crear cuenta'),
  });

  const updateMutation = useMutation({
    mutationFn: () => accountsService.update(editItem!.id, {
      nombre: formData.nombre,
      name: formData.nombre,
      tipo: formData.tipo,
      type: formData.tipo,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Cuenta actualizada');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar cuenta'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => accountsService.remove(deleteItem!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Cuenta eliminada');
      setDeleteItem(null);
    },
    onError: () => toast.error('Error al eliminar cuenta'),
  });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nombre: '', tipo: 'CASH', activo: true });
    setShowModal(true);
  };

  const openEdit = (item: Account) => {
    setEditItem(item);
    setFormData({ nombre: item.nombre, tipo: item.tipo, activo: item.activo });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ nombre: '', tipo: 'CASH', activo: true });
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (editItem) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const columns: Column<Account>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (c) => <span className="font-medium text-white">{c.nombre}</span> },
    { key: 'tipo', header: 'Tipo', render: (c) => <span className={ACCOUNT_TYPE_COLORS[c.tipo] || 'text-dark-300'}>{ACCOUNT_TYPE_LABELS[c.tipo] || c.tipo}</span> },
    { key: 'activo', header: 'Estado', render: (c) => <StatusBadge status={c.activo ? 'disponible' : 'cancelada'} label={c.activo ? 'Activo' : 'Inactivo'} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cuentas</h1>
          <p className="text-dark-400 text-sm mt-1">{(data || []).length} cuentas registradas</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nueva Cuenta
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        keyExtractor={(c) => c.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nombre..."
        onSearch={(q) => setSearch(q)}
        actions={(account) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(account)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteItem(account)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editItem ? 'Editar Cuenta' : 'Nueva Cuenta'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
              {editItem ? 'Guardar Cambios' : 'Crear Cuenta'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Nombre de la cuenta" />
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as AccountType })}
            options={[
              { value: 'CASH', label: 'Efectivo' },
              { value: 'BANK', label: 'Banco' },
              { value: 'DIGITAL_WALLET', label: 'Billetera Digital' },
              { value: 'OTHER', label: 'Otro' },
            ]}
          />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="accActivo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="accActivo" className="text-sm text-dark-300">Cuenta activa</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Cuenta"
        message={`¿Está seguro de eliminar "${deleteItem?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
