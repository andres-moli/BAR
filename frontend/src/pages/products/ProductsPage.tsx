import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, EyeOff, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsService } from '@/services/products';
import { categoriesService } from '@/services/categories';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/format';

export default function ProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryFilter],
    queryFn: () => productsService.getAll({ page, limit: 15, search: search || undefined, categoria_id: categoryFilter }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => productsService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Estado actualizado');
    },
    onError: () => toast.error('Error al actualizar estado'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado');
      setDeleteProduct(null);
    },
    onError: () => toast.error('Error al eliminar producto'),
  });

  const columns: Column<Product>[] = [
    {
      key: 'imagen', header: 'Imagen',
      render: (p) => (
        <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
          {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover rounded-lg" /> : <Coffee className="w-5 h-5 text-dark-400" />}
        </div>
      ),
    },
    { key: 'nombre', header: 'Nombre', sortable: true, render: (p) => <span className="font-medium text-white">{p.nombre}</span> },
    { key: 'categoria', header: 'Categoría', render: (p) => <span className="text-dark-300">{p.category?.name || p.category?.nombre || 'Sin categoría'}</span> },
    { key: 'precio', header: 'Precio', sortable: true, render: (p) => <span className="font-semibold">{formatCurrency(p.precio)}</span> },
    { key: 'stock', header: 'Inventario', sortable: true, render: (p) => <span>{p.stock}</span> },
    {
      key: 'activo', header: 'Estado',
      render: (p) => <StatusBadge status={p.activo ? 'disponible' : 'cancelada'} label={p.activo ? 'Activo' : 'Inactivo'} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.total || 0} productos registrados</p>
        </div>
        {isAdmin && (
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/products/new')}>
            Nuevo Producto
          </Button>
        )}
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
        data={data?.data || []}
        keyExtractor={(p) => p.id}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nombre..."
        onSearch={(q) => { setSearch(q); setPage(1); }}
        page={page}
        totalPages={data?.totalPages || 1}
        total={data?.total}
        onPageChange={setPage}
        actions={(product) => (
          <>
            {isAdmin && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${product.id}/edit`)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate(product.id)}>
                  {product.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" className="!text-red-400 hover:!bg-red-500/10" onClick={() => setDeleteProduct(product)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => deleteMutation.mutate(deleteProduct!.id)}
        title="Eliminar Producto"
        message={`¿Está seguro de eliminar "${deleteProduct?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
