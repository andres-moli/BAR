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
exports.CashMovement = void 0;
const typeorm_1 = require("typeorm");
const cash_register_entity_1 = require("./cash-register.entity");
const accounts_entity_1 = require("../accounts/accounts.entity");
let CashMovement = class CashMovement {
    id;
    cashRegisterId;
    cashRegister;
    accountId;
    account;
    amount;
    type;
    description;
    reference;
    paymentId;
    createdAt;
};
exports.CashMovement = CashMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CashMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'cash_register_id' }),
    __metadata("design:type", String)
], CashMovement.prototype, "cashRegisterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cash_register_entity_1.CashRegister, cr => cr.movements),
    (0, typeorm_1.JoinColumn)({ name: 'cash_register_id' }),
    __metadata("design:type", cash_register_entity_1.CashRegister)
], CashMovement.prototype, "cashRegister", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'account_id' }),
    __metadata("design:type", String)
], CashMovement.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounts_entity_1.Account, a => a.cashMovements),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", accounts_entity_1.Account)
], CashMovement.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashMovement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'INCOME' }),
    __metadata("design:type", String)
], CashMovement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'payment_id', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CashMovement.prototype, "createdAt", void 0);
exports.CashMovement = CashMovement = __decorate([
    (0, typeorm_1.Entity)('cash_movements')
], CashMovement);
//# sourceMappingURL=cash-movement.entity.js.map