import { CashRegister } from './cash-register.entity';
import { Account } from '../accounts/accounts.entity';
export declare class CashMovement {
    id: string;
    cashRegisterId: string;
    cashRegister: CashRegister;
    accountId: string;
    account: Account;
    amount: number;
    type: string;
    description: string;
    reference: string;
    paymentId: string;
    createdAt: Date;
}
//# sourceMappingURL=cash-movement.entity.d.ts.map