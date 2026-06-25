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
exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const accounts_entity_1 = require("../accounts/accounts.entity");
const payments_entity_1 = require("../payments/payments.entity");
const collection_payment_entity_1 = require("../collections/collection-payment.entity");
let PaymentMethod = class PaymentMethod {
    id;
    name;
    accountId;
    account;
    isActive;
    createdAt;
    updatedAt;
    payments;
    collectionPayments;
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'account_id' }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounts_entity_1.Account, a => a.paymentMethods),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", accounts_entity_1.Account)
], PaymentMethod.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payments_entity_1.Payment, p => p.paymentMethod),
    __metadata("design:type", Array)
], PaymentMethod.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => collection_payment_entity_1.CollectionPayment, cp => cp.paymentMethod),
    __metadata("design:type", Array)
], PaymentMethod.prototype, "collectionPayments", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)('payment_methods')
], PaymentMethod);
//# sourceMappingURL=payment-methods.entity.js.map