"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.formatDateTime = exports.sanitizeString = exports.generateConsecutive = exports.calculateTotal = exports.calculateTaxes = exports.formatCurrency = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
exports.formatCurrency = formatCurrency;
const calculateTaxes = (subtotal, taxRate = 0.19) => Math.round(subtotal * taxRate * 100) / 100;
exports.calculateTaxes = calculateTaxes;
const calculateTotal = (subtotal, tax, discount = 0) => Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);
exports.calculateTotal = calculateTotal;
const generateConsecutive = (prefix, num) => `${prefix}-${String(num).padStart(6, '0')}`;
exports.generateConsecutive = generateConsecutive;
const sanitizeString = (str) => str.trim().replace(/\s+/g, ' ');
exports.sanitizeString = sanitizeString;
const formatDateTime = (date) => (0, dayjs_1.default)(date).format('DD/MM/YYYY HH:mm');
exports.formatDateTime = formatDateTime;
const formatDate = (date) => (0, dayjs_1.default)(date).format('DD/MM/YYYY');
exports.formatDate = formatDate;
//# sourceMappingURL=utils.js.map