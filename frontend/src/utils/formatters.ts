import type {
  OrderStatus,
  TableStatus,
  UserRole,
  CollectionStatus,
} from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatDocumentNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
}

export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  return value;
}

export const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  activa: { label: 'Activa', color: 'info' },
  en_preparacion: { label: 'En Preparación', color: 'warning' },
  lista: { label: 'Lista', color: 'success' },
  entregada: { label: 'Entregada', color: 'success' },
  cancelada: { label: 'Cancelada', color: 'danger' },
  facturada: { label: 'Facturada', color: 'neutral' },
};

export const TABLE_STATUS: Record<TableStatus, { label: string; color: string }> = {
  disponible: { label: 'Disponible', color: 'success' },
  ocupada: { label: 'Ocupada', color: 'danger' },
  reservada: { label: 'Reservada', color: 'warning' },
  inactiva: { label: 'Inactiva', color: 'neutral' },
};

export const USER_ROLES: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'danger' },
  mesero: { label: 'Mesero', color: 'success' },
  cajero: { label: 'Cajero', color: 'info' },
  cocina: { label: 'Cocina', color: 'neutral' },
};

export const COLLECTION_STATUS: Record<CollectionStatus, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: 'warning' },
  pagada: { label: 'Pagada', color: 'success' },
  parcial: { label: 'Parcial', color: 'info' },
  vencida: { label: 'Vencida', color: 'danger' },
  anulada: { label: 'Anulada', color: 'neutral' },
};

export function getStatusColor(status: string): string {
  const allStatuses = {
    ...ORDER_STATUS,
    ...TABLE_STATUS,
    ...USER_ROLES,
    ...COLLECTION_STATUS,
  } as Record<string, { label: string; color: string }>;
  return allStatuses[status]?.color || 'neutral';
}

export function getStatusText(status: string): string {
  const allStatuses = {
    ...ORDER_STATUS,
    ...TABLE_STATUS,
    ...USER_ROLES,
    ...COLLECTION_STATUS,
  } as Record<string, { label: string; color: string }>;
  return allStatuses[status]?.label || status;
}

export function calculateOrderTotals(items: Array<{ cantidad: number; precio_unitario: number; quantity?: number; unit_price?: number }>) {
  const subtotal = items.reduce((sum, item) => sum + (item.cantidad ?? item.quantity ?? 0) * (item.precio_unitario ?? item.unit_price ?? 0), 0);
  return { subtotal, tax: 0 };
}

export function calculateDiscountedTotal(
  subtotal: number,
  discount: number,
  discountType: 'percentage' | 'fixed' = 'fixed'
): { discount: number; total: number } {
  const calculatedDiscount =
    discountType === 'percentage'
      ? Math.round(subtotal * (discount / 100))
      : discount;
  const total = Math.max(0, subtotal - calculatedDiscount);
  return { discount: calculatedDiscount, total };
}

export async function generatePDF(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 80;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const doc = new jsPDF({
    orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [80, Math.max(80, imgHeight + 10)],
  });

  doc.addImage(imgData, 'PNG', 5, 5, imgWidth - 10, imgHeight);
  doc.save(`${fileName}.pdf`);
}

export async function exportToExcel(
  data: Record<string, unknown>[],
  fileName: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
