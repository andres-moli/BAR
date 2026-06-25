"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = exports.CollectionStatus = exports.OrderStatus = exports.TableStatus = exports.UserRole = exports.UserRoleValueObject = exports.TableStatusValueObject = exports.OrderStatusValueObject = exports.Money = void 0;
class Money {
    _amount;
    _currency;
    constructor(amount, currency = 'COP') {
        if (!Number.isFinite(amount)) {
            throw new Error('Amount must be a finite number');
        }
        this._amount = Math.round(amount * 100) / 100;
        this._currency = currency;
    }
    get amount() {
        return this._amount;
    }
    get currency() {
        return this._currency;
    }
    add(other) {
        this.ensureSameCurrency(other);
        return new Money(this._amount + other._amount, this._currency);
    }
    subtract(other) {
        this.ensureSameCurrency(other);
        return new Money(this._amount - other._amount, this._currency);
    }
    multiply(factor) {
        return new Money(this._amount * factor, this._currency);
    }
    equals(other) {
        return this._amount === other._amount && this._currency === other._currency;
    }
    greaterThan(other) {
        this.ensureSameCurrency(other);
        return this._amount > other._amount;
    }
    lessThan(other) {
        this.ensureSameCurrency(other);
        return this._amount < other._amount;
    }
    format(locale = 'es-CO') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: this._currency,
            minimumFractionDigits: 0,
        }).format(this._amount);
    }
    ensureSameCurrency(other) {
        if (this._currency !== other._currency) {
            throw new Error(`Currency mismatch: ${this._currency} vs ${other._currency}`);
        }
    }
    toJSON() {
        return { amount: this._amount, currency: this._currency };
    }
}
exports.Money = Money;
class OrderStatusValueObject {
    _value;
    static VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    constructor(_value) {
        this._value = _value;
    }
    static from(value) {
        const upper = value.toUpperCase();
        if (!OrderStatusValueObject.VALID_STATUSES.includes(upper)) {
            throw new Error(`Invalid order status: ${value}. Valid values: ${OrderStatusValueObject.VALID_STATUSES.join(', ')}`);
        }
        return new OrderStatusValueObject(upper);
    }
    get value() {
        return this._value;
    }
    get isOpen() {
        return this._value === 'OPEN';
    }
    get isInProgress() {
        return this._value === 'IN_PROGRESS';
    }
    get isCompleted() {
        return this._value === 'COMPLETED';
    }
    get isCancelled() {
        return this._value === 'CANCELLED';
    }
    canTransitionTo(next) {
        const transitions = {
            OPEN: ['IN_PROGRESS', 'CANCELLED'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
            COMPLETED: [],
            CANCELLED: [],
        };
        return transitions[this._value].includes(next._value);
    }
    equals(other) {
        return this._value === other._value;
    }
}
exports.OrderStatusValueObject = OrderStatusValueObject;
class TableStatusValueObject {
    _value;
    static VALID_STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];
    constructor(_value) {
        this._value = _value;
    }
    static from(value) {
        const upper = value.toUpperCase();
        if (!TableStatusValueObject.VALID_STATUSES.includes(upper)) {
            throw new Error(`Invalid table status: ${value}`);
        }
        return new TableStatusValueObject(upper);
    }
    get value() {
        return this._value;
    }
    get isAvailable() {
        return this._value === 'AVAILABLE';
    }
    get isOccupied() {
        return this._value === 'OCCUPIED';
    }
    get isReserved() {
        return this._value === 'RESERVED';
    }
    canTransitionTo(next) {
        const transitions = {
            AVAILABLE: ['OCCUPIED', 'RESERVED'],
            OCCUPIED: ['AVAILABLE'],
            RESERVED: ['AVAILABLE', 'OCCUPIED'],
        };
        return transitions[this._value].includes(next._value);
    }
    equals(other) {
        return this._value === other._value;
    }
}
exports.TableStatusValueObject = TableStatusValueObject;
class UserRoleValueObject {
    _value;
    static VALID_ROLES = ['ADMIN', 'CASHIER', 'WAITER'];
    constructor(_value) {
        this._value = _value;
    }
    static from(value) {
        const upper = value.toUpperCase();
        if (!UserRoleValueObject.VALID_ROLES.includes(upper)) {
            throw new Error(`Invalid user role: ${value}`);
        }
        return new UserRoleValueObject(upper);
    }
    get value() {
        return this._value;
    }
    get isAdmin() {
        return this._value === 'ADMIN';
    }
    get isCashier() {
        return this._value === 'CASHIER';
    }
    get isWaiter() {
        return this._value === 'WAITER';
    }
    can(permission) {
        const permissions = {
            ADMIN: ['*'],
            CASHIER: ['create_order', 'process_payment', 'view_reports', 'manage_clients'],
            WAITER: ['create_order', 'view_orders'],
        };
        return permissions[this._value].includes('*') || permissions[this._value].includes(permission);
    }
    equals(other) {
        return this._value === other._value;
    }
}
exports.UserRoleValueObject = UserRoleValueObject;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CASHIER"] = "CASHIER";
    UserRole["WAITER"] = "WAITER";
})(UserRole || (exports.UserRole = UserRole = {}));
var TableStatus;
(function (TableStatus) {
    TableStatus["AVAILABLE"] = "AVAILABLE";
    TableStatus["OCCUPIED"] = "OCCUPIED";
    TableStatus["RESERVED"] = "RESERVED";
})(TableStatus || (exports.TableStatus = TableStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var CollectionStatus;
(function (CollectionStatus) {
    CollectionStatus["PENDING"] = "PENDING";
    CollectionStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    CollectionStatus["PAID"] = "PAID";
})(CollectionStatus || (exports.CollectionStatus = CollectionStatus = {}));
var AccountType;
(function (AccountType) {
    AccountType["CASH"] = "CASH";
    AccountType["BANK"] = "BANK";
    AccountType["DIGITAL_WALLET"] = "DIGITAL_WALLET";
    AccountType["OTHER"] = "OTHER";
})(AccountType || (exports.AccountType = AccountType = {}));
//# sourceMappingURL=index.js.map