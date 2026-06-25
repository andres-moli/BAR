"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConsecutive = generateConsecutive;
exports.formatCurrency = formatCurrency;
exports.calculateTaxes = calculateTaxes;
exports.sanitizeString = sanitizeString;
let consecutiveCounter = 0;
const counterResetDate = new Date().toISOString().slice(0, 10);
function generateConsecutive(prefix = 'INV') {
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
function formatCurrency(amount, locale = 'es-CO', currency = 'COP') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
function calculateTaxes(subtotal, taxRate = 0.19) {
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    return { subtotal, taxAmount, total };
}
function sanitizeString(input) {
    return input
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[<>"'&]/g, '');
}
//# sourceMappingURL=index.js.map