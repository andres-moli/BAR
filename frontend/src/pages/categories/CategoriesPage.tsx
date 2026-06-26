import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoriesService } from '@/services/categories';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Category } from '@/types';
import { handleError } from '@/utils/errorHandler';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', icon: '', activo: true });

  const { data, isLoading } = useQuery({
    queryKey: ['categories', search],
    queryFn: () => categoriesService.getAll({ search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: () => categoriesService.create({
      nombre: formData.nombre,
      name: formData.nombre,
      descripcion: formData.descripcion || undefined,
      description: formData.descripcion || undefined,
      icon: formData.icon || undefined,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría creada');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al crear categoría'),
  });

  const updateMutation = useMutation({
    mutationFn: () => categoriesService.update(editItem!.id, {
      nombre: formData.nombre,
      name: formData.nombre,
      descripcion: formData.descripcion || undefined,
      description: formData.descripcion || undefined,
      icon: formData.icon || undefined,
      activo: formData.activo,
      is_active: formData.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría actualizada');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al actualizar categoría'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => categoriesService.remove(deleteItem!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada');
      setDeleteItem(null);
    },
    onError: (err) => handleError(err, 'Error al eliminar categoría'),
  });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nombre: '', descripcion: '', icon: '', activo: true });
    setShowModal(true);
  };

  const openEdit = (item: Category) => {
    setEditItem(item);
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      icon: item.icon || '',
      activo: item.activo,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ nombre: '', descripcion: '', icon: '', activo: true });
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

  const columns: Column<Category>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (c) => <span className="font-medium text-white">{c.nombre}</span> },
    { key: 'descripcion', header: 'Descripción', render: (c) => <span className="text-dark-300">{c.descripcion || '-'}</span> },
    { key: 'icon', header: 'Icono', render: (c) => <span className="font-mono text-dark-400 text-sm">{c.icon || '-'}</span> },
    { key: 'activo', header: 'Estado', render: (c) => <StatusBadge status={c.activo ? 'disponible' : 'cancelada'} label={c.activo ? 'Activo' : 'Inactivo'} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <p className="text-dark-400 text-sm mt-1">{(data || []).length} categorías registradas</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nueva Categoría
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
        actions={(category) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteItem(category)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editItem ? 'Editar Categoría' : 'Nueva Categoría'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
              {editItem ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Nombre de la categoría" />
          <Input label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} placeholder="Descripción opcional" />
          <Input label="Icono" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Nombre del icono (ej: coffee)" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="catActivo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="catActivo" className="text-sm text-dark-300">Categoría activa</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Categoría"
        message={`¿Está seguro de eliminar "${deleteItem?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
