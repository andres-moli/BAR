import React, { useState, useMemo, useEffect } from 'react';
import {
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  QrCode,
  CheckCircle,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, CurrencyInput } from '../ui/Input';
import { Badge } from '../ui/Badge';
import type { PaymentMethod as PaymentMethodType } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payments: PaymentSplit[]) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  processing?: boolean;
  paymentMethods?: PaymentMethodType[];
}

export interface PaymentSplit {
  paymentMethodId: string;
  amount: number;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const getMethodIcon = (name: string): React.ReactNode => {
  const nm = name.toLowerCase();
  if (nm.includes('efectivo')) return <Banknote size={20} />;
  if (nm.includes('tarjeta') || nm.includes('credito')) return <CreditCard size={20} />;
  if (nm.includes('nequi') || nm.includes('daviplata') || nm.includes('digital')) return <Smartphone size={20} />;
  if (nm.includes('bancolombia') || nm.includes('banco')) return <Building2 size={20} />;
  if (nm.includes('transferencia')) return <QrCode size={20} />;
  return <Wallet size={20} />;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
  subtotal,
  tax,
  discount,
  total,
  processing = false,
  paymentMethods = [],
}) => {
  const [payments, setPayments] = useState<PaymentSplit[]>([]);
  const [activeMethods, setActiveMethods] = useState<Set<string>>(new Set());

  const methodOptions: PaymentMethodOption[] = useMemo(() => {
    return paymentMethods.map((pm) => ({
      id: String(pm.id),
      name: pm.nombre,
      icon: getMethodIcon(pm.nombre),
    }));
  }, [paymentMethods]);

  useEffect(() => {
    if (isOpen) {
      setPayments([]);
      setActiveMethods(new Set());
    }
  }, [isOpen]);

  const totalPaid = useMemo(
    () => payments.reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  const remaining = useMemo(() => total - totalPaid, [total, totalPaid]);

  const isValid = useMemo(
    () => totalPaid >= total && activeMethods.size > 0,
    [totalPaid, total, activeMethods]
  );

  const toggleMethod = (methodId: string) => {
    setActiveMethods((prev) => {
      const next = new Set(prev);
      if (next.has(methodId)) {
        next.delete(methodId);
        setPayments((p) => p.filter((pm) => pm.paymentMethodId !== methodId));
        return next;
      }
      next.add(methodId);
      setPayments((p) => [...p, { paymentMethodId: methodId, amount: 0 }]);
      return next;
    });
  };

  const updateAmount = (methodId: string, amount: number) => {
    setPayments((prev) =>
      prev.map((p) => (p.paymentMethodId === methodId ? { ...p, amount } : p))
    );
  };

  const handleQuickAmount = (methodId: string, percentage: number) => {
    const amount = Math.round(total * percentage);
    const currentTotal = payments
      .filter((p) => p.paymentMethodId !== methodId)
      .reduce((s, p) => s + p.amount, 0);
    const maxAllowed = total - currentTotal;
    updateAmount(methodId, Math.min(amount, maxAllowed));
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(payments);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const isCashMethod = (methodId: string) => {
    const pm = paymentMethods.find((m) => String(m.id) === methodId);
    return pm?.nombre?.toLowerCase().includes('efectivo') ?? false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Procesar Pago"
      size="lg"
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="ghost" onClick={onClose} disabled={processing}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!isValid || processing}
            loading={processing}
            icon={<CheckCircle size={16} />}
            fullWidth
          >
            Confirmar Pago {totalPaid > 0 && `(${formatPrice(totalPaid)})`}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="glass-panel rounded-lg p-4 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Items</span>
            <span className="text-gray-300">{itemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-300">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">IVA</span>
            <span className="text-gray-300">{formatPrice(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Descuento</span>
              <span className="text-emerald-400">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
            <span className="text-white">Total</span>
            <span className="text-amber-400">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {methodOptions.map((pm) => {
            const isActive = activeMethods.has(pm.id);
            return (
              <button
                key={pm.id}
                onClick={() => toggleMethod(pm.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {pm.icon}
                {pm.name}
              </button>
            );
          })}
        </div>

        {activeMethods.size > 0 && (
          <div className="space-y-3">
            {payments.map((payment) => {
              const pm = methodOptions.find((p) => p.id === payment.paymentMethodId)!;
              const maxAllowed = total - payments
                .filter((p) => p.paymentMethodId !== payment.paymentMethodId)
                .reduce((s, p) => s + p.amount, 0);

              return (
                <div
                  key={payment.paymentMethodId}
                  className="glass-panel rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">{pm.icon}</span>
                    <span className="text-sm font-medium text-gray-200">
                      {pm.name}
                    </span>
                  </div>
                  <CurrencyInput
                    value={payment.amount}
                    onChange={(e) => updateAmount(payment.paymentMethodId, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                    placeholder="Valor a pagar..."
                  />
                  {isCashMethod(payment.paymentMethodId) && (
                    <div className="flex gap-1.5 flex-wrap">
                      {[0.5, 0.75, 1, 1.1].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleQuickAmount(payment.paymentMethodId, pct)}
                          className="px-2 py-1 text-[10px] bg-gray-700 text-gray-400 rounded hover:bg-gray-600 hover:text-white transition-colors"
                        >
                          {pct === 1
                            ? 'Exacto'
                            : `${Math.round(pct * 100)}%`}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Máximo: {formatPrice(maxAllowed)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="glass-panel rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-gray-400">Saldo pendiente</span>
          <span
            className={`text-lg font-bold ${
              remaining <= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {remaining <= 0
              ? '¡Completo!'
              : formatPrice(remaining)}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
