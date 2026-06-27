import { useState, useEffect } from 'react';
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
  Combine,
  SplitSquareHorizontal,
  Move,
  ArrowRight,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { tablesService } from '@/services/tables';
import { productsService } from '@/services/products';
import { categoriesService } from '@/services/categories';
import { ordersService } from '@/services/orders';
import { combosService } from '@/services/combos';
import { subOrdersService } from '@/services/subOrders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { Product, OrderItem, OrderStatus, Order } from '@/types';
import Swal from 'sweetalert2';
import { printOrderReceipt } from '@/utils/print';
import { formatCurrency } from '@/utils/format';
import { TABLE_STATUS_LABELS, ORDER_STATUS_LABELS } from '@/utils/constants';
import { handleError } from '@/utils/errorHandler';

const ORDER_STATUS_ACTIONS: { value: string; label: string; color: string }[] = [
  { value: 'en_preparacion', label: 'En Preparación', color: 'bg-yellow-600 hover:bg-yellow-700' },
  { value: 'lista', label: 'Lista', color: 'bg-green-600 hover:bg-green-700' },
  { value: 'entregada', label: 'Entregada', color: 'bg-blue-600 hover:bg-blue-700' },
];

export default function TableDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tableId = parseInt(id || '0');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showChangeTableModal, setShowChangeTableModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [itemNote, setItemNote] = useState('');
  const [newTableId, setNewTableId] = useState('');
  const [splitItems, setSplitItems] = useState<Record<number, number>>({});

  const { data: table, isLoading: tableLoading } = useQuery({
    queryKey: ['table', tableId],
    queryFn: () => tablesService.getById(tableId),
    enabled: !!tableId,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 'active'],
    queryFn: () => productsService.getAll({ activo: true, limit: 200 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const { data: combos } = useQuery({
    queryKey: ['combos', 'active'],
    queryFn: () => combosService.getActive(),
  });

  const { data: allTables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesService.getAll(),
  });

  const { data: activeOrders } = useQuery({
    queryKey: ['orders', 'by-table', tableId],
    queryFn: () => ordersService.getByTable(tableId),
    enabled: !!tableId,
  });

  const activeOrder = activeOrders?.find((o) => o.estado !== 'facturada' && o.estado !== 'cancelada');

  useEffect(() => {
    if (activeOrder?.items) {
      const initial: Record<number, number> = {};
      activeOrder.items.forEach((item) => { initial[item.id] = 0; });
      setSplitItems(initial);
    }
  }, [activeOrder?.id]);

  const createOrderMutation = useMutation({
    mutationFn: () => ordersService.create({ mesa_id: tableId, items: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Pedido creado');
    },
    onError: (err) => handleError(err, 'Error al crear pedido'),
  });

  const addItemMutation = useMutation({
    mutationFn: ({ producto_id, cantidad, notas }: { producto_id: number; cantidad: number; notas?: string }) =>
      ordersService.addItem(activeOrder!.id, { producto_id, cantidad, notas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto agregado');
    },
    onError: (err) => handleError(err, 'Error al agregar producto'),
  });

  const addComboMutation = useMutation({
    mutationFn: (comboId: string) =>
      ordersService.addCombo(activeOrder!.id, { combo_id: comboId, cantidad: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      toast.success('Combo agregado');
    },
    onError: (err) => handleError(err, 'Error al agregar combo'),
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => ordersService.removeItem(activeOrder!.id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado');
    },
    onError: (err) => handleError(err, 'Error al eliminar producto'),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, cantidad }: { itemId: number; cantidad: number }) =>
      ordersService.updateItem(activeOrder!.id, itemId, { cantidad }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => handleError(err, 'Error al actualizar producto'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (estado: OrderStatus) => ordersService.updateStatus(activeOrder!.id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Estado actualizado');
    },
    onError: (err) => handleError(err, 'Error al actualizar estado'),
  });

  const changeTableMutation = useMutation({
    mutationFn: () => ordersService.changeTable(activeOrder!.id, parseInt(newTableId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Mesa cambiada');
      setShowChangeTableModal(false);
      setNewTableId('');
    },
    onError: (err) => handleError(err, 'Error al cambiar mesa'),
  });

  const splitOrderMutation = useMutation({
    mutationFn: () => {
      const items = Object.entries(splitItems)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, qty]) => ({ producto_id: parseInt(itemId), cantidad: qty }));
      return ordersService.splitOrder(activeOrder!.id, items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Pedido dividido');
      setShowSplitModal(false);
    },
    onError: (err) => handleError(err, 'Error al dividir pedido'),
  });

  const createSubOrderMutation = useMutation({
    mutationFn: () => subOrdersService.create(activeOrder!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'by-table', tableId] });
      toast.success('Sub-orden creada');
    },
    onError: (err) => handleError(err, 'Error al crear sub-orden'),
  });

  const ungroupedItems = activeOrder?.items.filter((i) => !i.sub_orden_id) || [];
  const subOrders = activeOrder?.sub_ordenes || [];

  const handleProductClick = (product: Product) => {
    if (!activeOrder) {
      createOrderMutation.mutate(undefined, {
        onSuccess: () => {
          setPendingProduct(product);
          setItemNote('');
          setShowNotesModal(true);
        },
      });
    } else {
      setPendingProduct(product);
      setItemNote('');
      setShowNotesModal(true);
    }
  };

  const confirmAddWithNote = () => {
    if (pendingProduct && activeOrder) {
      const stock = pendingProduct.stock;
      if (stock !== undefined && stock <= 0) {
        Swal.fire({ icon: 'warning', title: 'Sin stock', text: `${pendingProduct.nombre} no tiene stock disponible`, background: '#1e293b', color: '#f1f5f9' });
        setShowNotesModal(false);
        setPendingProduct(null);
        setItemNote('');
        return;
      }
      Swal.fire({
        title: 'Agregar producto',
        html: `${pendingProduct.nombre}<br><span class="text-sm text-dark-400">Stock disponible: ${stock !== undefined ? stock : 'N/A'}</span>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar',
        background: '#1e293b',
        color: '#f1f5f9',
        confirmButtonColor: '#f59e0b',
      }).then((result) => {
        if (result.isConfirmed) {
          addItemMutation.mutate({
            producto_id: pendingProduct.id,
            cantidad: 1,
            notas: itemNote || undefined,
          });
        }
      });
    }
    setShowNotesModal(false);
    setPendingProduct(null);
    setItemNote('');
  };

  const products = productsData?.data || [];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.categoria_id === selectedCategory;
    return matchesSearch && matchesCategory && p.activo && p.mostrar_en_menu !== false;
  });

  const groupedCategories = categories?.filter((c) => c.activo) || [];

  if (tableLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!table) {
    return (
      <EmptyState
        title="Mesa no encontrada"
        action={<Button onClick={() => navigate('/tables')} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 animate-fade-in">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/tables')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{table.nombre || `Mesa #${table.numero}`}</h1>
            <p className="text-sm text-dark-400">{table.ubicacion || 'Sin ubicación'} &middot; Cap. {table.capacidad}</p>
          </div>
          <StatusBadge status={table.estado} label={TABLE_STATUS_LABELS[table.estado]} size="md" />
        </div>

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

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
          {(combos || []).filter((c) => c.activo).map((combo) => (
            <Card
              key={combo.id}
              hover
              onClick={() => {
                if (!activeOrder) {
                  toast.error('No hay pedido activo');
                  return;
                }
                addComboMutation.mutate(combo.id);
              }}
              className="flex flex-col items-center text-center p-3 border-2 border-amber-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-2">
                {combo.imagen ? (
                  <img src={combo.imagen} alt={combo.nombre} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Combine className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <p className="text-sm font-medium text-white line-clamp-1">{combo.nombre}</p>
              <p className="text-sm font-bold text-amber-400 mt-1">{formatCurrency(Number(combo.precio))}</p>
              <span className="text-xs text-amber-500/70 mt-1">{combo.productos?.length || 0} productos</span>
            </Card>
          ))}
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              hover
              onClick={() => handleProductClick(product)}
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
              <span className={`text-xs mt-1 ${product.stock > 5 ? 'text-dark-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
              </span>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-dark-800/80 border border-dark-700 rounded-xl">
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-white">Pedido Actual</h2>
            {activeOrder && (
              <StatusBadge status={activeOrder.estado} label={ORDER_STATUS_LABELS[activeOrder.estado]} />
            )}
          </div>
          {!activeOrder && (
            <p className="text-sm text-dark-400">No hay pedido activo</p>
          )}
        </div>

        {activeOrder ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {ungroupedItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Sin Confirmar</p>
                  {ungroupedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{item.combo_nombre || item.producto_nombre || `Producto #${item.producto_id || ''}`}</p>
                        <p className="text-xs text-dark-400">{formatCurrency(item.precio_unitario)} c/u</p>
                        {item.notas && <p className="text-xs text-dark-500 mt-0.5">Nota: {item.notas}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: 'Reducir cantidad',
                              text: `¿Quitar 1 unidad de ${item.combo_nombre || item.producto_nombre || 'este producto'}?`,
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Sí',
                              cancelButtonText: 'Cancelar',
                              background: '#1e293b', color: '#f1f5f9', confirmButtonColor: '#f59e0b',
                            }).then((r) => {
                              if (r.isConfirmed) {
                                if (item.cantidad <= 1) {
                                  removeItemMutation.mutate(item.id);
                                } else {
                                  updateItemMutation.mutate({ itemId: item.id, cantidad: item.cantidad - 1 });
                                }
                              }
                            });
                          }}
                          className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-white w-6 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: 'Aumentar cantidad',
                              text: `¿Agregar 1 unidad más de ${item.combo_nombre || item.producto_nombre || 'este producto'}?`,
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Sí',
                              cancelButtonText: 'Cancelar',
                              background: '#1e293b', color: '#f1f5f9', confirmButtonColor: '#f59e0b',
                            }).then((r) => {
                              if (r.isConfirmed) {
                                updateItemMutation.mutate({ itemId: item.id, cantidad: item.cantidad + 1 });
                              }
                            });
                          }}
                          className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-white w-20 text-right">{formatCurrency(item.subtotal)}</p>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: 'Eliminar producto',
                            html: `¿Eliminar <strong>${item.combo_nombre || item.producto_nombre || 'este producto'}</strong> del pedido?<br><span class="text-sm text-dark-400">Se devolverá al inventario</span>`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar',
                            confirmButtonColor: '#ef4444',
                            background: '#1e293b', color: '#f1f5f9',
                          }).then((r) => {
                            if (r.isConfirmed) {
                              removeItemMutation.mutate(item.id);
                            }
                          });
                        }}
                        className="p-1 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="w-full"
                    icon={<Check className="w-4 h-4" />}
                    onClick={() => createSubOrderMutation.mutate()}
                    loading={createSubOrderMutation.isPending}
                  >
                    Confirmar Suborden
                  </Button>
                </div>
              )}

              {subOrders.map((so) => (
                <div key={so.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Suborden #{so.id.slice(-4)} · {so.creado_por}
                    <span className="ml-2 text-dark-400">
                      {so.estado === 'PENDIENTE' ? 'Pendiente' : so.estado === 'CONFIRMADO' ? 'Confirmado' : so.estado === 'ENTREGADO' ? 'Entregado' : so.estado}
                    </span>
                  </p>
                  {activeOrder.items.filter((i) => i.sub_orden_id === so.id).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-dark-800/50 rounded-lg p-2.5 border border-dark-600">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-200">{item.combo_nombre || item.producto_nombre || `Producto #${item.producto_id || ''}`}</p>
                        {item.notas && <p className="text-xs text-dark-500">Nota: {item.notas}</p>}
                      </div>
                      <span className="text-sm text-dark-300">{item.cantidad}x</span>
                      <p className="text-sm font-semibold text-dark-200 w-20 text-right">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-dark-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Subtotal</span>
                <span className="text-sm text-white">{formatCurrency(activeOrder.total)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dark-700">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-lg font-bold text-primary-400">{formatCurrency(activeOrder.total)}</span>
              </div>

              {/* Status management */}
              {activeOrder.estado !== 'cancelada' && activeOrder.estado !== 'facturada' && (
                <div className="flex flex-wrap gap-1.5">
                  {ORDER_STATUS_ACTIONS.map((action) => (
                    activeOrder.estado !== action.value && (
                      <button
                        key={action.value}
                        onClick={() => updateStatusMutation.mutate(action.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium text-white transition-colors ${action.color}`}
                      >
                        {action.label}
                      </button>
                    )
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Printer className="w-4 h-4" />}
                  onClick={() => printOrderReceipt(activeOrder)}
                >
                  Imprimir
                </Button>
                <Button
                  size="sm"
                  icon={<CreditCard className="w-4 h-4" />}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Cobrar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<SplitSquareHorizontal className="w-4 h-4" />}
                  onClick={() => setShowSplitModal(true)}
                >
                  Dividir
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Move className="w-4 h-4" />}
                  onClick={() => setShowChangeTableModal(true)}
                >
                  Cambiar Mesa
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={() => createOrderMutation.mutate()} loading={createOrderMutation.isPending} icon={<Plus className="w-4 h-4" />}>
              Crear Pedido
            </Button>
          </div>
        )}
      </div>

      {/* Notes modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => { setShowNotesModal(false); setPendingProduct(null); setItemNote(''); }}
        title={`Agregar ${pendingProduct?.nombre || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowNotesModal(false); setPendingProduct(null); }}>Cancelar</Button>
            <Button onClick={confirmAddWithNote} loading={addItemMutation.isPending}>
              Agregar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
            <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-dark-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{pendingProduct?.nombre}</p>
              <p className="text-xs text-dark-400">{pendingProduct ? formatCurrency(pendingProduct.precio) : ''}</p>
            </div>
          </div>
          <Input
            label="Nota (opcional)"
            placeholder="Ej: Sin hielo, bien asado..."
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
          />
        </div>
      </Modal>

      {/* Payment modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Cobrar - ${table.nombre || `Mesa #${table.numero}`}`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
            <Button onClick={() => navigate(`/billing/${activeOrder?.id}`)} icon={<CreditCard className="w-4 h-4" />}>
              Ir a Facturación
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-dark-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-dark-400">Productos</span>
              <span className="text-white">{activeOrder?.items.reduce((a, b) => a + b.cantidad, 0) || 0} items</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total a Cobrar</span>
              <span className="text-primary-400">{formatCurrency(activeOrder?.total || 0)}</span>
            </div>
          </div>
          <p className="text-sm text-dark-400">Será redirigido a la página de facturación para completar el pago.</p>
        </div>
      </Modal>

      {/* Split order modal */}
      <Modal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        title="Dividir Pedido"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowSplitModal(false)}>Cancelar</Button>
            <Button onClick={() => splitOrderMutation.mutate()} loading={splitOrderMutation.isPending}>
              <SplitSquareHorizontal className="w-4 h-4" />
              Dividir
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-dark-400 mb-2">Seleccione las cantidades a mover a un nuevo pedido:</p>
          {activeOrder?.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{item.combo_nombre || item.producto_nombre || `Producto #${item.producto_id || ''}`}</p>
                <p className="text-xs text-dark-400">Disponible: {item.cantidad}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSplitItems((prev) => ({
                    ...prev,
                    [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
                  }))}
                  className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-medium text-white w-8 text-center">
                  {splitItems[item.id] || 0}
                </span>
                <button
                  onClick={() => setSplitItems((prev) => ({
                    ...prev,
                    [item.id]: Math.min(item.cantidad, (prev[item.id] || 0) + 1),
                  }))}
                  className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <ArrowRight className="w-4 h-4 text-dark-500" />
            </div>
          ))}
          {(!activeOrder?.items || activeOrder.items.length === 0) && (
            <p className="text-sm text-dark-400 text-center py-4">No hay productos para dividir</p>
          )}
        </div>
      </Modal>

      {/* Change table modal */}
      <Modal
        isOpen={showChangeTableModal}
        onClose={() => { setShowChangeTableModal(false); setNewTableId(''); }}
        title="Cambiar Mesa"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowChangeTableModal(false); setNewTableId(''); }}>Cancelar</Button>
            <Button onClick={() => changeTableMutation.mutate()} loading={changeTableMutation.isPending}>
              <Move className="w-4 h-4" />
              Cambiar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-300">
            Pedido actual en {table.nombre || `Mesa #${table.numero}`}
          </p>
          <Select
            label="Nueva Mesa"
            value={newTableId}
            onChange={(e) => setNewTableId(e.target.value)}
            placeholder="Seleccione una mesa"
            options={(allTables || [])
              .filter((t) => t.estado === 'disponible' || t.id === tableId)
              .map((t) => ({ value: t.id.toString(), label: `${t.nombre || `Mesa #${t.numero}`} (${t.capacidad} pers.)` }))}
          />
        </div>
      </Modal>
    </div>
  );
}
