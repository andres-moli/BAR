"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("./data-source");
const users_entity_1 = require("../modules/users/users.entity");
const accounts_entity_1 = require("../modules/accounts/accounts.entity");
const payment_methods_entity_1 = require("../modules/payment-methods/payment-methods.entity");
const categories_entity_1 = require("../modules/categories/categories.entity");
async function seed() {
    const dataSource = await data_source_1.AppDataSource.initialize();
    try {
        const userRepo = dataSource.getRepository(users_entity_1.User);
        const accountRepo = dataSource.getRepository(accounts_entity_1.Account);
        const paymentMethodRepo = dataSource.getRepository(payment_methods_entity_1.PaymentMethod);
        const categoryRepo = dataSource.getRepository(categories_entity_1.Category);
        const existingAdmin = await userRepo.findOne({ where: { email: 'admin@bar.com' } });
        if (!existingAdmin) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const password = await bcryptjs_1.default.hash('admin123', salt);
            const admin = userRepo.create({ email: 'admin@bar.com', password, name: 'Admin', role: users_entity_1.UserRole.ADMIN, isActive: true });
            await userRepo.save(admin);
            console.log('✓ Admin user created: admin@bar.com / admin123');
        }
        else {
            console.log('• Admin user already exists');
        }
        let cashAccount = await accountRepo.findOne({ where: { name: 'Caja Principal' } });
        if (!cashAccount) {
            cashAccount = accountRepo.create({ name: 'Caja Principal', type: accounts_entity_1.AccountType.CASH });
            await accountRepo.save(cashAccount);
            console.log('✓ Cash account created: Caja Principal');
        }
        else {
            console.log('• Cash account already exists');
        }
        let bankAccount = await accountRepo.findOne({ where: { name: 'Banco' } });
        if (!bankAccount) {
            bankAccount = accountRepo.create({ name: 'Banco', type: accounts_entity_1.AccountType.BANK });
            await accountRepo.save(bankAccount);
            console.log('✓ Bank account created: Banco');
        }
        else {
            console.log('• Bank account already exists');
        }
        const paymentMethods = [
            { name: 'Efectivo', accountName: 'Caja Principal' },
            { name: 'Tarjeta Débito', accountName: 'Banco' },
            { name: 'Tarjeta Crédito', accountName: 'Banco' },
            { name: 'Transferencia', accountName: 'Banco' },
        ];
        for (const pm of paymentMethods) {
            const exists = await paymentMethodRepo.findOne({ where: { name: pm.name } });
            if (!exists) {
                const account = await accountRepo.findOne({ where: { name: pm.accountName } });
                if (account) {
                    const method = paymentMethodRepo.create({ name: pm.name, accountId: account.id });
                    await paymentMethodRepo.save(method);
                    console.log(`✓ Payment method created: ${pm.name}`);
                }
            }
            else {
                console.log(`• Payment method already exists: ${pm.name}`);
            }
        }
        const categories = ['Bebidas', 'Cervezas', 'Licores', 'Comidas', 'Entradas', 'Postres'];
        for (const catName of categories) {
            const exists = await categoryRepo.findOne({ where: { name: catName } });
            if (!exists) {
                const cat = categoryRepo.create({ name: catName });
                await categoryRepo.save(cat);
                console.log(`✓ Category created: ${catName}`);
            }
            else {
                console.log(`• Category already exists: ${catName}`);
            }
        }
        console.log('\n✅ Seed completed successfully');
    }
    catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
    }
}
seed();
//# sourceMappingURL=seed.js.map