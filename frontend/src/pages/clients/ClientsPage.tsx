import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, Phone, Mail, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { clientsService } from '@/services/clients';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Client } from '@/types';
import { formatCurrency } from '@/utils/format';

export default function ClientsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', documento: '', telefono: '', email: '', direccion: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientsService.getAll({ page, limit: 15, search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: () => clientsService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear cliente'),
  });

  const updateMutation = useMutation({
    mutationFn: () => clientsService.update(editingClient!.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar cliente'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => clientsService.delete(deleteClient!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente eliminado');
      setDeleteClient(null);
    },
    onError: () => toast.error('Error al eliminar cliente'),
  });

  const openCreate = () => {
    setEditingClient(null);
    setFormData({ nombre: '', documento: '', telefono: '', email: '', direccion: '' });
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre,
      documento: client.documento,
      telefono: client.telefono,
      email: client.email,
      direccion: client.direccion,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ nombre: '', documento: '', telefono: '', email: '', direccion: '' });
  };

  const columns: Column<Client>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (c) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-400" />
        </div>
        <span className="font-medium text-white">{c.nombre}</span>
      </div>
    )},
    { key: 'documento', header: 'Documento', render: (c) => <span className="text-dark-300">{c.documento}</span> },
    { key: 'telefono', header: 'Teléfono', render: (c) => (
      <span className="flex items-center gap-1 text-dark-300"><Phone className="w-3 h-3" />{c.telefono}</span>
    )},
    { key: 'email', header: 'Email', render: (c) => (
      <span className="flex items-center gap-1 text-dark-300 text-xs"><Mail className="w-3 h-3" />{c.email}</span>
    )},
    { key: 'compras', header: 'Compras', render: () => <span className="text-dark-400">-</span> },
    { key: 'deuda', header: 'Deuda', render: () => <span className="text-red-400">-</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.total || 0} clientes registrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nuevo Cliente
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(c) => c.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nombre o documento..."
        onSearch={(q) => { setSearch(q); setPage(1); }}
        page={page}
        totalPages={data?.totalPages || 1}
        total={data?.total}
        onPageChange={setPage}
        actions={(client) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(client)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteClient(client)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={() => (editingClient ? updateMutation : createMutation).mutate()}
              loading={editingClient ? updateMutation.isPending : createMutation.isPending}>
              {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" placeholder="Nombre completo" value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          <Input label="Documento" placeholder="Cédula / NIT" value={formData.documento}
            onChange={(e) => setFormData({ ...formData, documento: e.target.value })} />
          <Input label="Teléfono" placeholder="+57 300 123 4567" value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
          <Input label="Email" type="email" placeholder="cliente@email.com" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Dirección" placeholder="Dirección" value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteClient}
        onClose={() => setDeleteClient(null)}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Cliente"
        message={`¿Está seguro de eliminar a "${deleteClient?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
