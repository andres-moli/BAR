import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Image, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { combosService } from '@/services/combos';
import { categoriesService } from '@/services/categories';
import { productsService } from '@/services/products';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Combo, Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { handleError } from '@/utils/errorHandler';

interface ComboProductRow {
  producto_id: string;
  cantidad: number;
}

export default function CombosPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Combo | null>(null);
  const [deleteItem, setDeleteItem] = useState<Combo | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', precio: 0, categoria_id: 0, imagen: '',
  });
  const [productRows, setProductRows] = useState<ComboProductRow[]>([]);

  const { data: combos, isLoading } = useQuery({
    queryKey: ['combos', search, categoryFilter],
    queryFn: () => combosService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const { data: products } = useQuery({
    queryKey: ['products', 'all-active'],
    queryFn: () => productsService.getAll({ limit: 200 }),
  });

  const filteredCombos = (combos || []).filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.nombre.toLowerCase().includes(q)) return false;
    }
    if (categoryFilter && c.categoria_id !== categoryFilter) return false;
    return true;
  });

  const createMutation = useMutation({
    mutationFn: () => combosService.create({
      nombre: formData.nombre,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
      imagen: formData.imagen || undefined,
      productos: productRows.map(r => ({ producto_id: r.producto_id, cantidad: r.cantidad })),
      activo: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
      toast.success('Combo creado');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al crear combo'),
  });

  const updateMutation = useMutation({
    mutationFn: () => combosService.update(editItem!.id, {
      nombre: formData.nombre,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
      imagen: formData.imagen || undefined,
      productos: productRows.map(r => ({ producto_id: r.producto_id, cantidad: r.cantidad })),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
      toast.success('Combo actualizado');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al actualizar combo'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => combosService.remove(deleteItem!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
      toast.success('Combo eliminado');
      setDeleteItem(null);
    },
    onError: (err) => handleError(err, 'Error al eliminar combo'),
  });

  const toggleMutation = useMutation({
    mutationFn: (combo: Combo) => combosService.update(combo.id, {
      activo: !combo.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
      toast.success('Estado actualizado');
    },
    onError: (err) => handleError(err, 'Error al actualizar estado'),
  });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nombre: '', precio: 0, categoria_id: 0, imagen: '' });
    setProductRows([{ producto_id: '', cantidad: 1 }]);
    setShowModal(true);
  };

  const openEdit = (item: Combo) => {
    setEditItem(item);
    setFormData({
      nombre: item.nombre,
      precio: Number(item.precio),
      categoria_id: item.categoria_id,
      imagen: item.imagen || '',
    });
    setProductRows(item.productos?.map(p => ({
      producto_id: p.producto_id,
      cantidad: p.cantidad,
    })) || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ nombre: '', precio: 0, categoria_id: 0, imagen: '' });
    setProductRows([]);
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) { toast.error('El nombre es requerido'); return; }
    if (!formData.categoria_id) { toast.error('Seleccione una categoría'); return; }
    if (isNaN(formData.precio) || formData.precio <= 0) { toast.error('El precio debe ser mayor a 0'); return; }
    if (!productRows.length || productRows.some(r => !r.producto_id || !r.cantidad)) {
      toast.error('Agregue al menos un producto con cantidad válida'); return;
    }
    if (editItem) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const addProductRow = () => {
    setProductRows([...productRows, { producto_id: '', cantidad: 1 }]);
  };

  const removeProductRow = (idx: number) => {
    setProductRows(productRows.filter((_, i) => i !== idx));
  };

  const updateProductRow = (idx: number, field: keyof ComboProductRow, value: any) => {
    const rows = [...productRows];
    (rows[idx] as any)[field] = value;
    setProductRows(rows);
  };

  const productOptions = (products?.data || []).map((p: Product) => ({
    value: p.id,
    label: `${p.nombre} - ${formatCurrency(p.precio)}`,
  }));

  const columns: Column<Combo>[] = [
    {
      key: 'imagen', header: 'Imagen',
      render: (c) => (
        <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
          {c.imagen ? <img src={c.imagen} alt={c.nombre} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-5 h-5 text-dark-400" />}
        </div>
      ),
    },
    { key: 'nombre', header: 'Nombre', sortable: true, render: (c) => <span className="font-medium text-white">{c.nombre}</span> },
    {
      key: 'categoria_id', header: 'Categoría',
      render: (c) => <span className="text-dark-300">{c.category?.nombre || 'Sin categoría'}</span>,
    },
    { key: 'precio', header: 'Precio', sortable: true, render: (c) => <span className="font-semibold">{formatCurrency(Number(c.precio))}</span> },
    {
      key: 'productos', header: 'Productos',
      render: (c) => <span className="text-dark-400">{c.productos?.length || 0} productos</span>,
    },
    {
      key: 'activo', header: 'Estado',
      render: (c) => <StatusBadge status={c.activo ? 'disponible' : 'cancelada'} label={c.activo ? 'Activo' : 'Inactivo'} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Combos</h1>
          <p className="text-dark-400 text-sm mt-1">{(combos || []).length} combos registrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nuevo Combo
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategoryFilter(undefined)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            !categoryFilter ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
          }`}
        >
          Todas
        </button>
        {(categories || []).filter((c) => c.activo).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat.id ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredCombos}
        keyExtractor={(c) => c.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nombre..."
        onSearch={(q) => { setSearch(q); setPage(1); }}
        page={page}
        totalPages={1}
        total={filteredCombos.length}
        onPageChange={setPage}
        actions={(combo) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(combo)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate(combo)}>
              {combo.activo ? 'Desactivar' : 'Activar'}
            </Button>
            <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteItem(combo)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editItem ? 'Editar Combo' : 'Nuevo Combo'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
              {editItem ? 'Guardar Cambios' : 'Crear Combo'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Combo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Combo Familiar"
            />
            <Input
              label="Precio"
              type="number"
              value={formData.precio || ''}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <Select
            label="Categoría"
            searchable
            value={formData.categoria_id}
            onChange={(e) => setFormData({ ...formData, categoria_id: Number(e.target.value) })}
            placeholder="Seleccione una categoría"
            options={(categories || []).filter((c) => c.activo).map((c) => ({ value: c.id, label: c.nombre }))}
          />
          <Input
            label="URL de Imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            icon={<Image className="w-4 h-4" />}
            value={formData.imagen}
            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          />

          <div className="border-t border-dark-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-dark-300">Productos del Combo</label>
              <Button variant="ghost" size="sm" onClick={addProductRow} icon={<Plus className="w-3.5 h-3.5" />}>
                Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {productRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Select
                    fullWidth
                    placeholder="Seleccionar producto"
                    value={row.producto_id}
                    onChange={(e) => updateProductRow(idx, 'producto_id', e.target.value)}
                    options={productOptions}
                  />
                  <div className="w-24 flex-shrink-0">
                    <Input
                      type="number"
                      value={row.cantidad || ''}
                      onChange={(e) => updateProductRow(idx, 'cantidad', parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                  <button
                    onClick={() => removeProductRow(idx)}
                    className="p-2 text-dark-400 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {productRows.length === 0 && (
                <p className="text-sm text-dark-500">No hay productos agregados</p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate()}
        title="Eliminar Combo"
        message={`¿Está seguro de eliminar "${deleteItem?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
