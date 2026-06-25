import { CashMovement } from './cash-movement.entity';
export declare enum CashRegisterStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}
export declare class CashRegister {
    id: string;
    date: Date;
    initialAmount: number;
    finalAmount: number;
    status: CashRegisterStatus;
    openedBy: string;
    closedBy: string;
    openedAt: Date;
    closedAt: Date;
    notes: string;
    movements: CashMovement[];
}
//# sourceMappingURL=cash-register.entity.d.ts.map