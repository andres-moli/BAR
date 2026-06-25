export const mapTableStatus = (s: string): string => {
  const map: Record<string, string> = { AVAILABLE: 'disponible', OCCUPIED: 'ocupada', RESERVED: 'reservada' };
  return map[s] || s;
};

export const mapOrderStatus = (s: string): string => {
  const map: Record<string, string> = {
    OPEN: 'activa',
    IN_PROGRESS: 'en_preparacion',
    COMPLETED: 'entregada',
    CANCELLED: 'cancelada',
    PAID: 'facturada',
  };
  return map[s] || s;
};

export const mapUserRole = (r: string): string => {
  const map: Record<string, string> = { ADMIN: 'admin', CASHIER: 'cajero', WAITER: 'mesero' };
  return map[r] || r.toLowerCase();
};

export const mapCollectionStatus = (s: string): string => {
  const map: Record<string, string> = {
    PENDING: 'pendiente',
    PARTIALLY_PAID: 'parcial',
    PAID: 'pagada',
    OVERDUE: 'vencida',
    CANCELLED: 'anulada',
  };
  return map[s] || s;
};
