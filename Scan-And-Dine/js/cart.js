/* ============================================================
   SCAN & DINE — cart.js
   Runs ONLY on cart.html (loaded after app.js).
   Handles: rendering the cart list, quantity +/-, remove, clear,
   cooking instructions, coupon codes, GST + service charge maths,
   and placing the order into LocalStorage.
   ============================================================ */

const CART_EXTRA_KEYS = {
  INSTRUCTIONS: 'cookingInstructions',
  COUPON: 'appliedCoupon'
};

/** Draw the cart items, or the empty-state, into #cartList */
function renderCartPage() {
  const listEl = $('#cartList');
  const items = getCartDetailed();

  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Browse the menu and add something delicious.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:14px;">Browse Menu</a>
      </div>`;
    $('#cartSummarySection').style.display = 'none';
    return;
  }

  $('#cartSummarySection').style.display = 'block';

  listEl.innerHTML = items.map(item => `
    <div class="cart-item card fade-up" data-id="${item.id}">
      <div class="thumb" style="display:flex;align-items:center;justify-content:center;font-size:26px;">${item.emoji}</div>
      <div class="info">
        <h4>${item.name}</h4>
        <span class="unit-price">${formatCurrency(item.price)} × ${item.qty}</span>
      </div>
      <div class="stepper" data-id="${item.id}">
        <button class="qty-minus" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button class="qty-plus" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-x" data-remove-id="${item.id}" aria-label="Remove item">✕</button>
    </div>
  `).join('');

  renderBillSummary();
}

/** Compute subtotal, discount, GST, service charge and grand total */
function computeBill() {
  const settings = getSettings();
  const subtotal = getCartSubtotal();

  const couponCode = getStorage(CART_EXTRA_KEYS.COUPON, null);
  const discount = couponCode && settings.coupons[couponCode] ? settings.coupons[couponCode] : 0;

  const taxable = Math.max(subtotal - discount, 0);
  const cgst = +(taxable * (settings.cgstRate / 100)).toFixed(2);
  const sgst = +(taxable * (settings.sgstRate / 100)).toFixed(2);
  const serviceCharge = +(taxable * (settings.serviceChargeRate / 100)).toFixed(2);
  const total = +(taxable + cgst + sgst + serviceCharge).toFixed(2);

  return { subtotal, couponCode, discount, cgst, sgst, serviceCharge, total, settings };
}

/** Paint the bill summary card with live numbers */
function renderBillSummary() {
  const bill = computeBill();
  const el = $('#billSummary');
  if (!el) return;

  el.innerHTML = `
    <div class="bill-row"><span>Subtotal</span><span class="val">${formatCurrency(bill.subtotal)}</span></div>
    ${bill.discount > 0 ? `<div class="bill-row"><span>Coupon (${bill.couponCode})</span><span class="val">− ${formatCurrency(bill.discount)}</span></div>` : ''}
    <div class="bill-row"><span>CGST (${bill.settings.cgstRate}%)</span><span class="val">${formatCurrency(bill.cgst)}</span></div>
    <div class="bill-row"><span>SGST (${bill.settings.sgstRate}%)</span><span class="val">${formatCurrency(bill.sgst)}</span></div>
    <div class="bill-row"><span>Service Charge (${bill.settings.serviceChargeRate}%)</span><span class="val">${formatCurrency(bill.serviceCharge)}</span></div>
    <div class="bill-row total"><span>Total</span><span class="val">${formatCurrency(bill.total)}</span></div>
  `;

  $('#placeOrderBtn').disabled = getCart().length === 0;
}

/** Try to apply a coupon code typed into the input */
function applyCoupon() {
  const input = $('#couponInput');
  const code = input.value.trim().toUpperCase();
  const settings = getSettings();

  if (!code) return;

  if (settings.coupons[code]) {
    setStorage(CART_EXTRA_KEYS.COUPON, code);
    toast(`Coupon ${code} applied — you saved ${formatCurrency(settings.coupons[code])}!`, 'success', '🎟️');
  } else {
    toast('Invalid coupon code', 'error', '⚠️');
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    setStorage(CART_EXTRA_KEYS.COUPON, null);
  }
  renderBillSummary();
}

/** Save cooking instructions to LocalStorage as the user types (debounced-lite) */
function bindInstructions() {
  const box = $('#instructionsInput');
  if (!box) return;
  box.value = getStorage(CART_EXTRA_KEYS.INSTRUCTIONS, '') || '';
  box.addEventListener('input', () => {
    setStorage(CART_EXTRA_KEYS.INSTRUCTIONS, box.value);
  });
}

/** Generate a short, human-readable order ID, e.g. SD-4821 */
function generateOrderId() {
  return 'SD-' + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Places the order:
 * 1. Build an order object from the cart + bill totals.
 * 2. Push it into `allOrders` (read by the Waiter Dashboard).
 * 3. Save it as `latestPlacedOrder` (read by the Bill page).
 * 4. Clear the cart + instructions + coupon.
 * 5. Redirect to bill.html.
 */
function placeOrder() {
  const items = getCartDetailed();
  if (items.length === 0) {
    toast('Your cart is empty', 'error', '⚠️');
    return;
  }

  const bill = computeBill();
  const order = {
    id: generateOrderId(),
    table: getCurrentTable(),
    items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, veg: i.veg })),
    instructions: getStorage(CART_EXTRA_KEYS.INSTRUCTIONS, ''),
    couponCode: bill.couponCode,
    subtotal: bill.subtotal,
    discount: bill.discount,
    cgst: bill.cgst,
    sgst: bill.sgst,
    serviceCharge: bill.serviceCharge,
    total: bill.total,
    time: new Date().toISOString(),
    status: 'preparing'
  };

  const allOrders = getStorage(STORAGE_KEYS.ALL_ORDERS, []);
  allOrders.unshift(order);
  setStorage(STORAGE_KEYS.ALL_ORDERS, allOrders);
  setStorage(STORAGE_KEYS.LATEST_ORDER, order);

  // reset cart-related state for the next order
  clearCart();
  setStorage(CART_EXTRA_KEYS.INSTRUCTIONS, '');
  setStorage(CART_EXTRA_KEYS.COUPON, null);

  toast('Order placed! Redirecting to your bill…', 'success', '🎉');
  setTimeout(() => { window.location.href = 'bill.html'; }, 900);
}

function initCartPage() {
  renderCartPage();
  bindInstructions();

  $('#cartList').addEventListener('click', (e) => {
    const plusBtn = e.target.closest('.qty-plus');
    const minusBtn = e.target.closest('.qty-minus');
    const removeBtn = e.target.closest('[data-remove-id]');

    if (plusBtn) { updateCartQty(plusBtn.closest('.stepper').dataset.id, 1); renderCartPage(); }
    else if (minusBtn) { updateCartQty(minusBtn.closest('.stepper').dataset.id, -1); renderCartPage(); }
    else if (removeBtn) { removeFromCart(removeBtn.dataset.removeId); renderCartPage(); }
  });

  $('#clearCartBtn')?.addEventListener('click', () => {
    if (getCart().length === 0) return;
    clearCart();
    toast('Cart cleared', 'default', '🧹');
    renderCartPage();
  });

  $('#applyCouponBtn')?.addEventListener('click', applyCoupon);
  $('#placeOrderBtn')?.addEventListener('click', placeOrder);
}

document.addEventListener('DOMContentLoaded', initCartPage);
