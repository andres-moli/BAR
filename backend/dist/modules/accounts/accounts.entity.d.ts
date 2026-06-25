import { PaymentMethod } from '../payment-methods/payment-methods.entity';
import { CashMovement } from '../cash-register/cash-movement.entity';
export declare enum AccountType {
    CASH = "CASH",
    BANK = "BANK",
    DIGITAL_WALLET = "DIGITAL_WALLET",
    OTHER = "OTHER"
}
export declare class Account {
    id: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    paymentMethods: PaymentMethod[];
    cashMovements: CashMovement[];
}
//# sourceMappingURL=accounts.entity.d.ts.map