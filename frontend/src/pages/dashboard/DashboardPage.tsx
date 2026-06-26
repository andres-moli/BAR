import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  DollarSign,
  ClipboardList,
  Grid3X3,
  FileText,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { reportsService } from '@/services/reports';
import { ordersService } from '@/services/orders';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatDate } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { PAYMENT_METHOD_LABELS } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'];
const CHART_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b'];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === 'admin';

  const { data: stats, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: reportsService.getDashboard,
  });

  const { data: pendingApproval = [] } = useQuery({
    queryKey: ['orders', 'pending-approval'],
    queryFn: ordersService.getPendingApproval,
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const { data: recentCompleted } = useQuery({
    queryKey: ['orders', 'recent-completed'],
    queryFn: () => ordersService.getAll({ estado: 'facturada', limit: 5, sortBy: 'updated_at', sortOrder: 'desc' }),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <ChartSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-dark-400 mb-4">Error al cargar el dashboard</p>
        <Button onClick={() => refetch()} icon={<RefreshCw className="w-4 h-4" />}>
          Reintentar
        </Button>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Ventas del Día',
      value: formatCurrency(stats.ventas_dia),
      icon: DollarSign,
      color: 'text-green-400 bg-green-500/10',
      trend: 'up',
    },
    {
      title: 'Órdenes Activas',
      value: stats.ordenes_activas.toString(),
      icon: ClipboardList,
      color: 'text-blue-400 bg-blue-500/10',
      trend: null,
    },
    {
      title: 'Mesas Ocupadas',
      value: `${stats.mesas_ocupadas} / ${stats.mesas_ocupadas + stats.mesas_disponibles}`,
      icon: Grid3X3,
      color: 'text-orange-400 bg-orange-500/10',
      trend: null,
    },
    {
      title: 'Cuentas Pendientes',
      value: stats.cuentas_pendientes.toString(),
      icon: FileText,
      color: 'text-purple-400 bg-purple-500/10',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Resumen del {formatDate(new Date().toISOString(), 'DD [de] MMMM [de] YYYY')}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            {card.trend && (
              <div className="flex items-center gap-1 mt-2">
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={`text-xs ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {card.trend === 'up' ? '+12%' : '-5%'}
                </span>
                <span className="text-xs text-dark-500">vs ayer</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Ventas por Día (Últimos 7 días)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.ventas_por_dia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="fecha" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => formatDate(v, 'DD/MM')} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value: number) => [formatCurrency(value), 'Ventas']}
                />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Productos Más Vendidos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.productos_mas_vendidos.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis type="category" dataKey="nombre" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value: number) => [value, 'Cantidad']}
                />
                <Bar dataKey="cantidad" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pago</h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.metodos_pago.map((m) => ({ ...m, name: PAYMENT_METHOD_LABELS[m.metodo] || m.metodo }))}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {stats.metodos_pago.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Ventas por Período</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ventas_por_periodo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="periodo" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {isAdmin && pendingApproval.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Modificaciones Pendientes de Aprobación</h3>
          <div className="space-y-3">
            {pendingApproval.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary-400 font-bold">#{o.id}</span>
                  <span className="text-sm text-dark-300">
                    Mesa {o.mesa_numero || o.mesa_id} &middot; {o.usuario_nombre || `Mesero #${o.usuario_id}`}
                  </span>
                  <span className="text-xs text-dark-400">{o.items?.reduce((a, b) => a + b.cantidad, 0) || 0} productos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await ordersService.updateStatus(o.id, 'entregada' as any);
                        toast.success('Pedido #' + o.id + ' marcado como entregado');
                      } catch {
                        toast.error('Error al aprobar');
                      }
                    }}
                  >
                    Aprobar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {recentCompleted && recentCompleted.data.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Últimos Pedidos Facturados</h3>
          <div className="space-y-3">
            {recentCompleted.data.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary-400 font-bold">#{o.id}</span>
                  <span className="text-sm text-dark-300">
                    Mesa {o.mesa_numero || o.mesa_id} &middot; {o.usuario_nombre || `Mesero #${o.usuario_id}`}
                  </span>
                  <span className="text-xs text-dark-400">{o.items?.reduce((a, b) => a + b.cantidad, 0) || 0} items</span>
                </div>
                <span className="text-sm font-semibold text-white">{formatCurrency(o.total)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
