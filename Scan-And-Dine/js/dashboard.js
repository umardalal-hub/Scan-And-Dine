/* ============================================================
   SCAN & DINE — dashboard.js
   Runs ONLY on waiter-dashboard.html (loaded after app.js).
   Reads/writes `allOrders` from LocalStorage. Because LocalStorage
   is shared across every tab of the same browser, a waiter can
   open this page in one tab while a customer orders in another and
   the dashboard will pick up the new order automatically.
   ============================================================ */

let lastKnownOrderCount = 0;
let currentTab = 'preparing';

/** Play a short two-tone "ding" using the Web Audio API — no audio file needed, works offline */
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, now + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.16);
      osc.stop(now + i * 0.16 + 0.32);
    });
  } catch (e) { /* Web Audio not available — fail silently */ }
}

function getOrders() {
  return getStorage(STORAGE_KEYS.ALL_ORDERS, []);
}

function saveOrders(orders) {
  setStorage(STORAGE_KEYS.ALL_ORDERS, orders);
}

/** Advance an order's status: preparing -> ready -> served */
function advanceOrderStatus(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.status === 'preparing') order.status = 'ready';
  else if (order.status === 'ready') order.status = 'served';

  saveOrders(orders);
  toast(`Order ${orderId} marked as ${order.status}`, 'success', '✅');
  renderDashboard();
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ${mins % 60}m ago`;
}

function orderCardHTML(order) {
  const itemsHTML = order.items.map(i => `<div><span>${i.qty} × ${i.name}</span><span>${formatCurrency(i.price * i.qty)}</span></div>`).join('');
  const actionLabel = order.status === 'preparing' ? 'Mark Ready' : order.status === 'ready' ? 'Mark as Served' : null;

  return `
    <div class="order-card card fade-up">
      <div class="oc-head">
        <div>
          <div class="oc-table">Table ${order.table} · ${order.id}</div>
          <div class="oc-time">${timeAgo(order.time)}</div>
        </div>
        <span class="status-pill ${order.status}">${order.status}</span>
      </div>
      <div class="oc-items">${itemsHTML}</div>
      ${order.instructions ? `<p style="font-size:12px;margin-bottom:10px;">📝 ${order.instructions}</p>` : ''}
      <div class="oc-foot">
        <span class="oc-total">${formatCurrency(order.total)}</span>
        ${actionLabel ? `<button class="btn btn-primary btn-sm" data-advance="${order.id}">${actionLabel}</button>` : `<span class="badge popular">Completed</span>`}
      </div>
    </div>`;
}

function renderStats(orders) {
  const preparing = orders.filter(o => o.status === 'preparing').length;
  const ready = orders.filter(o => o.status === 'ready').length;
  const served = orders.filter(o => o.status === 'served').length;

  $('#statPreparing').textContent = preparing;
  $('#statReady').textContent = ready;
  $('#statServed').textContent = served;
}

function renderDashboard() {
  const orders = getOrders();
  renderStats(orders);

  const filtered = orders.filter(o => o.status === currentTab);
  const listEl = $('#ordersList');

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="emoji">🍽️</div><h3>No ${currentTab} orders</h3><p>New orders will appear here automatically.</p></div>`;
  } else {
    listEl.innerHTML = filtered.map(orderCardHTML).join('');
  }

  // sound + toast notification if a brand-new order arrived since last render
  if (orders.length > lastKnownOrderCount && lastKnownOrderCount !== 0) {
    playNotificationSound();
    toast('New order received!', 'success', '🔔');
  }
  lastKnownOrderCount = orders.length;
}

function switchTab(tab) {
  currentTab = tab;
  $$('.status-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderDashboard();
}

function initDashboard() {
  lastKnownOrderCount = getOrders().length; // baseline, so we don't "ding" on first load
  renderDashboard();

  $$('.status-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  $('#ordersList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-advance]');
    if (btn) advanceOrderStatus(btn.dataset.advance);
  });

  // Pick up orders placed in another tab (customer ordering while waiter watches)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.ALL_ORDERS) renderDashboard();
  });

  // Fallback polling, in case the storage event doesn't fire (e.g. same-tab testing)
  setInterval(renderDashboard, 4000);
}

document.addEventListener('DOMContentLoaded', initDashboard);
