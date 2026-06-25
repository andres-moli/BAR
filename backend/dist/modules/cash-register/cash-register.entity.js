"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashRegister = exports.CashRegisterStatus = void 0;
const typeorm_1 = require("typeorm");
const cash_movement_entity_1 = require("./cash-movement.entity");
var CashRegisterStatus;
(function (CashRegisterStatus) {
    CashRegisterStatus["OPEN"] = "OPEN";
    CashRegisterStatus["CLOSED"] = "CLOSED";
})(CashRegisterStatus || (exports.CashRegisterStatus = CashRegisterStatus = {}));
let CashRegister = class CashRegister {
    id;
    date;
    initialAmount;
    finalAmount;
    status;
    openedBy;
    closedBy;
    openedAt;
    closedAt;
    notes;
    movements;
};
exports.CashRegister = CashRegister;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CashRegister.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CashRegister.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, name: 'initial_amount', default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "initialAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, name: 'final_amount', nullable: true }),
    __metadata("design:type", Number)
], CashRegister.prototype, "finalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CashRegisterStatus, default: CashRegisterStatus.OPEN }),
    __metadata("design:type", String)
], CashRegister.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'opened_by' }),
    __metadata("design:type", String)
], CashRegister.prototype, "openedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'closed_by', nullable: true }),
    __metadata("design:type", String)
], CashRegister.prototype, "closedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'opened_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CashRegister.prototype, "openedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'closed_at', nullable: true }),
    __metadata("design:type", Date)
], CashRegister.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CashRegister.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cash_movement_entity_1.CashMovement, cm => cm.cashRegister, { cascade: true }),
    __metadata("design:type", Array)
], CashRegister.prototype, "movements", void 0);
exports.CashRegister = CashRegister = __decorate([
    (0, typeorm_1.Entity)('cash_registers')
], CashRegister);
//# sourceMappingURL=cash-register.entity.js.map