const FIELD_MAP: Record<string, string> = {
  numero: 'number',
  capacidad: 'capacity',
  estado: 'status',
  ubicacion: 'location',
  nombre: 'name',
  descripcion: 'description',
  precio: 'price',
  costo: 'cost',
  categoria_id: 'categoryId',
  activo: 'isActive',
  imagen: 'imageUrl',
  rol: 'role',
  contrasena: 'password',
  mesa_id: 'tableId',
  usuario_id: 'userId',
  cliente_id: 'clientId',
  producto_id: 'productId',
  cantidad: 'quantity',
  notas: 'notes',
  pedido_id: 'orderId',
  telefono: 'phone',
  documento: 'document',
  direccion: 'address',
  tipo: 'type',
  monto: 'amount',
  referencia: 'reference',
  cuenta_cobro_id: 'collectionAccountId',
};

const ENUM_VALUE_MAP: Record<string, Record<string, string>> = {
  status: {
    disponible: 'AVAILABLE',
    ocupada: 'OCCUPIED',
    reservada: 'RESERVED',
    inactiva: 'INACTIVE',
    activa: 'OPEN',
    en_preparacion: 'IN_PROGRESS',
    lista: 'COMPLETED',
    entregada: 'COMPLETED',
    facturada: 'PAID',
    cancelada: 'CANCELLED',
    pendiente: 'PENDING',
    parcial: 'PARTIALLY_PAID',
    pagada: 'PAID',
    vencida: 'OVERDUE',
    anulada: 'CANCELLED',
  },
  role: {
    admin: 'ADMIN',
    mesero: 'WAITER',
    cajero: 'CASHIER',
  },
  rol: {
    admin: 'ADMIN',
    mesero: 'WAITER',
    cajero: 'CASHIER',
  },
};

const ID_SUFFIXES = ['Id', 'id'];

function isIdField(key: string): boolean {
  return ID_SUFFIXES.some(s => key.endsWith(s));
}

function mapValue(key: string, value: any): any {
  if (typeof value === 'number' && isIdField(key)) {
    return String(value);
  }
  if (typeof value === 'string' && ENUM_VALUE_MAP[key]) {
    const lower = value.toLowerCase();
    if (ENUM_VALUE_MAP[key][lower]) {
      return ENUM_VALUE_MAP[key][lower];
    }
  }
  return value;
}

function mapObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(mapObject);
  if (typeof obj !== 'object') return obj;

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const mappedKey = FIELD_MAP[key] || key;
    if (Array.isArray(value)) {
      result[mappedKey] = value.map(v => typeof v === 'object' ? mapObject(v) : v);
    } else if (typeof value === 'object' && value !== null) {
      result[mappedKey] = mapObject(value);
    } else {
      result[mappedKey] = mapValue(mappedKey, value);
    }
  }
  return result;
}

export function translateBody(req: any, _res: any, next: Function) {
  if (req.body && typeof req.body === 'object') {
    req.body = mapObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = mapObject(req.query);
  }
  next();
}
