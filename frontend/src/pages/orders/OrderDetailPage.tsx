import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Search,
  Coffee,
  ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersService } from '@/services/orders';
import { productsService } from '@/services/products';
import { categoriesService } from '@/services/categories';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orderId = parseInt(id || '0');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getById(orderId),
    enabled: !!orderId,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 'active'],
    queryFn: () => productsService.getAll({ activo: true, limit: 200 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const addItemMutation = useMutation({
    mutationFn: ({ producto_id, cantidad, notas }: { producto_id: number; cantidad: number; notas?: string }) =>
      ordersService.addItem(orderId, { producto_id, cantidad, notas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Producto agregado');
    },
    onError: () => toast.error('Error al agregar producto'),
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => ordersService.removeItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Producto eliminado');
    },
    onError: () => toast.error('Error al eliminar producto'),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, cantidad }: { itemId: number; cantidad: number }) =>
      ordersService.updateItem(orderId, itemId, { cantidad }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: () => toast.error('Error al actualizar producto'),
  });

  const statusMutation = useMutation({
    mutationFn: (estado: string) => ordersService.updateStatus(orderId, estado as import('@/types').OrderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Estado actualizado');
    },
    onError: () => toast.error('Error al actualizar estado'),
  });

  const products = productsData?.data || [];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.categoria_id === selectedCategory;
    return matchesSearch && matchesCategory && p.activo;
  });

  const groupedCategories = categories?.filter((c) => c.activo) || [];

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
        action={<Button onClick={() => navigate('/orders')} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>}
      />
    );
  }

  const canAddItems = !['cancelada', 'facturada'].includes(order.estado);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 animate-fade-in">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Pedido #{order.id}</h1>
            <p className="text-sm text-dark-400">
              Mesa {order.mesa_numero || order.mesa_id} &middot; {order.usuario_nombre || `Mesero #${order.usuario_id}`}
            </p>
          </div>
          <StatusBadge status={order.estado} label={ORDER_STATUS_LABELS[order.estado]} size="md" />
        </div>

        {canAddItems && (
          <>
            <div className="mb-4">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedCategory ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                Todos
              </button>
              {groupedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
          {canAddItems && filteredProducts.map((product) => (
            <Card
              key={product.id}
              hover
              onClick={() => addItemMutation.mutate({ producto_id: product.id, cantidad: 1 })}
              className="flex flex-col items-center text-center p-3"
            >
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mb-2">
                {product.imagen ? (
                  <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Coffee className="w-6 h-6 text-dark-400" />
                )}
              </div>
              <p className="text-sm font-medium text-white line-clamp-1">{product.nombre}</p>
              <p className="text-sm font-bold text-primary-400 mt-1">{formatCurrency(product.precio)}</p>
            </Card>
          ))}
          {!canAddItems && (
            <div className="col-span-full">
              <EmptyState
                title="Pedido cerrado"
                description="Este pedido ya fue facturado o cancelado."
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-dark-800/80 border border-dark-700 rounded-xl">
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Pedido
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-dark-400">
              {order.items?.reduce((a, b) => a + b.cantidad, 0) || 0} productos
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!order.items || order.items.length === 0) ? (
            <p className="text-sm text-dark-400 text-center py-8">No hay productos en este pedido</p>
          ) : (
            order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.producto_nombre || `Producto #${item.producto_id}`}</p>
                  <p className="text-xs text-dark-400">{formatCurrency(item.precio_unitario)} c/u</p>
                  {item.notas && <p className="text-xs text-dark-500 mt-0.5">Nota: {item.notas}</p>}
                </div>
                {canAddItems && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.cantidad <= 1) {
                          removeItemMutation.mutate(item.id);
                        } else {
                          updateItemMutation.mutate({ itemId: item.id, cantidad: item.cantidad - 1 });
                        }
                      }}
                      className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium text-white w-6 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateItemMutation.mutate({ itemId: item.id, cantidad: item.cantidad + 1 })}
                      className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-sm font-semibold text-white w-20 text-right">{formatCurrency(item.subtotal)}</p>
                {canAddItems && (
                  <button
                    onClick={() => removeItemMutation.mutate(item.id)}
                    className="p-1 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-dark-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Subtotal</span>
            <span className="text-sm text-white">{formatCurrency(order.total)}</span>
          </div>
          {order.propina > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Propina</span>
              <span className="text-sm text-white">{formatCurrency(order.propina)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-dark-700">
            <span className="text-base font-bold text-white">Total</span>
            <span className="text-lg font-bold text-primary-400">{formatCurrency(order.total)}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" icon={<Printer className="w-4 h-4" />}
              onClick={() => ordersService.print(order.id)}>
              Imprimir
            </Button>
            {order.estado !== 'facturada' && order.estado !== 'cancelada' && (
              <Button size="sm" className="flex-1" icon={<CreditCard className="w-4 h-4" />}
                onClick={() => navigate(`/billing/${order.id}`)}>
                Cobrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
