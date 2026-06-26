export type UserRole = 'admin' | 'mesero' | 'cajero' | 'cocina';

export type AccountType = 'CASH' | 'BANK' | 'DIGITAL_WALLET' | 'OTHER';

export type CashRegisterStatus = 'OPEN' | 'CLOSED';

export interface User {
  id: number;
  nombre: string;
  full_name: string;
  email: string;
  password?: string;
  rol: UserRole;
  role: UserRole;
  activo: boolean;
  ultimo_acceso: string | null;
  created_at: string;
  updated_at: string;
}

export type TableStatus = 'disponible' | 'ocupada' | 'reservada' | 'inactiva';

export interface Table {
  id: number;
  numero: number;
  number: number;
  capacidad: number;
  capacity: number;
  estado: TableStatus;
  status: TableStatus;
  ubicacion: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  nombre: string;
  name: string;
  descripcion?: string;
  description?: string;
  icon?: string;
  activo: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  nombre: string;
  name: string;
  categoria_id: number;
  categoryId: string;
  category?: Category;
  precio: number;
  price: number;
  costo: number;
  stock: number;
  descripcion: string;
  description: string;
  imagen: string | null;
  image: string | null;
  activo: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'activa' | 'en_preparacion' | 'lista' | 'entregada' | 'cancelada' | 'facturada';

export interface OrderItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  producto_nombre?: string;
  product_name?: string;
  cantidad: number;
  quantity: number;
  precio_unitario: number;
  unit_price: number;
  subtotal: number;
  notas: string;
  notes: string;
  sub_orden_id?: string | null;
  created_at: string;
}

export type SubOrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';

export interface SubOrder {
  id: string;
  pedido_id: string;
  mesa_numero?: number | null;
  estado: SubOrderStatus;
  creado_por: string;
  creado_por_id: string;
  entregado_por: string | null;
  created_at: string;
  delivered_at: string | null;
  items?: OrderItem[];
}

export interface PaymentSummary {
  id: string;
  monto: number;
  paymentMethodId: string;
  paymentMethod?: PaymentMethod;
  referencia: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  mesa_id: number;
  mesa_numero?: number;
  usuario_id: number;
  usuario_nombre?: string;
  cliente_id: number | null;
  cliente_nombre?: string;
  estado: OrderStatus;
  items: OrderItem[];
  sub_ordenes?: SubOrder[];
  total: number;
  metodo_pago: string | null;
  paymentMethodId?: string;
  paymentMethod?: PaymentMethod;
  propina: number;
  pagos?: PaymentSummary[];
  totalPagado?: number;
  pendiente?: number;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  nombre: string;
  name: string;
  tipo: AccountType;
  type: AccountType;
  activo: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  nombre: string;
  name: string;
  accountId: number;
  account?: Account;
  activo: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  pedido_id: number;
  paymentMethodId: string;
  paymentMethod?: PaymentMethod;
  monto: number;
  referencia: string | null;
  created_at: string;
}

export type CollectionStatus = 'pendiente' | 'parcial' | 'pagada' | 'vencida' | 'anulada';

export interface CollectionAccount {
  id: number;
  consecutivo: string;
  cliente_id: number;
  cliente_nombre?: string;
  total: number;
  abonado: number;
  pendiente: number;
  estado: CollectionStatus;
  fecha_emision: string;
  fecha_vencimiento: string;
  pedidos: number[];
  payments?: CollectionPayment[];
  created_at: string;
  updated_at: string;
}

export interface CollectionPayment {
  id: number;
  cuenta_cobro_id: number;
  monto: number;
  paymentMethodId: string;
  paymentMethod?: PaymentMethod;
  referencia: string | null;
  created_at: string;
}

export interface Client {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  id: number;
  nombre_restaurante: string;
  direccion: string;
  telefono: string;
  nit: string;
  iva_porcentaje: number;
  tipo_impresora: '58mm' | '80mm';
  moneda_simbolo: string;
  created_at: string;
  updated_at: string;
}

export interface CashRegister {
  id: number;
  date: string;
  initialAmount: number;
  finalAmount?: number;
  status: CashRegisterStatus;
  openedBy: number;
  closedBy?: number;
  openedAt: string;
  closedAt?: string;
  notes?: string;
  movements?: CashMovement[];
}

export interface CashMovement {
  id: number;
  cashRegisterId: number;
  accountId: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'PAYMENT' | 'OPENING' | 'CLOSING';
  description?: string;
  reference?: string;
  paymentId?: number;
  createdAt: string;
  account?: Account;
}

export interface CashRegisterSummary {
  accountId: number;
  accountName: string;
  totalAmount: number;
  type: AccountType;
}

export interface DashboardStats {
  ventas_dia: number;
  ordenes_activas: number;
  mesas_ocupadas: number;
  mesas_disponibles: number;
  cuentas_pendientes: number;
  ventas_por_dia: { fecha: string; total: number }[];
  productos_mas_vendidos: { nombre: string; cantidad: number; total: number }[];
  metodos_pago: { metodo: string; total: number; cantidad: number }[];
  ventas_por_periodo: { periodo: string; total: number }[];
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  categoryId?: number;
  paymentMethod?: string;
  clientId?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateOrderPayload {
  mesa_id: number;
  items: { producto_id: number; cantidad: number; notas?: string }[];
  cliente_id?: number;
}

export interface UpdateOrderItemPayload {
  cantidad?: number;
  notas?: string;
}

export interface PaymentPayload {
  pedido_id: number;
  paymentMethodId: string;
  monto: number;
  referencia?: string;
  propina?: number;
  withInvoice?: boolean;
  cliente_id?: number;
}

export interface CreateCollectionPayload {
  cliente_id: number;
  pedidos: number[];
  fecha_vencimiento: string;
}

export interface RegisterCollectionPaymentPayload {
  cuenta_cobro_id: number;
  monto: number;
  paymentMethodId: string;
  referencia?: string;
}
