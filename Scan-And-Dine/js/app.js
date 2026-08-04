/* ============================================================
   SCAN & DINE — app.js
   CORE MODULE. Loaded on every page BEFORE any page-specific
   script (cart.js / bill.js / dashboard.js).

   Responsibilities of this file:
   1. Hold the static MENU_DATA (our "menu database" since we
      have no backend / real database).
   2. Small reusable helpers ($ , formatCurrency, query params).
   3. LocalStorage read/write helpers (get/set/seed).
   4. Table-number detection from the QR code URL.
   5. Cart functions (add / remove / update qty / clear / count).
   6. Favorites (heart icon) functions.
   7. Theme (dark mode) functions.
   8. Toast notification system.
   9. Shared UI builders: badges, food-card HTML, menu tile counts.
   10. Page boot helpers: loader fade-out, bottom-nav highlighting.
   ============================================================ */

/* ---------- 1. tiny DOM helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Format a number as Indian Rupees, e.g. 1234.5 -> "₹1,234.50" */
function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Read a query-string parameter, e.g. qs('table') for ?table=05 */
function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- 2. LocalStorage helpers ---------- */
const STORAGE_KEYS = {
  TABLE: 'currentTable',
  CART: 'cart',
  LATEST_ORDER: 'latestPlacedOrder',
  ALL_ORDERS: 'allOrders',
  SETTINGS: 'restaurantSettings',
  THEME: 'theme',
  FAVORITES: 'favoriteItems'
};

/** Safely read JSON from LocalStorage, returns fallback if missing/corrupt */
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read failed for', key, e);
    return fallback;
  }
}

/** Safely write a JS value to LocalStorage as JSON */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed for', key, e);
  }
}

/** Seed default restaurant settings the very first time the app runs */
function getSettings() {
  let settings = getStorage(STORAGE_KEYS.SETTINGS, null);
  if (!settings) {
    settings = {
      name: 'Scan & Dine Bistro',
      gstNumber: '27AAAAA0000A1Z5',
      cgstRate: 2.5,   // percent
      sgstRate: 2.5,   // percent
      serviceChargeRate: 5, // percent
      coupons: { 'SND10': 10, 'WELCOME50': 50 } // code -> flat rupee discount
    };
    setStorage(STORAGE_KEYS.SETTINGS, settings);
  }
  return settings;
}

/* ---------- 3. Table detection (QR flow) ----------
   index.html?table=05  -> save "05" as the active table for this
   browser/device. Every other page trusts whatever was last saved,
   so the whole session stays tied to that table without needing a
   backend or login. */
function initTable() {
  const fromUrl = qs('table');
  if (fromUrl) {
    setStorage(STORAGE_KEYS.TABLE, fromUrl.padStart(2, '0'));
  }
  if (!getStorage(STORAGE_KEYS.TABLE, null)) {
    setStorage(STORAGE_KEYS.TABLE, '01'); // fallback demo table
  }
  return getStorage(STORAGE_KEYS.TABLE, '01');
}

function getCurrentTable() {
  return getStorage(STORAGE_KEYS.TABLE, '01');
}

/* ---------- 4. MENU DATA ----------
   This acts as our "database". In a real deployment this could be
   swapped for an API call — every other part of the app only reads
   through findItemById() / MENU_DATA, so the rest of the code would
   not need to change. */
