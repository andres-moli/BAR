export declare class Money {
    private readonly _amount;
    private readonly _currency;
    constructor(amount: number, currency?: string);
    get amount(): number;
    get currency(): string;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    greaterThan(other: Money): boolean;
    lessThan(other: Money): boolean;
    format(locale?: string): string;
    private ensureSameCurrency;
    toJSON(): {
        amount: number;
        currency: string;
    };
}
export type OrderStatusValue = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export declare class OrderStatusValueObject {
    private readonly _value;
    private static readonly VALID_STATUSES;
    private constructor();
    static from(value: string): OrderStatusValueObject;
    get value(): OrderStatusValue;
    get isOpen(): boolean;
    get isInProgress(): boolean;
    get isCompleted(): boolean;
    get isCancelled(): boolean;
    canTransitionTo(next: OrderStatusValueObject): boolean;
    equals(other: OrderStatusValueObject): boolean;
}
export type TableStatusValue = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
export declare class TableStatusValueObject {
    private readonly _value;
    private static readonly VALID_STATUSES;
    private constructor();
    static from(value: string): TableStatusValueObject;
    get value(): TableStatusValue;
    get isAvailable(): boolean;
    get isOccupied(): boolean;
    get isReserved(): boolean;
    canTransitionTo(next: TableStatusValueObject): boolean;
    equals(other: TableStatusValueObject): boolean;
}
export type UserRoleValue = 'ADMIN' | 'CASHIER' | 'WAITER';
export declare class UserRoleValueObject {
    private readonly _value;
    private static readonly VALID_ROLES;
    private constructor();
    static from(value: string): UserRoleValueObject;
    get value(): UserRoleValue;
    get isAdmin(): boolean;
    get isCashier(): boolean;
    get isWaiter(): boolean;
    can(permission: string): boolean;
    equals(other: UserRoleValueObject): boolean;
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    CASHIER = "CASHIER",
    WAITER = "WAITER"
}
export declare enum TableStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED"
}
export declare enum OrderStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum CollectionStatus {
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID"
}
export declare enum AccountType {
    CASH = "CASH",
    BANK = "BANK",
    DIGITAL_WALLET = "DIGITAL_WALLET",
    OTHER = "OTHER"
}
//# sourceMappingURL=index.d.ts.map