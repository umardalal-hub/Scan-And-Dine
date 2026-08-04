/* ============================================================
   SCAN & DINE — bill.js
   Runs ONLY on bill.html (loaded after app.js).
   Reads `latestPlacedOrder` from LocalStorage and paints a
   printable, receipt-style bill. No backend / PDF library needed:
   "Download PDF" simply opens the browser print dialog, where the
   user picks "Save as PDF" as the destination — fully offline.
   ============================================================ */

function generateBillNumber(order) {
  // Deterministic-looking bill number derived from the order id + date
  const datePart = new Date(order.time);
  const yy = String(datePart.getFullYear()).slice(-2);
  const mm = String(datePart.getMonth() + 1).padStart(2, '0');
  const dd = String(datePart.getDate()).padStart(2, '0');
  return `BILL/${yy}${mm}${dd}/${order.id.replace('SD-', '')}`;
}

function renderBill() {
  const order = getStorage(STORAGE_KEYS.LATEST_ORDER, null);
  const wrapper = $('#receiptWrapper');
  const settings = getSettings();

  if (!order) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🧾</div>
        <h3>No bill to show yet</h3>
        <p>Place an order first and your bill will appear here.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:14px;">Back to Menu</a>
      </div>`;
    $('#billActions').style.display = 'none';
    return;
  }

  const time = new Date(order.time);
  const timeStr = time.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const itemLines = order.items.map(i => `
    <div class="receipt-line">
      <span class="rname">${i.qty} × ${i.name}<br><span class="rsub">${formatCurrency(i.price)} each</span></span>
      <span>${formatCurrency(i.price * i.qty)}</span>
    </div>
  `).join('');

  wrapper.innerHTML = `
    <div class="receipt" id="printArea">
      <div class="receipt-top">
        <div class="r-logo">🍽️</div>
        <h2>${settings.name}</h2>
        <small>GSTIN: ${settings.gstNumber}</small>
      </div>

      <div class="receipt-meta">
        <div><b>${generateBillNumber(order)}</b>Bill No.</div>
        <div><b>Table ${order.table}</b>Table No.</div>
        <div><b>${order.id}</b>Order ID</div>
        <div><b>${timeStr}</b>Order Time</div>
      </div>

      <div class="receipt-items">${itemLines}</div>

      ${order.instructions ? `<div class="receipt-line" style="margin-top:8px;"><span class="rsub">Note: ${order.instructions}</span></div>` : ''}

      <div class="receipt-total">
        <div class="receipt-line"><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
        ${order.discount > 0 ? `<div class="receipt-line"><span>Coupon (${order.couponCode})</span><span>− ${formatCurrency(order.discount)}</span></div>` : ''}
        <div class="receipt-line"><span>CGST</span><span>${formatCurrency(order.cgst)}</span></div>
        <div class="receipt-line"><span>SGST</span><span>${formatCurrency(order.sgst)}</span></div>
        <div class="receipt-line"><span>Service Charge</span><span>${formatCurrency(order.serviceCharge)}</span></div>
        <div class="receipt-grand"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
      </div>

      <div class="receipt-barcode"></div>
      <p class="receipt-thanks">Thank you for dining with us! 🙏</p>
    </div>
  `;
}

function initBillPage() {
  renderBill();
  $('#printBillBtn')?.addEventListener('click', () => window.print());
  $('#downloadBillBtn')?.addEventListener('click', () => {
    toast('Choose "Save as PDF" in the print dialog', 'default', '📄');
    setTimeout(() => window.print(), 500);
  });
}

document.addEventListener('DOMContentLoaded', initBillPage);
