import { useQuery } from '@tanstack/react-query';
import { X, Printer, DollarSign, User, Package, ShoppingCart } from 'lucide-react';
import { cashRegisterService } from '@/services/cashRegister';
import { printCashRegisterReport } from '@/utils/print';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { CASH_REGISTER_STATUS_LABELS, CASH_REGISTER_STATUS_COLORS, ACCOUNT_TYPE_LABELS } from '@/utils/constants';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import type { CashRegister, CashMovement, CashRegisterSummary } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  register: CashRegister;
  movements: CashMovement[];
  summary: CashRegisterSummary[];
}

export default function CashRegisterReportModal({ isOpen, onClose, register, movements, summary }: Props) {
  const { data: waiterData, isLoading: loadingWaiters } = useQuery({
    queryKey: ['cash-register', 'waiter-report', register.id],
    queryFn: () => cashRegisterService.getWaiterReport(register.id),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const totalEntrance = summary.reduce((a, s) => a + s.totalAmount, 0);
  const finalAmount = (register.initialAmount || 0) + totalEntrance;
  const statusLabel = CASH_REGISTER_STATUS_LABELS[register.status] || register.status;
  const statusColor = CASH_REGISTER_STATUS_COLORS[register.status] || '';

  const handlePrint = async () => {
    await printCashRegisterReport(register, movements, summary, waiterData?.waiters || []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-dark-800 rounded-xl border border-dark-700 shadow-2xl animate-scale-in flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign size={18} className="text-amber-400" />
            Reporte de Caja
          </h2>
          <div className="flex items-center gap-2">
            <Button size="sm" icon={<Printer size={14} />} onClick={handlePrint}>
              Imprimir
            </Button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div id="report-content" className="space-y-6">
            <div className="text-center pb-4 border-b border-dark-700">
              <img src="/logo-bar.png" alt="Logo" className="h-14 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">Pal Dm Boutique</h3>
              <p className="text-sm text-dark-400">Barrio p-5 Tr 15 8-44 · 3117211581</p>
              <h4 className="text-base font-semibold text-amber-400 mt-2">REPORTE DE CAJA</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-dark-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>{statusLabel}</span>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Apertura</p>
                <p className="text-sm text-white font-medium">{formatDateTime(register.openedAt)}</p>
              </div>
              {register.closedAt && (
                <div className="bg-dark-700/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Cierre</p>
                  <p className="text-sm text-white font-medium">{formatDateTime(register.closedAt)}</p>
                </div>
              )}
              <div className="bg-dark-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Monto Inicial</p>
                <p className="text-sm text-white font-bold">{formatCurrency(register.initialAmount)}</p>
              </div>
            </div>

            {register.notes && (
              <div className="bg-dark-700/30 rounded-lg px-4 py-2">
                <p className="text-xs text-dark-400">Notas</p>
                <p className="text-sm text-dark-200">{register.notes}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-400" />
                Resumen Financiero
              </h4>
              <div className="space-y-2">
                {summary.length > 0 ? summary.map((s) => (
                  <div key={s.accountId} className="flex items-center justify-between bg-dark-700/30 rounded-lg px-4 py-2.5">
                    <div>
                      <p className="text-sm text-white">{s.accountName}</p>
                      <p className="text-xs text-dark-400">{ACCOUNT_TYPE_LABELS[s.type] || s.type}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(s.totalAmount)}</p>
                  </div>
                )) : (
                  <div className="flex items-center justify-between bg-dark-700/30 rounded-lg px-4 py-2.5">
                    <p className="text-sm text-dark-400">Sin movimientos de ingreso</p>
                  </div>
                )}
                <div className="flex items-center justify-between bg-amber-500/10 rounded-lg px-4 py-3 border border-amber-500/20">
                  <p className="text-sm font-bold text-white">MONTO FINAL</p>
                  <p className="text-base font-bold text-amber-400">{formatCurrency(finalAmount)}</p>
                </div>
              </div>
            </div>

            {movements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <ShoppingCart size={16} className="text-amber-400" />
                  Movimientos ({movements.length})
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {movements.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-1.5 px-3 bg-dark-700/20 rounded-lg text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${Number(m.amount) >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <div className="min-w-0">
                          <p className="text-dark-200 truncate">{m.account?.nombre || m.account?.name || `Cuenta #${m.accountId}`}</p>
                          <p className="text-xs text-dark-500 truncate">{m.description || m.type}</p>
                        </div>
                      </div>
                      <span className={`font-semibold flex-shrink-0 ml-3 ${Number(m.amount) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Number(m.amount) >= 0 ? '+' : ''}{formatCurrency(m.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User size={16} className="text-amber-400" />
                Reporte por Mesero
              </h4>
              {loadingWaiters ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
              ) : waiterData?.waiters?.length ? (
                <div className="space-y-4">
                  {waiterData.waiters.map((waiter) => (
                    <div key={waiter.userId} className="bg-dark-700/30 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-gray-950">
                            {waiter.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{waiter.userName}</p>
                            <p className="text-xs text-dark-400">{waiter.orders.length} orden(es)</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-emerald-400">{formatCurrency(waiter.totalSales)}</p>
                      </div>

                      {waiter.products.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Package size={12} /> Productos
                          </p>
                          <div className="space-y-1">
                            {waiter.products.map((p: any) => (
                              <div key={p.productName} className="flex items-center justify-between text-sm px-2">
                                <span className="text-dark-200">{p.productName} <span className="text-dark-500">x{p.quantity}</span></span>
                                <span className="text-dark-200 font-medium">{formatCurrency(p.total)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {waiter.orders.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1.5">Órdenes</p>
                          <div className="flex flex-wrap gap-1.5">
                            {waiter.orders.map((o: any) => (
                              <span key={o.orderId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-dark-800 rounded text-xs text-dark-300">
                                #{o.orderId}{o.tableNumber ? ` · Mesa ${o.tableNumber}` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-amber-500/10 rounded-lg px-4 py-3 border border-amber-500/20">
                    <p className="text-sm font-bold text-white">Total Ventas Meseros</p>
                    <p className="text-base font-bold text-amber-400">
                      {formatCurrency(waiterData.waiters.reduce((a: number, w: any) => a + w.totalSales, 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-dark-700/20 rounded-lg">
                  <User size={32} className="mx-auto mb-2 text-dark-500" />
                  <p className="text-sm text-dark-400">No hay ventas registradas en esta caja</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dark-700 flex-shrink-0">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
          <Button icon={<Printer size={14} />} onClick={handlePrint}>Imprimir Reporte</Button>
        </div>
      </div>
    </div>
  );
}
