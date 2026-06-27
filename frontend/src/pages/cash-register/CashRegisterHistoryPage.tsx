import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { cashRegisterService } from '@/services/cashRegister';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { CASH_REGISTER_STATUS_LABELS, CASH_REGISTER_STATUS_COLORS } from '@/utils/constants';
import CashRegisterReportModal from './CashRegisterReportModal';
import type { CashRegister } from '@/types';

export default function CashRegisterHistoryPage() {
  const [page, setPage] = useState(1);
  const [reportRegister, setReportRegister] = useState<CashRegister | null>(null);
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['cash-register', 'history', page],
    queryFn: () => cashRegisterService.getHistory({ page, limit }),
  });

  const { data: movements } = useQuery({
    queryKey: ['cash-register', 'movements', reportRegister?.id],
    queryFn: () => cashRegisterService.getMovements(reportRegister!.id),
    enabled: !!reportRegister,
  });

  const { data: summary } = useQuery({
    queryKey: ['cash-register', 'summary', reportRegister?.id],
    queryFn: () => cashRegisterService.getSummary(reportRegister!.id),
    enabled: !!reportRegister,
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Historial de Caja</h1>
          <p className="text-dark-400 text-sm mt-1">
            {data?.total ? `${data.total} registros` : 'Cargando...'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <Card>
          <div className="text-center py-12">
            <Calculator size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-lg font-semibold text-white mb-2">Sin historial</h3>
            <p className="text-dark-400 text-sm">No hay cierres de caja registrados</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-dark-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800/50 border-b border-dark-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Inicial</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Entradas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Salidas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Final</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Notas</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {data.data.map((register: any) => (
                  <tr key={register.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-3 text-dark-200 whitespace-nowrap">{formatDateTime(register.date)}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{formatCurrency(register.initialAmount)}</td>
                    <td className="px-4 py-3 text-green-400 font-semibold whitespace-nowrap">{formatCurrency(register.totalEntrance || 0)}</td>
                    <td className="px-4 py-3 text-red-400 font-semibold whitespace-nowrap">{formatCurrency(register.totalExit || 0)}</td>
                    <td className="px-4 py-3 text-amber-400 font-semibold whitespace-nowrap">{formatCurrency(register.finalAmount ?? 0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CASH_REGISTER_STATUS_COLORS[register.status]}`}>
                        {CASH_REGISTER_STATUS_LABELS[register.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-dark-400 max-w-[200px] truncate">{register.notes || '-'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {register.status === 'CLOSED' && (
                        <Button
                          size="md"
                          variant="secondary"
                          onClick={() => setReportRegister(register)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Ver Reporte
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-dark-400">
                Total: {data.total} registros
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-dark-300">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {reportRegister && (
        <CashRegisterReportModal
          isOpen={true}
          onClose={() => setReportRegister(null)}
          register={reportRegister}
          movements={movements || []}
          summary={summary || []}
        />
      )}
    </div>
  );
}
