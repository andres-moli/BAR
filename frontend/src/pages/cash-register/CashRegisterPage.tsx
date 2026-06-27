import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, ArrowUpRight, ArrowDownRight, History, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { cashRegisterService } from '@/services/cashRegister';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { CashRegister, CashMovement, CashRegisterSummary } from '@/types';
import { formatCurrency, formatTimeAgo as formatTime } from '@/utils/format';
import { CASH_REGISTER_STATUS_LABELS, CASH_REGISTER_STATUS_COLORS, ACCOUNT_TYPE_LABELS } from '@/utils/constants';
import { handleError } from '@/utils/errorHandler';
import CashRegisterReportModal from './CashRegisterReportModal';

export default function CashRegisterPage() {
  const queryClient = useQueryClient();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [initialAmount, setInitialAmount] = useState(0);
  const [openNotes, setOpenNotes] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const { data: currentRegister, isLoading } = useQuery({
    queryKey: ['cash-register', 'current'],
    queryFn: cashRegisterService.getCurrent,
    refetchInterval: 10000,
  });

  const { data: movements } = useQuery({
    queryKey: ['cash-register', 'movements', currentRegister?.id],
    queryFn: () => cashRegisterService.getMovements(currentRegister!.id),
    enabled: !!currentRegister,
  });

  const { data: summary } = useQuery({
    queryKey: ['cash-register', 'summary', currentRegister?.id],
    queryFn: () => cashRegisterService.getSummary(currentRegister!.id),
    enabled: !!currentRegister,
  });

  const openMutation = useMutation({
    mutationFn: () => cashRegisterService.open({ initialAmount, notes: openNotes || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register'] });
      toast.success('Caja abierta exitosamente');
      setShowOpenModal(false);
      setInitialAmount(0);
      setOpenNotes('');
    },
    onError: (err) => handleError(err, 'Error al abrir caja'),
  });

  const closeMutation = useMutation({
    mutationFn: () => cashRegisterService.close({ notes: closeNotes || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register'] });
      toast.success('Caja cerrada exitosamente');
      setShowCloseModal(false);
      setCloseNotes('');
    },
    onError: (err) => handleError(err, 'Error al cerrar caja'),
  });

  const handleOpenReport = () => {
    if (!currentRegister) return;
    setShowReportModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const isOpen = currentRegister?.status === 'OPEN';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Caja Registradora</h1>
          <p className="text-dark-400 text-sm mt-1">
            {currentRegister
              ? `Estado: ${CASH_REGISTER_STATUS_LABELS[currentRegister.status]}`
              : 'No hay registro de caja abierto'}
          </p>
        </div>
        {currentRegister && (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${CASH_REGISTER_STATUS_COLORS[currentRegister.status]}`}>
              {CASH_REGISTER_STATUS_LABELS[currentRegister.status]}
            </span>
          </div>
        )}
      </div>

      {!currentRegister ? (
        <Card>
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-lg font-semibold text-white mb-2">No hay caja abierta</h3>
            <p className="text-dark-400 text-sm mb-6">Abra la caja para comenzar a registrar movimientos</p>
            <Button size="lg" onClick={() => setShowOpenModal(true)}>
              Abrir Caja
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-dark-400 mb-1">Monto Inicial</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(currentRegister.initialAmount)}</p>
              </div>
            </Card>
            {isOpen && summary && (
              <>
                {summary.map((s) => (
                  <Card key={s.accountId}>
                    <div className="text-center">
                      <p className="text-sm text-dark-400 mb-1">{s.accountName}</p>
                      <p className="text-2xl font-bold text-amber-400">{formatCurrency(s.totalAmount)}</p>
                      <p className="text-xs text-dark-500">{ACCOUNT_TYPE_LABELS[s.type] || s.type}</p>
                    </div>
                  </Card>
                ))}
              </>
            )}
            {!isOpen && currentRegister.finalAmount != null && (
              <Card>
                <div className="text-center">
                  <p className="text-sm text-dark-400 mb-1">Monto Final</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(currentRegister.finalAmount)}</p>
                </div>
              </Card>
            )}
          </div>

          <div className="flex gap-3">
            {isOpen && (
              <Button variant="danger" size="lg" onClick={() => {
                setShowCloseModal(true);
              }}>
                Cerrar Caja
              </Button>
            )}
            {currentRegister.status === 'CLOSED' && (
              <Button size="lg" onClick={() => setShowOpenModal(true)}>
                Abrir Nueva Caja
              </Button>
            )}
            <Button variant="secondary" size="lg" icon={<Printer size={16} />} onClick={handleOpenReport}>
              Ver Reporte
            </Button>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <History size={18} />
                Movimientos
              </h3>
            </div>
            {movements && movements.length > 0 ? (
              <div className="space-y-2">
                {movements.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        m.amount >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {m.amount >= 0 ? <ArrowUpRight size={14} className="text-green-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{m.account?.nombre || m.account?.name || `Cuenta #${m.accountId}`}</p>
                        <p className="text-xs text-dark-400">{m.description || m.type} &middot; {formatTime(m.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${m.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {m.amount >= 0 ? '+' : ''}{formatCurrency(m.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400 text-center py-8">No hay movimientos registrados</p>
            )}
          </Card>
        </>
      )}

      <Modal
        isOpen={showOpenModal}
        onClose={() => { setShowOpenModal(false); setInitialAmount(0); setOpenNotes(''); }}
        title="Abrir Caja"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowOpenModal(false); setInitialAmount(0); setOpenNotes(''); }}>Cancelar</Button>
            <Button onClick={() => openMutation.mutate()} loading={openMutation.isPending}>
              Abrir Caja
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Monto Inicial"
            type="number"
            value={initialAmount || ''}
            onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <Input
            label="Notas (opcional)"
            value={openNotes}
            onChange={(e) => setOpenNotes(e.target.value)}
            placeholder="Notas para la apertura"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showCloseModal}
        onClose={() => { setShowCloseModal(false); setCloseNotes(''); }}
        title="Cerrar Caja"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowCloseModal(false); setCloseNotes(''); }}>Cancelar</Button>
            <Button variant="danger" onClick={() => closeMutation.mutate()} loading={closeMutation.isPending}>
              Cerrar Caja
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-dark-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Monto Inicial</span>
              <span className="text-white font-semibold">{formatCurrency(currentRegister?.initialAmount || 0)}</span>
            </div>
            {summary && summary.length > 0 && (
              <div className="border-t border-dark-600 pt-2 mt-2 space-y-1">
                {summary.map((s) => (
                  <div key={s.accountId} className="flex justify-between text-sm">
                    <span className="text-dark-400">{s.accountName}</span>
                    <span className="text-amber-400">{formatCurrency(s.totalAmount)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-dark-600 pt-2 mt-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Total Final</span>
                <span className="text-green-400">{formatCurrency((currentRegister?.initialAmount || 0) + (summary || []).reduce((a, s) => a + s.totalAmount, 0))}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-dark-400">El monto final se calculará automáticamente al cerrar la caja.</p>
          <Input
            label="Notas (opcional)"
            value={closeNotes}
            onChange={(e) => setCloseNotes(e.target.value)}
            placeholder="Notas para el cierre"
          />
        </div>
      </Modal>

      {currentRegister && (
        <CashRegisterReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          register={currentRegister}
          movements={movements || []}
          summary={summary || []}
        />
      )}
    </div>
  );
}
