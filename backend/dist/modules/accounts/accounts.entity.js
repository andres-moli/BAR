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
exports.Account = exports.AccountType = void 0;
const typeorm_1 = require("typeorm");
const payment_methods_entity_1 = require("../payment-methods/payment-methods.entity");
const cash_movement_entity_1 = require("../cash-register/cash-movement.entity");
var AccountType;
(function (AccountType) {
    AccountType["CASH"] = "CASH";
    AccountType["BANK"] = "BANK";
    AccountType["DIGITAL_WALLET"] = "DIGITAL_WALLET";
    AccountType["OTHER"] = "OTHER";
})(AccountType || (exports.AccountType = AccountType = {}));
let Account = class Account {
    id;
    name;
    type;
    isActive;
    createdAt;
    updatedAt;
    paymentMethods;
    cashMovements;
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AccountType, default: AccountType.CASH }),
    __metadata("design:type", String)
], Account.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Account.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Account.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Account.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_methods_entity_1.PaymentMethod, pm => pm.account),
    __metadata("design:type", Array)
], Account.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cash_movement_entity_1.CashMovement, cm => cm.account),
    __metadata("design:type", Array)
], Account.prototype, "cashMovements", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)('accounts')
], Account);
//# sourceMappingURL=accounts.entity.js.map