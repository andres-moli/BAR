import { Order, CashRegister, CashMovement, CashRegisterSummary, WaiterReport } from '@/types';
import { ordersService } from '@/services/orders';
import { settingsService } from '@/services/settings';
import { formatCurrency, formatDateTime } from './format';

export async function printOrderReceipt(orderOrId: Order | number): Promise<void> {
  const order = typeof orderOrId === 'number' ? await ordersService.getById(orderOrId) : orderOrId;

  let settings = { nombre_restaurante: 'Pal Dm Boutique', direccion: 'Barrio p-5 Tr 15 8-44', telefono: '3117211581', nit: '', moneda_simbolo: '$' };
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
      <td style="text-align:left;padding:1mm 0">${item.cantidad}x ${item.combo_nombre || item.producto_nombre || ''}</td>
      <td style="text-align:right;padding:1mm 0;white-space:nowrap">${formatCurrency(item.subtotal)}</td>
    </tr>${item.notas ? `
    <tr><td colspan="2" style="font-size:10px;color:#555;padding-left:4mm;padding-bottom:1mm">${item.notas}</td></tr>` : ''}`).join('');

  const subtotal = order.items.reduce((s, i) => s + i.subtotal, 0);
  const propina = Number(order.propina) || 0;

  const logoUrl = `${window.location.origin}/logo-bar.png`;

  const receiptHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Pedido #${order.id}</title>
<style>
  @page { margin: 0; size: 80mm auto; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font:11px/1.3 'Courier New',Courier,monospace; width:72mm; padding:2mm 3mm; color:#000; }
  .logo { text-align:center; margin-bottom:1mm; }
  .logo img { max-width:50mm; max-height:15mm; object-fit:contain; }
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
  <div class="logo"><img src="${logoUrl}" alt="Logo" /></div>
  <h1>${settings.nombre_restaurante}</h1>
  <div class="center">${[settings.direccion, settings.telefono].filter(Boolean).join('<br>')}</div>
  <hr>
  <table class="info">
    <tr><td>Pedido #${order.id}</td><td>${formatDateTime(order.created_at)}</td></tr>
    ${order.mesa_numero ? `<tr><td>${order.mesa_nombre || `Mesa #${order.mesa_numero}`}</td><td>${statusLabels[order.estado] || order.estado}</td></tr>` : ''}
    ${order.cliente_nombre ? `<tr><td colspan="2">Cliente: ${order.cliente_nombre}</td></tr>` : ''}
    ${order.usuario_nombre ? `<tr><td colspan="2">Mesero: ${order.usuario_nombre}</td></tr>` : ''}
  </table>
  <hr>
  <table class="items">${itemsRows}</table>
  <hr>
  <table class="totals">
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

export async function printCashRegisterReport(
  register: CashRegister,
  movements: CashMovement[],
  summary: CashRegisterSummary[],
  waiters: WaiterReport[] = [],
): Promise<void> {
  let settings = { nombre_restaurante: 'Pal Dm Boutique', direccion: 'Barrio p-5 Tr 15 8-44', telefono: '3117211581', nit: '', moneda_simbolo: '$' };
  try {
    const s = await settingsService.get();
    settings = { ...settings, ...s };
  } catch {}

  const line = '─'.repeat(42);
  const logoUrl = `${window.location.origin}/logo-bar.png`;

  const statusLabel = register.status === 'OPEN' ? 'Abierta' : 'Cerrada';

  const movementsRows = movements.map(m => `
    <tr>
      <td style="text-align:left;padding:0.8mm 0">${m.account?.nombre || m.account?.name || `Cuenta #${m.accountId}`}</td>
      <td style="text-align:right;padding:0.8mm 0;white-space:nowrap;${Number(m.amount) >= 0 ? 'color:#2563eb' : 'color:#dc2626'}">${Number(m.amount) >= 0 ? '+' : ''}${formatCurrency(m.amount)}</td>
    </tr>
    <tr><td colspan="2" style="font-size:10px;color:#555;padding-left:2mm;padding-bottom:0.5mm">${m.description || m.type} &middot; ${formatDateTime(m.createdAt)}</td></tr>`).join('');

  const summaryRows = summary.map(s => `
    <tr>
      <td style="text-align:left;padding:0.8mm 0">${s.accountName}</td>
      <td style="text-align:right;padding:0.8mm 0;white-space:nowrap;color:#2563eb">${formatCurrency(s.totalAmount)}</td>
    </tr>`).join('');

  const totalEntrance = summary.reduce((a, s) => a + s.totalAmount, 0);
  const finalAmount = (register.initialAmount || 0) + totalEntrance;

  const receiptHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Reporte de Caja</title>
<style>
  @page { margin: 0; size: 80mm auto; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font:11px/1.3 'Courier New',Courier,monospace; width:72mm; padding:2mm 3mm; color:#000; }
  .logo { text-align:center; margin-bottom:1mm; }
  .logo img { max-width:50mm; max-height:15mm; object-fit:contain; }
  h1 { font-size:16px; text-align:center; margin-bottom:1mm; }
  h2 { font-size:13px; text-align:center; margin:2mm 0 1mm; font-weight:bold; }
  .info { margin:2mm 0; }
  .info td { padding:0.5mm 0; }
  .info td:last-child { text-align:right; }
  hr { border:none; border-top:1px dashed #000; margin:1.5mm 0; }
  table { width:100%; border-collapse:collapse; margin:1.5mm 0; }
  td { padding:0.8mm 0; }
  td:last-child { text-align:right; }
  .gt { font-size:14px; font-weight:bold; }
  .footer { text-align:center; margin-top:3mm; font-size:10px; }
  .center { text-align:center; }
  .section-title { font-size:11px; font-weight:bold; margin-top:2mm; margin-bottom:0.5mm; }
</style>
</head>
<body>
  <div class="logo"><img src="${logoUrl}" alt="Logo" /></div>
  <h1>${settings.nombre_restaurante}</h1>
  <div class="center">${[settings.direccion, settings.telefono].filter(Boolean).join('<br>')}${settings.nit ? '<br>NIT: ' + settings.nit : ''}</div>
  <hr>
  <h2>REPORTE DE CAJA</h2>
  <table class="info">
    <tr><td>Estado</td><td>${statusLabel}</td></tr>
    <tr><td>Apertura</td><td>${formatDateTime(register.openedAt)}</td></tr>
    ${register.closedAt ? `<tr><td>Cierre</td><td>${formatDateTime(register.closedAt)}</td></tr>` : ''}
    <tr><td>Monto Inicial</td><td>${formatCurrency(register.initialAmount)}</td></tr>
  </table>
  ${register.notes ? `<div class="center" style="font-size:10px;color:#555;margin:1mm 0">Notas: ${register.notes}</div>` : ''}
  <hr>
  ${movements.length > 0 ? `
  <div class="section-title">MOVIMIENTOS</div>
  <table>${movementsRows}</table>
  <hr>` : ''}
  ${summary.length > 0 ? `
  <div class="section-title">RESUMEN POR CUENTA</div>
  <table>${summaryRows}</table>
  <hr>` : ''}
  <table>
    <tr><td>Total Ingresos</td><td style="color:#2563eb">${formatCurrency(totalEntrance)}</td></tr>
    <tr class="gt"><td>MONTO FINAL</td><td>${formatCurrency(finalAmount)}</td></tr>
  </table>
  <hr>
  ${waiters.length > 0 ? `
  <h2>REPORTE POR MESERO</h2>
  ${waiters.map(w => `
  <div style="margin:2mm 0;border:1px dashed #999;padding:1.5mm">
    <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:12px">
      <span>${w.userName}</span>
      <span>${formatCurrency(w.totalSales)}</span>
    </div>
    <div style="font-size:10px;color:#555;margin:1mm 0">${w.orders.length} orden(es)</div>
    ${w.products.length > 0 ? `
    <table style="font-size:10px;margin:0.5mm 0">
      ${w.products.map((p: any) => `
      <tr>
        <td style="text-align:left;padding:0.3mm 0">${p.productName} x${p.quantity}</td>
        <td style="text-align:right;padding:0.3mm 0">${formatCurrency(p.total)}</td>
      </tr>`).join('')}
    </table>` : ''}
    <div style="font-size:9px;color:#888">${w.orders.map((o: any) => `#${o.orderId}${o.tableNumber ? ' M' + o.tableNumber : ''}`).join(' · ')}</div>
  </div>`).join('')}
  <table style="font-weight:bold">
    <tr><td>Total Ventas Meseros</td><td>${formatCurrency(waiters.reduce((a, w) => a + w.totalSales, 0))}</td></tr>
  </table>
  <hr>` : ''}
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
