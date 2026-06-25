import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User, UserRole } from '../modules/users/users.entity';
import { Account, AccountType } from '../modules/accounts/accounts.entity';
import { PaymentMethod } from '../modules/payment-methods/payment-methods.entity';
import { Category } from '../modules/categories/categories.entity';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  try {
    const userRepo = dataSource.getRepository(User);
    const accountRepo = dataSource.getRepository(Account);
    const paymentMethodRepo = dataSource.getRepository(PaymentMethod);
    const categoryRepo = dataSource.getRepository(Category);

    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@bar.com' } });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt);
      const admin = userRepo.create({ email: 'admin@bar.com', password, name: 'Admin', role: UserRole.ADMIN, isActive: true });
      await userRepo.save(admin);
      console.log('✓ Admin user created: admin@bar.com / admin123');
    } else {
      console.log('• Admin user already exists');
    }

    let cashAccount = await accountRepo.findOne({ where: { name: 'Caja Principal' } });
    if (!cashAccount) {
      cashAccount = accountRepo.create({ name: 'Caja Principal', type: AccountType.CASH });
      await accountRepo.save(cashAccount);
      console.log('✓ Cash account created: Caja Principal');
    } else {
      console.log('• Cash account already exists');
    }

    let bankAccount = await accountRepo.findOne({ where: { name: 'Banco' } });
    if (!bankAccount) {
      bankAccount = accountRepo.create({ name: 'Banco', type: AccountType.BANK });
      await accountRepo.save(bankAccount);
      console.log('✓ Bank account created: Banco');
    } else {
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
      } else {
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
      } else {
        console.log(`• Category already exists: ${catName}`);
      }
    }

    console.log('\n✅ Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
