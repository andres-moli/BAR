import { Repository } from 'typeorm';
import { CashRegister } from './cash-register.entity';
import { CashMovement } from './cash-movement.entity';
import { OpenCashRegisterDto, CashRegisterSummaryDto } from './cash-register.dto';
export declare class CashRegisterService {
    private repo;
    private movementRepo;
    constructor(repo: Repository<CashRegister>, movementRepo: Repository<CashMovement>);
    open(data: OpenCashRegisterDto, userId: string): Promise<CashRegister>;
    close(id: string, userId: string): Promise<CashRegister>;
    getCurrent(): Promise<CashRegister | null>;
    getMovements(registerId: string): Promise<CashMovement[]>;
    getSummary(registerId: string): Promise<CashRegisterSummaryDto[]>;
}
//# sourceMappingURL=cash-register.service.d.ts.map