import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/index';
import { User } from '../modules/users/users.entity';
import { TableEntity } from '../modules/tables/tables.entity';
import { Category } from '../modules/categories/categories.entity';
import { Product } from '../modules/products/products.entity';
import { Order } from '../modules/orders/orders.entity';
import { OrderItem } from '../modules/orders/order-item.entity';
import { SubOrder } from '../modules/orders/sub-order.entity';
import { Payment } from '../modules/payments/payments.entity';
import { Invoice } from '../modules/payments/invoice.entity';
import { Client } from '../modules/clients/clients.entity';
import { CollectionAccount } from '../modules/collections/collections.entity';
import { CollectionPayment } from '../modules/collections/collection-payment.entity';
import { Movement } from '../modules/products/movement.entity';
import { Account } from '../modules/accounts/accounts.entity';
import { PaymentMethod } from '../modules/payment-methods/payment-methods.entity';
import { CashRegister } from '../modules/cash-register/cash-register.entity';
import { CashMovement } from '../modules/cash-register/cash-movement.entity';
import { Combo } from '../modules/combos/combo.entity';
import { ComboProduct } from '../modules/combos/combo-product.entity';

export const AppDataSource = new DataSource({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: true,
  logging: config.nodeEnv === 'development',
  entities: [
    User, TableEntity, Category, Product, Order, OrderItem, SubOrder,
    Payment, Invoice, Client, CollectionAccount, CollectionPayment,
    Movement, Account, PaymentMethod, CashRegister, CashMovement,
    Combo, ComboProduct,
  ],
  subscribers: [],
  migrations: [],
});
