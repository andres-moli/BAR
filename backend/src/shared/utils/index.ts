let consecutiveCounter = 0;
const counterResetDate = new Date().toISOString().slice(0, 10);

export function generateConsecutive(prefix: string = 'INV'): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  if (dateStr !== counterResetDate) {
    consecutiveCounter = 0;
  }
  consecutiveCounter += 1;
  const padded = String(consecutiveCounter).padStart(5, '0');
  const shortDate = dateStr.replace(/-/g, '');
  return `${prefix}-${shortDate}-${padded}`;
}

export function formatCurrency(amount: number, locale: string = 'es-CO', currency: string = 'COP'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTaxes(subtotal: number, taxRate: number = 0.19): {
  taxAmount: number;
  total: number;
  subtotal: number;
} {
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total };
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>"'&]/g, '');
}
