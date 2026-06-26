import { Order } from '@/types';
import { ordersService } from '@/services/orders';
import { settingsService } from '@/services/settings';
import { formatCurrency, formatDateTime } from './format';

export async function printOrderReceipt(orderOrId: Order | number): Promise<void> {
  const order = typeof orderOrId === 'number' ? await ordersService.getById(orderOrId) : orderOrId;

  let settings = { nombre_restaurante: 'Restaurante', direccion: '', telefono: '', nit: '', moneda_simbolo: '$' };
  try {
    const s = await settingsService.get();
    settings = { ...settings, ...s };
  } catch {}

  const line = '─'.repeat(42);

  const statusLabels: Record<string, string> = {
    activa: 'Activa', en_preparacion: 'En Preparación', lista: 'Lista',
    entregada: 'Entregada', cancelada: 'Cancelada', facturada: 'Facturada',
  };

  const itemsRows = order.items.map(item => `
    <tr>
      <td style="text-align:left;padding:1mm 0">${item.cantidad}x ${item.producto_nombre || ''}</td>
      <td style="text-align:right;padding:1mm 0;white-space:nowrap">${formatCurrency(item.subtotal)}</td>
    </tr>${item.notas ? `
    <tr><td colspan="2" style="font-size:10px;color:#555;padding-left:4mm;padding-bottom:1mm">${item.notas}</td></tr>` : ''}`).join('');

  const subtotal = order.items.reduce((s, i) => s + i.subtotal, 0);
  const propina = Number(order.propina) || 0;

  const receiptHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Pedido #${order.id}</title>
<style>
  @page { margin: 0; size: 80mm auto; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font:11px/1.3 'Courier New',Courier,monospace; width:72mm; padding:2mm 3mm; color:#000; }
  h1 { font-size:16px; text-align:center; margin-bottom:1mm; }
  .info { margin:2mm 0; }
  .info td { padding:0.5mm 0; }
  .info td:last-child { text-align:right; }
  hr { border:none; border-top:1px dashed #000; margin:1.5mm 0; }
  table.items { width:100%; border-collapse:collapse; margin:1.5mm 0; }
  table.items td { border-bottom:1px dashed #ccc; }
  table.totals { width:100%; margin:1.5mm 0; }
  table.totals td { padding:0.8mm 0; }
  table.totals td:last-child { text-align:right; }
  .gt { font-size:14px; font-weight:bold; }
  .footer { text-align:center; margin-top:3mm; font-size:10px; }
  .center { text-align:center; }
</style>
</head>
<body>
  <h1>${settings.nombre_restaurante}</h1>
  <div class="center">${[settings.direccion, settings.telefono, `NIT: ${settings.nit}`].filter(Boolean).join('<br>')}</div>
  <hr>
  <table class="info">
    <tr><td>Pedido #${order.id}</td><td>${formatDateTime(order.created_at)}</td></tr>
    ${order.mesa_numero ? `<tr><td>Mesa #${order.mesa_numero}</td><td>${statusLabels[order.estado] || order.estado}</td></tr>` : ''}
    ${order.cliente_nombre ? `<tr><td colspan="2">Cliente: ${order.cliente_nombre}</td></tr>` : ''}
    ${order.usuario_nombre ? `<tr><td colspan="2">Mesero: ${order.usuario_nombre}</td></tr>` : ''}
  </table>
  <hr>
  <table class="items">${itemsRows}</table>
  <hr>
  <table class="totals">
    <tr><td>Subtotal</td><td>${formatCurrency(subtotal)}</td></tr>
    ${propina > 0 ? `<tr><td>Propina</td><td>${formatCurrency(propina)}</td></tr>` : ''}
    <tr class="gt"><td>TOTAL</td><td>${formatCurrency(order.total)}</td></tr>
    ${order.metodo_pago ? `<tr><td>Método de pago</td><td>${order.metodo_pago}</td></tr>` : ''}
  </table>
  <hr>
  <div class="footer">¡Gracias por su visita!</div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(receiptHtml);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  } else {
    const orig = document.body.innerHTML;
    document.body.innerHTML = receiptHtml;
    setTimeout(() => { window.print(); document.body.innerHTML = orig; }, 200);
  }
}