const MENU_DATA = {
  vegStarters: {
    label: 'Veg Starters', icon: '🥗', page: 'veg-starters.html',
    items: [
      { id: 'vs1', name: 'Paneer Tikka', desc: 'Charcoal-grilled cottage cheese cubes marinated in smoky spiced yogurt.', price: 220, veg: true, popular: true, chef: false, available: true, emoji: '🧀' },
      { id: 'vs2', name: 'Crispy Corn Chaat', desc: 'Golden fried corn tossed with tangy masala, onion and lime.', price: 170, veg: true, popular: false, chef: false, available: true, emoji: '🌽' },
      { id: 'vs3', name: 'Hara Bhara Kebab', desc: 'Spinach and green pea patties, pan seared, served with mint chutney.', price: 190, veg: true, popular: false, chef: true, available: true, emoji: '🥬' },
      { id: 'vs4', name: 'Chilli Mushroom (Dry)', desc: 'Button mushrooms wok-tossed in a sweet-spicy Indo-Chinese glaze.', price: 210, veg: true, popular: true, chef: false, available: true, emoji: '🍄' },
      { id: 'vs5', name: 'Veg Spring Rolls', desc: 'Crisp rolls packed with julienned vegetables and glass noodles.', price: 180, veg: true, popular: false, chef: false, available: true, emoji: '🥟' },
      { id: 'vs6', name: 'Tandoori Soya Chaap', desc: 'Soya chaap skewers marinated overnight, finished in the tandoor.', price: 230, veg: true, popular: false, chef: true, available: false, emoji: '🍢' }
    ]
  },
  vegMain: {
    label: 'Veg Main Course', icon: '🍛', page: 'veg-main-course.html',
    items: [
      { id: 'vm1', name: 'Paneer Butter Masala', desc: 'Cottage cheese simmered in a velvety tomato-cashew gravy.', price: 260, veg: true, popular: true, chef: true, available: true, emoji: '🍲' },
      { id: 'vm2', name: 'Dal Makhani', desc: 'Black lentils slow-cooked overnight with butter and cream.', price: 210, veg: true, popular: true, chef: false, available: true, emoji: '🥘' },
      { id: 'vm3', name: 'Veg Kolhapuri', desc: 'Mixed vegetables in a fiery Kolhapuri-style spiced gravy.', price: 230, veg: true, popular: false, chef: false, available: true, emoji: '🌶️' },
      { id: 'vm4', name: 'Malai Kofta', desc: 'Soft paneer-potato dumplings in a mildly sweet, creamy gravy.', price: 250, veg: true, popular: false, chef: true, available: true, emoji: '🍡' },
      { id: 'vm5', name: 'Jeera Rice', desc: 'Basmati rice tempered with cumin and ghee.', price: 150, veg: true, popular: false, chef: false, available: true, emoji: '🍚' },
      { id: 'vm6', name: 'Butter Naan', desc: 'Tandoor-baked leavened bread brushed with butter.', price: 60, veg: true, popular: true, chef: false, available: true, emoji: '🫓' }
    ]
  },
  desserts: {
    label: 'Desserts', icon: '🍰', page: 'desserts.html',
    items: [
      { id: 'ds1', name: 'Gulab Jamun (2 pc)', desc: 'Soft milk-solid dumplings soaked in rose cardamom syrup.', price: 110, veg: true, popular: true, chef: false, available: true, emoji: '🍮' },
      { id: 'ds2', name: 'Molten Chocolate Lava Cake', desc: 'Warm chocolate cake with a gooey liquid centre, served with ice cream.', price: 180, veg: true, popular: true, chef: true, available: true, emoji: '🍫' },
      { id: 'ds3', name: 'Rasmalai', desc: 'Delicate cottage-cheese discs in chilled saffron-cardamom milk.', price: 140, veg: true, popular: false, chef: false, available: true, emoji: '🥛' },
      { id: 'ds4', name: 'Belgian Waffle Sundae', desc: 'Crisp waffle topped with vanilla ice-cream and chocolate drizzle.', price: 190, veg: true, popular: false, chef: false, available: true, emoji: '🧇' },
      { id: 'ds5', name: 'Kulfi Falooda', desc: 'Traditional kulfi over vermicelli, basil seeds and rose syrup.', price: 150, veg: true, popular: false, chef: true, available: true, emoji: '🍨' }
    ]
  },
  nonvegStarters: {
    label: 'Non-Veg Starters', icon: '🍗', page: 'nonveg-starters.html',
    items: [
      { id: 'ns1', name: 'Chicken Tikka', desc: 'Boneless chicken chunks marinated in yogurt and spices, tandoor-grilled.', price: 260, veg: false, popular: true, chef: true, available: true, emoji: '🍗' },
      { id: 'ns2', name: 'Fish Amritsari', desc: 'Batter-fried fish fillets with a crunchy carom-seed coating.', price: 290, veg: false, popular: false, chef: false, available: true, emoji: '🐟' },
      { id: 'ns3', name: 'Chicken 65', desc: 'Deep-fried spicy chicken bites tempered with curry leaves.', price: 250, veg: false, popular: true, chef: false, available: true, emoji: '🍖' },
      { id: 'ns4', name: 'Mutton Seekh Kebab', desc: 'Minced mutton skewers, hand-shaped and char-grilled.', price: 320, veg: false, popular: false, chef: true, available: true, emoji: '🍢' },
      { id: 'ns5', name: 'Prawn Koliwada', desc: 'Crispy fried prawns tossed in a tangy chilli-garlic masala.', price: 340, veg: false, popular: false, chef: false, available: false, emoji: '🦐' }
    ]
  },
  nonvegMain: {
    label: 'Non-Veg Main Course', icon: '🍖', page: 'nonveg-main-course.html',
    items: [
      { id: 'nm1', name: 'Butter Chicken', desc: 'Tandoori chicken in a rich, buttery tomato gravy — the house special.', price: 320, veg: false, popular: true, chef: true, available: true, emoji: '🍛' },
      { id: 'nm2', name: 'Mutton Rogan Josh', desc: 'Slow-braised mutton in an aromatic Kashmiri red-chilli gravy.', price: 380, veg: false, popular: false, chef: true, available: true, emoji: '🥘' },
      { id: 'nm3', name: 'Chicken Biryani', desc: 'Layered basmati rice and spiced chicken, dum-cooked with saffron.', price: 300, veg: false, popular: true, chef: false, available: true, emoji: '🍚' },
      { id: 'nm4', name: 'Egg Curry', desc: 'Boiled eggs simmered in a spiced onion-tomato masala.', price: 200, veg: false, popular: false, chef: false, available: true, emoji: '🥚' },
      { id: 'nm5', name: 'Fish Curry (Coastal)', desc: 'Fresh fish cooked in a tangy coconut-based coastal curry.', price: 340, veg: false, popular: false, chef: false, available: true, emoji: '🐠' }
    ]
  },
  drinks: {
    label: 'Drinks', icon: '🥤', page: 'drinks.html',
    items: [
      { id: 'dr1', name: 'Masala Chaas', desc: 'Chilled spiced buttermilk with roasted cumin and mint.', price: 70, veg: true, popular: false, chef: false, available: true, emoji: '🥛' },
      { id: 'dr2', name: 'Fresh Lime Soda', desc: 'Sweet, salted or plain — refreshing lime with soda.', price: 90, veg: true, popular: true, chef: false, available: true, emoji: '🍋' },
      { id: 'dr3', name: 'Mango Lassi', desc: 'Thick yogurt smoothie blended with ripe alphonso mango.', price: 130, veg: true, popular: true, chef: false, available: true, emoji: '🥭' },
      { id: 'dr4', name: 'Cold Coffee', desc: 'Blended coffee with milk, ice and a scoop of ice-cream.', price: 140, veg: true, popular: false, chef: true, available: true, emoji: '☕' },
      { id: 'dr5', name: 'Virgin Mojito', desc: 'Mint, lime and soda over crushed ice — zero alcohol.', price: 150, veg: true, popular: false, chef: false, available: true, emoji: '🍹' },
      { id: 'dr6', name: 'Masala Soda', desc: 'Fizzy soda with tangy jaljeera masala.', price: 80, veg: true, popular: false, chef: false, available: true, emoji: '🫧' }
    ]
  }
};

