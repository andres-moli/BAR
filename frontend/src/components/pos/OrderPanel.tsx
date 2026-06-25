import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  Printer,
  SplitSquareVertical,
  ArrowRight,
  Receipt,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { OrderItem, Table } from '../../types';

interface OrderPanelProps {
  items: OrderItem[];
  table?: Table | null;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateNotes: (itemId: number, notes: string) => void;
  onCheckout: () => void;
  onChangeTable: () => void;
  onPrintPreBill: () => void;
  onClearOrder: () => void;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

export const OrderPanel: React.FC<OrderPanelProps> = ({
  items,
  table,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onCheckout,
  onChangeTable,
  onPrintPreBill,
  onClearOrder,
  subtotal,
  tax,
  discount,
  total,
  itemCount,
}) => {
  const [notesOpen, setNotesOpen] = useState<Record<number, boolean>>({});

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const toggleNotes = (itemId: number) => {
    setNotesOpen((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/90 backdrop-blur-lg border-l border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-white">Orden Actual</h2>
        </div>
        <Badge variant="info" size="sm">
          {itemCount} items
        </Badge>
      </div>

      {table && (
        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Mesa <span className="text-white font-medium">#{table.numero}</span>
          </span>
          <button
            onClick={onChangeTable}
            className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1"
          >
            <ArrowRight size={12} />
            Cambiar
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
            <ShoppingCart size={40} className="mb-3 opacity-30" />
            <p className="text-sm text-center">Selecciona productos para iniciar la orden</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {item.producto_nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(item.precio_unitario)} c/u
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-gray-600 hover:text-red-400 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.max(1, item.cantidad - 1))
                      }
                      className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                      className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-amber-400">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>

                <button
                  onClick={() => toggleNotes(item.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <MessageSquare size={12} />
                  {item.notas ? item.notas : 'Agregar nota'}
                </button>

                {notesOpen[item.id] && (
                  <input
                    type="text"
                    value={item.notas || ''}
                    onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                    placeholder="Nota para el producto..."
                    className="mt-1.5 w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="px-4 py-3 border-t border-gray-800 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-300">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">IVA (19%)</span>
              <span className="text-gray-300">{formatPrice(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Descuento</span>
                <span className="text-emerald-400">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-1.5 border-t border-gray-700">
              <span className="text-white">Total</span>
              <span className="text-amber-400">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-800 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer size={14} />}
                onClick={onPrintPreBill}
                className="flex-1"
              >
                Pre-cuenta
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<SplitSquareVertical size={14} />}
                onClick={() => {}}
                className="flex-1"
              >
                Dividir
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearOrder}
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Receipt size={16} />}
                onClick={onCheckout}
                className="flex-1"
                fullWidth
              >
                Cobrar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPanel;
