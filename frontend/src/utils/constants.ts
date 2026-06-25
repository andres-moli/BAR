export const API_URL = '/api';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  activa: 'Activa',
  en_preparacion: 'En Preparación',
  lista: 'Lista',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
  facturada: 'Facturada',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  activa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  en_preparacion: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  lista: 'bg-green-500/20 text-green-400 border-green-500/30',
  entregada: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cancelada: 'bg-red-500/20 text-red-400 border-red-500/30',
  facturada: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const TABLE_STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
};

export const TABLE_STATUS_COLORS: Record<string, string> = {
  disponible: 'text-green-400 border-green-500/30 bg-green-500/10',
  ocupada: 'text-red-400 border-red-500/30 bg-red-500/10',
  reservada: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
};

export const COLLECTION_STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  pagada: 'Pagada',
  vencida: 'Vencida',
  anulada: 'Anulada',
};

export const COLLECTION_STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  parcial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pagada: 'bg-green-500/20 text-green-400 border-green-500/30',
  vencida: 'bg-red-500/20 text-red-400 border-red-500/30',
  anulada: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  mixto: 'Mixto',
  nequi: 'Nequi',
  daviplata: 'Daviplata',
  bancolombia: 'Bancolombia',
  otro: 'Otro',
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  efectivo: 'bg-green-500/20 text-green-400',
  tarjeta: 'bg-blue-500/20 text-blue-400',
  transferencia: 'bg-purple-500/20 text-purple-400',
  mixto: 'bg-orange-500/20 text-orange-400',
  nequi: 'bg-pink-500/20 text-pink-400',
  daviplata: 'bg-cyan-500/20 text-cyan-400',
  bancolombia: 'bg-red-500/20 text-red-400',
  otro: 'bg-gray-500/20 text-gray-400',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  mesero: 'Mesero',
  cajero: 'Cajero',
  cocina: 'Cocina',
};

export const USER_ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-500/20 text-purple-400',
  mesero: 'bg-blue-500/20 text-blue-400',
  cajero: 'bg-green-500/20 text-green-400',
  cocina: 'bg-orange-500/20 text-orange-400',
};

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  BANK: 'Banco',
  DIGITAL_WALLET: 'Billetera Digital',
  OTHER: 'Otro',
};

export const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  CASH: 'bg-green-500/20 text-green-400',
  BANK: 'bg-blue-500/20 text-blue-400',
  DIGITAL_WALLET: 'bg-purple-500/20 text-purple-400',
  OTHER: 'bg-gray-500/20 text-gray-400',
};

export const CASH_REGISTER_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierta',
  CLOSED: 'Cerrada',
};

export const CASH_REGISTER_STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-gray-500/20 text-gray-400',
};

export const ITEMS_PER_PAGE = 15;

export const POLLING_INTERVAL = 30000;
