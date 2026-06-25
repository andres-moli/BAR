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
exports.CollectionAccount = exports.CollectionStatus = void 0;
const typeorm_1 = require("typeorm");
const clients_entity_1 = require("../clients/clients.entity");
const collection_payment_entity_1 = require("./collection-payment.entity");
var CollectionStatus;
(function (CollectionStatus) {
    CollectionStatus["PENDING"] = "PENDING";
    CollectionStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    CollectionStatus["PAID"] = "PAID";
})(CollectionStatus || (exports.CollectionStatus = CollectionStatus = {}));
let CollectionAccount = class CollectionAccount {
    id;
    totalAmount;
    paidAmount;
    status;
    notes;
    clientId;
    client;
    payments;
    createdAt;
    updatedAt;
    dueDate;
};
exports.CollectionAccount = CollectionAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CollectionAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CollectionAccount.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CollectionAccount.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CollectionStatus, default: CollectionStatus.PENDING }),
    __metadata("design:type", String)
], CollectionAccount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CollectionAccount.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'client_id' }),
    __metadata("design:type", String)
], CollectionAccount.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Client, c => c.collectionAccounts),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", clients_entity_1.Client)
], CollectionAccount.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => collection_payment_entity_1.CollectionPayment, cp => cp.collectionAccount, { cascade: true }),
    __metadata("design:type", Array)
], CollectionAccount.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CollectionAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CollectionAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'due_date', nullable: true }),
    __metadata("design:type", Date)
], CollectionAccount.prototype, "dueDate", void 0);
exports.CollectionAccount = CollectionAccount = __decorate([
    (0, typeorm_1.Entity)('collection_accounts')
], CollectionAccount);
//# sourceMappingURL=collections.entity.js.map