/** Flatten every item across every category into one array */
function getAllItems() {
  return Object.values(MENU_DATA).flatMap(cat => cat.items);
}

/** Find a single menu item anywhere in MENU_DATA by its id */
function findItemById(id) {
  return getAllItems().find(item => item.id === id) || null;
}

/* ---------- 5. Cart functions ----------
   Cart is stored as an array of { id, qty }. We keep price/name in
   MENU_DATA (single source of truth) and only store id + qty so the
   cart never goes stale if a price is corrected. */
function getCart() {
  return getStorage(STORAGE_KEYS.CART, []);
}

function saveCart(cart) {
  setStorage(STORAGE_KEYS.CART, cart);
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  const item = findItemById(id);
  toast(`${item ? item.name : 'Item'} added to cart`, 'success', '🛒');
}

function updateCartQty(id, delta) {
  let cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (!existing) return;
  existing.qty += delta;
  if (existing.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  toast('Item removed from cart', 'error', '🗑️');
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function getCartDetailed() {
  return getCart().map(c => {
    const item = findItemById(c.id);
    return item ? { ...item, qty: c.qty, lineTotal: item.price * c.qty } : null;
  }).filter(Boolean);
}

function getCartSubtotal() {
  return getCartDetailed().reduce((sum, i) => sum + i.lineTotal, 0);
}

/** Update the little badge on the floating cart button / nav icon, if present on this page */
function updateCartBadge() {
  const count = getCartCount();
  $$('.cart-count-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---------- 6. Favorites ---------- */
function getFavorites() {
  return getStorage(STORAGE_KEYS.FAVORITES, []);
}
function isFavorite(id) {
  return getFavorites().includes(id);
}
function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  setStorage(STORAGE_KEYS.FAVORITES, favs);
  return favs.includes(id);
}

/* ---------- 7. Theme (dark mode) ---------- */
function initTheme() {
  const saved = getStorage(STORAGE_KEYS.THEME, 'light');
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  setStorage(STORAGE_KEYS.THEME, next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  $$('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

/* ---------- 8. Toast notifications ---------- */
function toast(message, type = 'default', icon = '✅') {
  let stack = $('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="t-ic">${icon}</span><span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    el.style.transition = 'all .3s ease';
    setTimeout(() => el.remove(), 300);
  }, 2400);
}

/* ---------- 9. Shared UI builders ---------- */

/** Build the little badge pills (Popular / Chef Special / Sold Out) for an item */
function badgesHTML(item) {
  let html = '';
  if (item.popular) html += `<span class="badge popular">⭐ Popular</span>`;
  if (item.chef) html += `<span class="badge chef">👨‍🍳 Chef Special</span>`;
  if (!item.available) html += `<span class="badge unavailable">Sold Out</span>`;
  return html;
}

/** Build one food-card's HTML (used on every category page) */
function foodCardHTML(item) {
  const inCart = getCart().find(c => c.id === item.id);
  const vegMarkClass = item.veg ? '' : 'non';
  const fav = isFavorite(item.id) ? '❤️' : '🤍';

  const actionHTML = !item.available
    ? `<button class="add-btn" disabled>Sold Out</button>`
    : inCart
      ? `<div class="stepper" data-id="${item.id}">
           <button class="qty-minus" aria-label="Decrease quantity">−</button>
           <span>${inCart.qty}</span>
           <button class="qty-plus" aria-label="Increase quantity">+</button>
         </div>`
      : `<button class="add-btn" data-id="${item.id}">+ Add</button>`;

  return `
  <article class="food-card card fade-up" data-item-id="${item.id}">
    <button class="favorite-btn" data-fav-id="${item.id}" aria-label="Toggle favorite">${fav}</button>
    <div class="thumb" style="display:flex;align-items:center;justify-content:center;font-size:34px;">
      <span class="veg-mark ${vegMarkClass}"></span>
      ${item.emoji}
    </div>
    <div class="info">
      <div class="top-row">
        <h4>${item.name}</h4>
      </div>
      <p class="desc">${item.desc}</p>
      <div class="badges">${badgesHTML(item)}</div>
      <div class="bottom-row">
        <span class="price">${formatCurrency(item.price)}</span>
        ${actionHTML}
      </div>
    </div>
  </article>`;
}

/**
 * Render every item of a category into a container element.
 * Wires up Add / stepper / favorite buttons via event delegation
 * so it keeps working even after re-rendering the list.
 */
function renderMenuItems(containerSelector, categoryKey) {
  const container = $(containerSelector);
  if (!container) return;
  const category = MENU_DATA[categoryKey];
  if (!category) { container.innerHTML = '<p>Category not found.</p>'; return; }

  if (category.items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="emoji">🍽️</div><h3>No items yet</h3><p>Please check back soon.</p></div>`;
    return;
  }

  container.innerHTML = category.items.map(foodCardHTML).join('');
  updateCartBadge();

  // event delegation: one listener handles every card, forever
  container.addEventListener('click', handleMenuContainerClick);
}

function handleMenuContainerClick(e) {
  const addBtn = e.target.closest('.add-btn:not([disabled])');
  const plusBtn = e.target.closest('.qty-plus');
  const minusBtn = e.target.closest('.qty-minus');
  const favBtn = e.target.closest('.favorite-btn');
  const container = e.currentTarget;

  if (addBtn) {
    addToCart(addBtn.dataset.id, 1);
    rerenderCard(container, addBtn.dataset.id);
  } else if (plusBtn) {
    const id = plusBtn.closest('.stepper').dataset.id;
    updateCartQty(id, 1);
    rerenderCard(container, id);
  } else if (minusBtn) {
    const id = minusBtn.closest('.stepper').dataset.id;
    updateCartQty(id, -1);
    rerenderCard(container, id);
  } else if (favBtn) {
    const nowFav = toggleFavorite(favBtn.dataset.favId);
    favBtn.textContent = nowFav ? '❤️' : '🤍';
  }
}

/** Re-draw just one card's action area after a cart change, instead of the whole list */
function rerenderCard(container, id) {
  const item = findItemById(id);
  if (!item) return;
  const card = container.querySelector(`[data-item-id="${id}"]`);
  if (!card) return;
  card.outerHTML = foodCardHTML(item);
}

/* ---------- 10. Page boot helpers ---------- */

/** Hide the loading overlay shortly after the page finishes loading */
function initLoader() {
  const overlay = $('.loader-overlay');
  if (!overlay) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 400);
    }, 450);
  });
}

/** Highlight the correct bottom-nav icon.
 *  Each page sets <body data-nav="home|veg|nonveg|drinks|cart"> so that
 *  category sub-pages (e.g. veg-starters.html) still light up "Veg". */
function initBottomNav() {
  const current = document.body.dataset.nav;
  $$('.nav-item').forEach(item => {
    if (item.dataset.page === current) item.classList.add('active');
  });
}

/** Wire up the dark-mode toggle button(s) present on the page */
function initThemeToggle() {
  $$('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
}

/** Wire up the table chip so it always reflects the saved table number */
function initTableChip() {
  const table = getCurrentTable();
  $$('.js-table-number').forEach(el => el.textContent = table);
}

/**
 * Standard boot sequence every page calls on DOMContentLoaded.
 * Keeps every HTML file's inline script tiny (no inline JS —
 * just one initApp() call, per the project's requirements).
 */
function initApp() {
  initTable();
  initTheme();
  getSettings();
  initLoader();
  initBottomNav();
  initThemeToggle();
  initTableChip();
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', initApp);
