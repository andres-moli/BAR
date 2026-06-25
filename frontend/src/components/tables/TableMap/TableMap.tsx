import React from 'react';
import { Users, Coffee, Square } from 'lucide-react';
import type { Table, TableStatus } from '../../../types';
import { Badge } from '../../ui/Badge';

interface TableMapProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  loading?: boolean;
}

const statusConfig: Record<
  TableStatus,
  { border: string; bg: string; badge: 'success' | 'danger' | 'warning' | 'neutral'; label: string }
> = {
  disponible: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/5',
    badge: 'success',
    label: 'Disponible',
  },
  ocupada: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
    badge: 'danger',
    label: 'Ocupada',
  },
  reservada: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    badge: 'warning',
    label: 'Reservada',
  },
  inactiva: {
    border: 'border-gray-700/40',
    bg: 'bg-gray-800/30',
    badge: 'neutral',
    label: 'Inactiva',
  },
};

export const TableMap: React.FC<TableMapProps> = ({
  tables,
  onTableClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800 rounded-xl h-28"
          />
        ))}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Square size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No hay mesas registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables.map((table) => {
        const config = statusConfig[table.estado];
        return (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            disabled={table.estado === 'inactiva'}
            className={`relative glass-card rounded-xl p-4 text-center transition-all duration-200 border ${
              config.border
            } ${config.bg} ${
              table.estado === 'inactiva'
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] cursor-pointer'
            }`}
          >
            <div className="absolute top-2 right-2">
              <Badge variant={config.badge} size="sm">
                {config.label}
              </Badge>
            </div>

            <div className="flex flex-col items-center justify-center h-full pt-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-lg font-bold ${
                    table.estado === 'disponible'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : table.estado === 'ocupada'
                    ? 'bg-red-500/15 text-red-400'
                    : table.estado === 'reservada'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-gray-700/30 text-gray-500'
                }`}
              >
                {table.numero}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users size={12} />
                <span>{table.capacidad} pers.</span>
              </div>

              {table.ubicacion && (
                <p className="text-[10px] text-gray-600 mt-1">{table.ubicacion}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TableMap;
