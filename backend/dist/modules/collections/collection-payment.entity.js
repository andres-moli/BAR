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
exports.CollectionPayment = void 0;
const typeorm_1 = require("typeorm");
const collections_entity_1 = require("./collections.entity");
const payment_methods_entity_1 = require("../payment-methods/payment-methods.entity");
let CollectionPayment = class CollectionPayment {
    id;
    amount;
    paymentMethodId;
    paymentMethod;
    reference;
    collectionAccountId;
    collectionAccount;
    createdAt;
    updatedAt;
};
exports.CollectionPayment = CollectionPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CollectionPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CollectionPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'payment_method_id' }),
    __metadata("design:type", String)
], CollectionPayment.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_methods_entity_1.PaymentMethod),
    (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    __metadata("design:type", payment_methods_entity_1.PaymentMethod)
], CollectionPayment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CollectionPayment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'collection_account_id' }),
    __metadata("design:type", String)
], CollectionPayment.prototype, "collectionAccountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => collections_entity_1.CollectionAccount, ca => ca.payments),
    (0, typeorm_1.JoinColumn)({ name: 'collection_account_id' }),
    __metadata("design:type", collections_entity_1.CollectionAccount)
], CollectionPayment.prototype, "collectionAccount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CollectionPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CollectionPayment.prototype, "updatedAt", void 0);
exports.CollectionPayment = CollectionPayment = __decorate([
    (0, typeorm_1.Entity)('collection_payments')
], CollectionPayment);
//# sourceMappingURL=collection-payment.entity.js.map