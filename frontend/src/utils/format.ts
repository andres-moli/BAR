import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY h:mm A');
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = dayjs();
  const d = dayjs(date);
  const diffMinutes = now.diff(d, 'minute');
  if (diffMinutes < 1) return 'Ahora';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = now.diff(d, 'hour');
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = now.diff(d, 'day');
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(date);
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('es-CO').format(num);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    activa: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    en_preparacion: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    lista: 'text-green-400 bg-green-500/10 border-green-500/30',
    entregada: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    cancelada: 'text-red-400 bg-red-500/10 border-red-500/30',
    facturada: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
    disponible: 'text-green-400 bg-green-500/10 border-green-500/30',
    ocupada: 'text-red-400 bg-red-500/10 border-red-500/30',
    reservada: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    pendiente: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    parcial: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    pagada: 'text-green-400 bg-green-500/10 border-green-500/30',
    vencida: 'text-red-400 bg-red-500/10 border-red-500/30',
    anulada: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
  };
  return colors[status] || 'text-gray-400 bg-gray-500/10 border-gray-500/30';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const classNames = (...classes: (string | false | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const generatePDF = async (elementId: string, filename: string) => {
  const { default: JsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new JsPDF();
  const element = document.getElementById(elementId);
  if (!element) return;
  const rows: string[][] = [];
  const headers: string[] = [];
  const table = element.querySelector('table');
  if (table) {
    const ths = table.querySelectorAll('thead th');
    ths.forEach((th) => headers.push(th.textContent || ''));
    const trs = table.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      const row: string[] = [];
      tr.querySelectorAll('td').forEach((td) => row.push(td.textContent || ''));
      rows.push(row);
    });
  }
  autoTable(doc, { head: [headers], body: rows, theme: 'dark' as 'striped' });
  doc.save(`${filename}.pdf`);
};

export const exportToExcel = async (data: Record<string, unknown>[], filename: string) => {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
