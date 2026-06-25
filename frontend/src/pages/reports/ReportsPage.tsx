import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Package,
  CreditCard,
  FileText,
  Users,
  Download,
  FileSpreadsheet,
  FileBarChart,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import dayjs from 'dayjs';
import { reportsService } from '@/services/reports';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateRangePicker, getDefaultDateRange } from '@/components/ui/DateRangePicker';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, exportToExcel } from '@/utils/format';
import { classNames } from '@/utils/format';
import { PAYMENT_METHOD_LABELS } from '@/utils/constants';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6'];

const tabs = [
  { id: 'ventas', label: 'Ventas', icon: BarChart3 },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'metodos', label: 'Métodos de Pago', icon: CreditCard },
  { id: 'cuentas', label: 'Cuentas por Cobrar', icon: FileText },
  { id: 'clientes', label: 'Clientes', icon: Users },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('ventas');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const reportQuery = useQuery({
    queryKey: ['reports', activeTab, dateRange],
    queryFn: () => {
      const filters = { startDate: dateRange.startDate, endDate: dateRange.endDate };
      switch (activeTab) {
        case 'ventas': return reportsService.getSalesReport(filters);
        case 'productos': return reportsService.getProductsReport(filters);
        case 'metodos': return reportsService.getPaymentMethodsReport(filters);
        case 'cuentas': return reportsService.getCollectionReport(filters);
        case 'clientes': return reportsService.getClientsReport(filters);
        default: return reportsService.getSalesReport(filters);
      }
    },
  });

  const handleExportExcel = useCallback(() => {
    if (reportQuery.data?.data) {
      exportToExcel(reportQuery.data.data as Record<string, unknown>[], `reporte-${activeTab}-${dayjs().format('YYYY-MM-DD')}`);
    }
  }, [reportQuery.data, activeTab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes</h1>
          <p className="text-dark-400 text-sm mt-1">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onStartDateChange={(d) => setDateRange((prev) => ({ ...prev, startDate: d }))}
            onEndDateChange={(d) => setDateRange((prev) => ({ ...prev, endDate: d }))}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200',
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-400">
          Período: {dayjs(dateRange.startDate).format('DD/MM/YYYY')} - {dayjs(dateRange.endDate).format('DD/MM/YYYY')}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={handleExportExcel} disabled={!reportQuery.data?.data}>
            Exportar Excel
          </Button>
          <Button variant="secondary" size="sm" icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => reportQuery.refetch()} disabled={reportQuery.isRefetching}>
            Actualizar
          </Button>
        </div>
      </div>

      {reportQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          <ChartSkeleton />
        </div>
      ) : reportQuery.isError ? (
        <EmptyState
          title="Error al cargar reporte"
          action={<Button onClick={() => reportQuery.refetch()}>Reintentar</Button>}
        />
      ) : (
        <div className="space-y-6">
          {reportQuery.data?.totales && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(reportQuery.data.totales).map(([key, value]) => (
                <Card key={key}>
                  <p className="text-sm text-dark-400 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {typeof value === 'number'
                      ? key.toLowerCase().includes('total') || key.toLowerCase().includes('venta') || key.toLowerCase().includes('monto')
                        ? formatCurrency(value)
                        : value.toLocaleString('es-CO')
                      : String(value)}
                  </p>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              {tabs.find((t) => t.id === activeTab)?.label || 'Reporte'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'metodos' ? (
                  <PieChart>
                    <Pie
                      data={(reportQuery.data?.data as { metodo?: string; total?: number; cantidad?: number }[]) || []}
                      dataKey="total"
                      nameKey="metodo"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={4}
                      label={({ metodo, total }) => `${PAYMENT_METHOD_LABELS[metodo || ''] || metodo}: ${formatCurrency(total)}`}
                    >
                      {(reportQuery.data?.data as unknown[] || []).map((_, i) => (
                        <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value: number) => [formatCurrency(value), 'Total']}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={(reportQuery.data?.data as unknown as Record<string, unknown>[]) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={Object.keys((reportQuery.data?.data as unknown as Record<string, unknown>) || {})[0] || 'nombre'} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    {Object.keys((reportQuery.data?.data as unknown as Record<string, unknown>) || {})[2] && (
                      <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {reportQuery.data?.data && (reportQuery.data.data as unknown[]).length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Datos Detallados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-dark-800/50 border-b border-dark-700">
                      {Object.keys((reportQuery.data.data as Record<string, unknown>[])[0]).map((key) => (
                        <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700/50">
                    {(reportQuery.data.data as Record<string, unknown>[]).map((row, i) => (
                      <tr key={i} className="hover:bg-dark-700/30 transition-colors">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-3 text-dark-200">
                            {typeof val === 'number'
                              ? Object.keys(row).some((k) => k.toLowerCase().includes('precio') || k.toLowerCase().includes('total') || k.toLowerCase().includes('venta') || k.toLowerCase().includes('monto'))
                                ? formatCurrency(val as number)
                                : (val as number).toLocaleString('es-CO')
                              : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {(!reportQuery.data?.data || (reportQuery.data.data as unknown[]).length === 0) && (
            <EmptyState title="Sin datos" description="No hay registros para el período seleccionado." />
          )}
        </div>
      )}
    </div>
  );
}
