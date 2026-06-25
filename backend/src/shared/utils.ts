import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);

export const calculateTaxes = (subtotal: number, taxRate = 0.19): number =>
  Math.round(subtotal * taxRate * 100) / 100;

export const calculateTotal = (subtotal: number, tax: number, discount = 0): number =>
  Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

export const generateConsecutive = (prefix: string, num: number): string =>
  `${prefix}-${String(num).padStart(6, '0')}`;

export const sanitizeString = (str: string): string =>
  str.trim().replace(/\s+/g, ' ');

export const formatDateTime = (date: Date): string =>
  dayjs(date).format('DD/MM/YYYY HH:mm');

export const formatDate = (date: Date): string =>
  dayjs(date).format('DD/MM/YYYY');
