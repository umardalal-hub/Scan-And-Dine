# SCAN & DINE
### QR Code Based Restaurant Ordering System
## College Project Report

---

## COVER PAGE

**Project Title:** Scan & Dine — QR Code Based Restaurant Ordering System
**Tagline:** Scan • Order • Dine
**Submitted in partial fulfilment of the requirements for the degree of**
Bachelor of Computer Applications / Engineering *(edit to match your course)*

**Submitted by:** *[Your Name]* — *[Roll No.]*
**Under the guidance of:** *[Guide's Name]*
**Department of:** *[Department Name]*
**College/University:** *[College Name]*
**Academic Year:** 2025–2026

---

## CERTIFICATE

This is to certify that the project titled **"Scan & Dine — QR Code Based Restaurant Ordering System"** is a bona fide work carried out by **[Your Name]**, Roll No. **[Roll No.]**, in partial fulfilment of the requirements for the degree of **[Degree Name]** during the academic year **2025–2026**, under my guidance and supervision.

Project Guide: _______________________
Head of Department: _______________________
External Examiner: _______________________
Date: _______________________

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to my project guide, **[Guide's Name]**, for their invaluable guidance, encouragement and constructive feedback throughout the development of this project. I am also thankful to the Head of the Department and all faculty members for providing the resources and environment necessary to complete this work. Finally, I extend my thanks to my family and friends for their constant support.

---

## ABSTRACT

Traditional restaurant ordering relies on printed menus and waiters who must manually take down orders, relay them to the kitchen, and later prepare a bill — a process that is slow, error-prone, and requires significant staff involvement, especially during peak hours. **Scan & Dine** addresses this problem with a fully client-side web application that lets a customer scan a QR code placed on their table, browse an interactive digital menu, build a cart, and place an order directly from their own smartphone. The order instantly becomes visible on a **Waiter Dashboard**, allowing kitchen and service staff to track and update order status in real time. A bill, complete with GST and service charge calculations, is generated automatically at the end of the flow.

The system is built using only **HTML5, CSS3 and vanilla JavaScript**, and stores all data in the browser's **LocalStorage** — deliberately avoiding any backend server, database, or third-party service such as Firebase, Node.js or PHP. This constraint demonstrates that a genuinely useful, good-looking, interactive ordering experience can be built entirely on the front end, making the project an ideal demonstration of core web development and UI/UX design skills for a college setting, while remaining lightweight enough to run instantly on any device with a browser.

---

## 1. INTRODUCTION

Dining out often involves an unavoidable amount of waiting: waiting for a waiter to take an order, waiting for the order to be correctly relayed to the kitchen, and waiting again for the bill. Scan & Dine reimagines this experience as a **self-service, mobile-first ordering flow**. By scanning a QR code that encodes the current table number (e.g. `index.html?table=05`), a diner is taken straight into a digital menu tailored to their table, with every subsequent step — browsing, adding to cart, applying an offer, placing the order — handled entirely within the browser. Because the app stores its state in LocalStorage instead of on a server, it works fully offline once loaded and needs no ongoing infrastructure, which also makes it simple, safe and inexpensive for a small or student-run establishment to trial.

---

## 2. PROBLEM STATEMENT

Manual, waiter-dependent ordering systems in restaurants suffer from:
- Delays in taking and relaying orders, especially during rush hours.
- Human error in noting down items, quantities, or special instructions.
- No real-time visibility for kitchen staff into how many orders are pending.
- Manual, error-prone bill calculation (GST, service charge, discounts).
- Higher staffing requirements purely for order-taking.

There is a need for a **lightweight, easy-to-deploy digital ordering system** that removes these bottlenecks without requiring restaurants to invest in expensive POS software, backend servers, or ongoing subscriptions.

---

## 3. OBJECTIVES

1. Allow a customer to identify their table automatically via a QR-coded URL.
2. Provide a browsable, categorized, visually appealing digital menu.
3. Allow customers to build and manage a cart (add, update, remove items).
4. Automatically calculate GST, service charge and apply coupon discounts.
5. Let customers place an order that is instantly visible to staff.
6. Provide a Waiter Dashboard for staff to track and update order status.
7. Generate a clean, printable bill/receipt at the end of the order.
8. Achieve all of the above using only front-end technologies — no backend, no database — to keep the system simple, portable and free to run.

---

## 4. SCOPE

**In scope:** table detection via URL, full menu browsing across 6 categories, cart management, coupons, GST/service-charge billing, order placement, waiter order-status dashboard, printable bill, dark mode, responsive mobile-first UI.

**Out of scope (see Future Scope):** real payment gateway integration, multi-device order sync (since data lives in a single browser's LocalStorage), user authentication/login, real QR image generation, kitchen-printer integration, multi-restaurant/multi-tenant support.

---

## 5. LITERATURE SURVEY

Existing commercial solutions such as **Zomato/Swiggy Dineout**, **Petpooja**, and various **QR-menu SaaS platforms** provide restaurant ordering but rely on cloud backends, subscriptions, and internet connectivity for every action, which adds cost and complexity unsuitable for a classroom demonstration of core web fundamentals. Academic and hobbyist projects on QR-based ordering typically use Firebase or a Node.js + MongoDB stack to persist orders. Scan & Dine deliberately departs from this pattern to demonstrate that the **entire user journey — from menu to bill — can be modelled and persisted using only the browser's built-in LocalStorage API**, which is a valuable exercise in understanding client-side state management, a foundational skill before learning full backend development.

---

## 6. REQUIREMENT ANALYSIS

### 6.1 Functional Requirements
- FR1: System shall detect and store the table number from the URL query string.
- FR2: System shall display menu items grouped into categories with price, description, image, and badges.
- FR3: System shall allow adding/removing items and changing quantity in a cart.
- FR4: System shall calculate CGST, SGST, service charge and coupon discounts.
- FR5: System shall persist the cart and orders using LocalStorage.
- FR6: System shall display all placed orders on a Waiter Dashboard with status controls.
- FR7: System shall generate a printable bill.

### 6.2 Non-Functional Requirements
- NFR1: The UI shall be responsive and usable on mobile, tablet and desktop.
- NFR2: The app shall function without an internet connection (after first load).
- NFR3: The app shall provide visual feedback (toasts, animations, loaders) for user actions.
- NFR4: Code shall be modular, commented, and reusable.

### 6.3 Hardware Requirements
- A computer/laptop with minimum 4GB RAM (for development).
- A smartphone or any device with a modern web browser (for usage/testing).
- A working QR code (can be generated online) pointing to `index.html?table=<number>` for live demonstration (optional).

### 6.4 Software Requirements
- Operating System: Windows / macOS / Linux (any).
- Code Editor: Visual Studio Code.
- Browser: Google Chrome / Microsoft Edge / Firefox (latest version).
- VS Code Extension: Live Server.
- No database server, no runtime environment (Node.js/PHP) required.

---

## 7. SYSTEM DESIGN

### 7.1 Architecture Diagram (Conceptual)

```
                 ┌────────────────────────────────────────┐
                 │              CUSTOMER DEVICE            │
                 │                                          │
                 │   Browser  ───▶  HTML + CSS + JS Pages   │
                 │                     │                     │
                 │                     ▼                     │
                 │              LocalStorage (Cart, Order)   │
                 └───────────────────┬──────────────────────┘
                                     │  (same-browser / same-origin)
                                     ▼
                 ┌────────────────────────────────────────┐
                 │             STAFF DEVICE / TAB           │
                 │                                          │
                 │   Waiter Dashboard  ◀───  LocalStorage    │
                 │   (reads allOrders, updates status)       │
                 └────────────────────────────────────────┘
```
There is no application server or database server in this architecture — the "backend" role (storing and retrieving state) is entirely played by the browser's LocalStorage, which is why the Waiter Dashboard must be opened in a tab of the *same browser* to see live orders in this offline-first demo version (see Future Scope for a networked version).

### 7.2 Flowchart — Overall Order Flow
```
 START
   │
   ▼
 Scan QR Code (index.html?table=05)
   │
   ▼
 Table Number Saved to LocalStorage
   │
   ▼
 Customer Browses Menu (Veg / Non-Veg / Drinks)
   │
   ▼
 Customer Adds Items → Cart Updated in LocalStorage
   │
   ▼
 Customer Reviews Cart, Adds Instructions / Coupon
   │
   ▼
 Customer Places Order
   │
   ▼
 Order Saved to LocalStorage (allOrders + latestPlacedOrder)
   │
   ▼
 Waiter Dashboard Reads New Order → Sound Alert
   │
   ▼
 Waiter Updates Status: Preparing → Ready → Served
   │
   ▼
 Bill Page Displays Final Receipt
   │
   ▼
 END
```

### 7.3 Data Flow Diagram (Level 0)
```
[Customer] → (selects items) → [Menu Page] → (add to cart) → [Cart: LocalStorage]
[Cart: LocalStorage] → (place order) → [Order Object] → [allOrders: LocalStorage]
[allOrders: LocalStorage] → (read) → [Waiter Dashboard] → (status update) → [allOrders: LocalStorage]
[latestPlacedOrder: LocalStorage] → (read) → [Bill Page] → (render) → [Printed/PDF Receipt]
```

### 7.4 Use Case Diagram (Conceptual)
```
                     ┌───────────────┐
     Browse Menu ───▶│               │
     Add to Cart ───▶│   Customer    │
   Place Order   ───▶│               │
   View Bill     ───▶│               │
                     └───────────────┘

                     ┌───────────────┐
   View Orders   ───▶│               │
 Update Status   ───▶│    Waiter     │
                     │               │
                     └───────────────┘
```

### 7.5 Sequence Diagram (Conceptual) — Placing an Order
```
Customer -> MenuPage : Add item
MenuPage -> LocalStorage : saveCart()
Customer -> CartPage : Open cart
CartPage -> LocalStorage : getCart(), getSettings()
CartPage -> Customer : Show bill summary
Customer -> CartPage : Click "Place Order"
CartPage -> LocalStorage : write allOrders, latestPlacedOrder; clear cart
CartPage -> BillPage : redirect
BillPage -> LocalStorage : read latestPlacedOrder
BillPage -> Customer : Render receipt
WaiterDashboard -> LocalStorage : poll/listen allOrders
WaiterDashboard -> Waiter : Show new order + sound alert
```

### 7.6 ER Diagram (Conceptual)
Since there is no database, this represents the **shape of the JSON objects stored in LocalStorage**, which plays the conceptual role of an ER model here.

```
MenuItem                     Order
─────────                    ─────────────────
id (PK)                      id (PK)
name                         table
description                  items[] (→ MenuItem id, name, price, qty)
price                        instructions
veg (bool)                   couponCode
popular (bool)                subtotal, discount
chef (bool)                  cgst, sgst, serviceCharge, total
available (bool)             time
emoji                        status (preparing/ready/served)

CartLine                     RestaurantSettings
─────────                    ─────────────────
id (→ MenuItem id)           name, gstNumber
qty                          cgstRate, sgstRate
                             serviceChargeRate
                             coupons { code: amount }
```

---

## 8. MODULES

1. **Home / Table Detection Module** (`index.html`) — reads the QR table parameter, shows offers and category entry points.
2. **Menu Browsing Module** (`veg-*.html`, `nonveg-*.html`, `desserts.html`, `drinks.html`) — renders items per category from `MENU_DATA`.
3. **Cart Module** (`cart.html`, `js/cart.js`) — manages cart state, instructions, coupons, bill calculation, and order placement.
4. **Billing Module** (`bill.html`, `js/bill.js`) — renders the final printable receipt.
5. **Waiter Dashboard Module** (`waiter-dashboard.html`, `js/dashboard.js`) — live order queue, status management, sound alerts.
6. **Core/Shared Module** (`js/app.js`) — menu data, LocalStorage helpers, theme, toasts, shared render functions used by every page.
7. **Styling Module** (`css/style.css`) — the single design system (tokens, components, animations, responsiveness) shared by all pages.

---

## 9. WORKING — EXPLANATION OF EVERY FILE

### 9.1 HTML Pages
| File | Purpose |
|---|---|
| `index.html` | Landing page. Shows the logo, restaurant name, a simulated "QR scan" animation, the detected table number, today's offer banner, and the four entry tiles (Veg, Non-Veg, Drinks, Cart). |
| `veg-category.html` | A hub page linking to the three veg sub-categories (Starters, Main Course, Desserts). |
| `veg-starters.html` / `veg-main-course.html` / `desserts.html` | Each renders its category's items into `#itemList` using the shared `renderMenuItems()` function from `app.js`. |
| `nonveg-category.html` | Hub page linking to Non-Veg Starters and Main Course. |
| `nonveg-starters.html` / `nonveg-main-course.html` | Same pattern as the veg pages, for non-veg categories. |
| `drinks.html` | Renders the Drinks category. |
| `cart.html` | Shows cart items with quantity steppers, a cooking-instructions box, a coupon field, a live bill summary, and the "Place Order" button. |
| `bill.html` | Reads the most recently placed order and renders a receipt-styled, printable bill with Print and Download PDF buttons. |
| `waiter-dashboard.html` | Staff-only page listing every order, grouped by status (Preparing / Ready / Completed), with live stats and a sound alert for new orders. |

### 9.2 CSS — `css/style.css` (section by section)
1. **Fonts** — imports Fraunces (headings), Manrope (body) and JetBrains Mono (numbers/receipts) from Google Fonts, with system-font fallbacks so the app still looks good offline.
2. **Design Tokens** — CSS custom properties (`--color-accent`, `--radius-lg`, etc.) define the entire palette, spacing and motion timing in one place, and are re-mapped under `html[data-theme="dark"]` to power dark mode without duplicating any component CSS.
3. **Reset** — normalizes default browser spacing/typography and respects `prefers-reduced-motion` for accessibility.
4. **App Shell / Background** — the centred mobile-width column and soft blurred gradient "blobs" that the glassmorphism panels blur against.
5. **Topbar** — the sticky, frosted-glass header used on every page.
6. **Table Chip** — the dark pill showing the current table number, styled like a torn receipt tag (the project's visual signature).
7. **Glass Card / Card** — the two core surface styles: frosted-glass panels and solid elevated cards.
8. **Buttons** — primary/secondary/ghost button styles plus the floating cart button (`.fab`).
9. **Home Page** — hero text, offer banner, and the 2-column category tile grid.
10. **Bottom Navigation** — the frosted, sticky mobile nav bar with active-state highlighting.
11. **Food Item Cards** — the horizontal card layout used for every menu item, including veg/non-veg mark, badges, price, and the add/stepper controls.
12. **Cart Page** — cart line styling, instructions/coupon boxes, and the live bill summary rows.
13. **Bill/Receipt** — the perforated "ticket" receipt design with a scalloped top edge and barcode-style footer, built for both screen and print.
14. **Waiter Dashboard** — stat cards, status tabs, and order cards with status pills.
15. **Toasts** — the notification pop-ups shown after every user action.
16. **Loader** — the brief branded loading overlay shown on page entry.
17. **Footer** — the small branding footer at the bottom of every page.
18. **QR Scan Splash** — the animated "scanning" box on the home page.
19. **Animations** — all `@keyframes` (scan line, pulse, toast slide-in, fade-up, shake) used throughout the app.
20. **Responsive Rules** — desktop centring, print stylesheet (hides nav/buttons when printing the bill), and breakpoints.

### 9.3 JavaScript — Explanation of Every Function

#### `js/app.js` (core module, loaded on every page)
| Function | What it does |
|---|---|
| `$()`, `$$()` | Shorthand wrappers around `querySelector` / `querySelectorAll`. |
| `formatCurrency(amount)` | Formats a number as `₹1,234.50` using `toLocaleString`. |
| `qs(name)` | Reads a query-string parameter from the current URL. |
| `getStorage(key, fallback)` / `setStorage(key, value)` | Safely read/write JSON data to LocalStorage, catching any parsing errors. |
| `getSettings()` | Returns restaurant settings (GST rates, service charge, coupons), seeding sensible defaults the first time the app runs. |
| `initTable()` / `getCurrentTable()` | Reads `?table=` from the URL (if present) and saves it; otherwise returns the previously saved or default table number. |
| `getAllItems()` / `findItemById(id)` | Flatten/search the static `MENU_DATA` object. |
| `getCart()` / `saveCart()` | Read/write the cart array (`[{id, qty}]`) to LocalStorage. |
| `addToCart(id, qty)` | Adds an item (or increases its quantity) and shows a toast. |
| `updateCartQty(id, delta)` | Increases/decreases a line's quantity; removes the line if it hits zero. |
| `removeFromCart(id)` | Deletes a line entirely. |
| `clearCart()` | Empties the cart. |
| `getCartCount()` | Total number of items (for badges). |
| `getCartDetailed()` | Joins the raw cart with full menu item data (name, price, etc.) for display. |
| `getCartSubtotal()` | Sums `price × qty` across the cart. |
| `updateCartBadge()` | Refreshes every `.cart-count-badge` element on the page. |
| `getFavorites()` / `isFavorite()` / `toggleFavorite()` | Manage the favorited-item id list. |
| `initTheme()` / `toggleTheme()` / `updateThemeIcon()` | Read/apply/save the light or dark theme. |
| `toast(message, type, icon)` | Creates and auto-dismisses a toast notification. |
| `badgesHTML(item)` | Builds the Popular/Chef Special/Sold Out badge markup for one item. |
| `foodCardHTML(item)` | Builds the full HTML markup for one menu item card, including the correct Add button or quantity stepper depending on cart state. |
| `renderMenuItems(containerSelector, categoryKey)` | Renders every item of a category into a page and wires up click handling. |
| `handleMenuContainerClick(e)` | A single delegated click handler covering Add, +, −, and favorite-heart clicks for an entire list. |
| `rerenderCard(container, id)` | Redraws just one card after a cart change (instead of the whole list, for performance). |
| `initLoader()` | Fades out the loading overlay shortly after the page finishes loading. |
| `initBottomNav()` | Highlights the correct bottom-nav icon using each page's `data-nav` attribute. |
| `initThemeToggle()` | Wires up all `.theme-toggle` buttons. |
| `initTableChip()` | Fills every `.js-table-number` element with the current table number. |
| `initApp()` | The single boot function every page calls on `DOMContentLoaded`, tying all of the above together. |

#### `js/cart.js` (cart.html only)
| Function | What it does |
|---|---|
| `renderCartPage()` | Draws the cart list or the empty-state message. |
| `computeBill()` | Calculates subtotal, discount, CGST, SGST, service charge and total. |
| `renderBillSummary()` | Paints the live bill summary card and enables/disables "Place Order". |
| `applyCoupon()` | Validates a typed coupon code against `restaurantSettings.coupons`. |
| `bindInstructions()` | Loads/saves the cooking-instructions textarea to LocalStorage as the user types. |
| `generateOrderId()` | Creates a short random order ID like `SD-4821`. |
| `placeOrder()` | Builds the order object, saves it to `allOrders` and `latestPlacedOrder`, clears the cart, and redirects to `bill.html`. |
| `initCartPage()` | Wires up all cart page buttons and renders the initial state. |

#### `js/bill.js` (bill.html only)
| Function | What it does |
|---|---|
| `generateBillNumber(order)` | Builds a bill number like `BILL/260804/4821` from the order's date and id. |
| `renderBill()` | Reads `latestPlacedOrder` and renders the full receipt markup (or an empty state if no order exists yet). |
| `initBillPage()` | Wires up the Print and Download PDF buttons. |

#### `js/dashboard.js` (waiter-dashboard.html only)
| Function | What it does |
|---|---|
| `playNotificationSound()` | Generates a two-tone "ding" using the Web Audio API — no external audio file required. |
| `getOrders()` / `saveOrders()` | Read/write the `allOrders` array. |
| `advanceOrderStatus(orderId)` | Moves an order from Preparing → Ready → Served. |
| `timeAgo(isoString)` | Converts a timestamp into a "X mins ago" style string. |
| `orderCardHTML(order)` | Builds one order card's markup, including the correct action button for its current status. |
| `renderStats(orders)` | Updates the Preparing/Ready/Served counters. |
| `renderDashboard()` | Redraws the order list for the active tab and triggers the sound alert if a new order has arrived since the last render. |
| `switchTab(tab)` | Switches between the Preparing / Ready / Completed tabs. |
| `initDashboard()` | Sets the initial order-count baseline, renders the dashboard, and wires up tab clicks, status-button clicks, the cross-tab `storage` event listener, and a polling fallback. |

---

## 10. LOCALSTORAGE EXPLAINED

LocalStorage is a small, built-in key–value database inside every web browser. Data saved to it:
- Persists even after the browser tab or the whole browser is closed and reopened.
- Is only readable by pages served from the same **origin** (protocol + domain + port) — which is why the project should be run through Live Server rather than opened as a bare file.
- Can only store strings, which is why this project always converts JavaScript objects/arrays to JSON text with `JSON.stringify()` before saving, and parses them back with `JSON.parse()` when reading (handled centrally by `getStorage()` / `setStorage()` in `app.js`).

**Keys used by Scan & Dine:**
| Key | Holds |
|---|---|
| `currentTable` | The active table number, e.g. `"05"`. |
| `cart` | The current cart, as `[{id, qty}, ...]`. |
| `latestPlacedOrder` | The most recently placed order object (read by `bill.html`). |
| `allOrders` | Every order ever placed in this browser, with a live `status` field (read/written by the Waiter Dashboard). |
| `restaurantSettings` | GST rates, service charge rate, GST number, and available coupon codes. |
| `theme` | `"light"` or `"dark"`. |
| `favoriteItems` | Array of favorited menu item ids. |
| `cookingInstructions` | The customer's free-text cooking notes for the current cart. |
| `appliedCoupon` | The currently applied coupon code, if any. |

---

## 11. DATA FLOW, QR FLOW, CART FLOW, DASHBOARD FLOW, BILL FLOW

- **QR Code Flow:** The QR code printed on a table encodes a URL like `index.html?table=05`. Scanning it simply opens that URL in the phone's browser. `initTable()` in `app.js` reads the `table` query parameter with `qs('table')` and saves it to LocalStorage, so every page loaded afterwards (even without the query string) still knows which table the session belongs to.
- **Cart Flow:** Adding an item calls `addToCart()`, which reads the existing cart array, increases the matching line's quantity (or pushes a new line), and saves it back with `saveCart()`. Every page that shows a cart badge listens to this through `updateCartBadge()`.
- **Data Flow (Order placement):** `cart.html` reads the cart via `getCartDetailed()`, computes GST/service charge/coupon totals with `computeBill()`, and on "Place Order" bundles everything into one order object which is pushed into `allOrders` (history for the dashboard) and also saved as `latestPlacedOrder` (used by the bill page). The cart, instructions and coupon are then reset.
- **Waiter Dashboard Flow:** The dashboard reads `allOrders` on load and re-renders whenever the browser's native `storage` event fires (which happens automatically when another tab changes LocalStorage) or every 4 seconds via a polling fallback. Clicking a status button calls `advanceOrderStatus()`, which mutates that order's `status` field and saves the array back.
- **Bill Flow:** `bill.html` simply reads `latestPlacedOrder` and renders it inside a receipt-styled card. The Print button calls the browser's native `window.print()`; Download PDF does the same, since every modern browser's print dialog offers "Save as PDF" as a destination — this avoids needing any external PDF-generation library.

---

## 12. TESTING

| Test Case | Steps | Expected Result | Status |
|---|---|---|---|
| Table detection | Open `index.html?table=07` | Table chip shows "07" on every page | ✅ Pass |
| Add to cart | Click "+ Add" on any item | Item appears in cart, badge count increases, toast shown | ✅ Pass |
| Quantity stepper | Click + / − on a cart item | Quantity updates live, bill recalculates | ✅ Pass |
| Remove item | Click ✕ on a cart line | Item removed, toast shown | ✅ Pass |
| Clear cart | Click "Clear Cart" with items present | Cart becomes empty, empty-state shown | ✅ Pass |
| Valid coupon | Enter `SND10`, click Apply | Discount applied, bill total drops | ✅ Pass |
| Invalid coupon | Enter `ABC123`, click Apply | Error toast shown, input shakes | ✅ Pass |
| GST calculation | Add items worth ₹500 | CGST/SGST/Service Charge computed at configured % | ✅ Pass |
| Place order (empty cart) | Click "Place Order" with 0 items | Button disabled / error toast, no order created | ✅ Pass |
| Place order (valid) | Add items, click "Place Order" | Redirects to bill.html showing correct totals | ✅ Pass |
| Waiter Dashboard sync | Place an order, open dashboard in second tab | New order appears with sound + toast alert | ✅ Pass |
| Status transition | Click "Mark Ready" then "Mark as Served" | Order moves through tabs correctly | ✅ Pass |
| Dark mode toggle | Click moon/sun icon | Theme switches and persists after reload | ✅ Pass |
| Print bill | Click "Print" on bill page | Browser print dialog opens with receipt only (no nav/buttons) | ✅ Pass |
| Responsive layout | Resize/view on mobile width | Layout adapts, bottom nav and cards remain usable | ✅ Pass |

---

## 13. ADVANTAGES

- Zero server cost — can be hosted for free on any static file host, or run locally.
- Instant setup — no database migrations, no environment variables, no build step.
- Fast and works offline once loaded, since there are no network round-trips for core functionality.
- Clean separation of concerns (data in `app.js`, page-specific logic in dedicated files) makes the code easy to read, extend and grade.
- Demonstrates real-world UI/UX patterns (glassmorphism, toasts, skeleton loaders, dark mode) suitable for a portfolio.

## 14. LIMITATIONS

- Orders are only visible within the **same physical browser** — LocalStorage is not shared across different devices, so the Waiter Dashboard must be opened in another tab of the same browser for this demo to show live sync.
- No authentication — anyone with the URL can view/act as a waiter.
- No real payment processing.
- Menu data is hardcoded in `app.js` rather than editable through an admin UI.
- Clearing browser data/cache will erase all orders and cart history.

## 15. FUTURE SCOPE

See the **Future Scope** section of `README.md` for the full list, including a real backend for multi-device sync, payment gateway integration, an admin panel, and push notifications.

---

## 16. CONCLUSION

Scan & Dine successfully demonstrates that a complete, realistic restaurant ordering experience — from QR-based table detection through menu browsing, cart management, GST-compliant billing, and a live kitchen/waiter dashboard — can be implemented using only HTML, CSS and vanilla JavaScript, with the browser's LocalStorage acting as the sole data layer. The project reinforces core front-end concepts such as DOM manipulation, event delegation, client-side state persistence, and responsive, accessible UI design, while producing a polished, professional interface suitable for a college submission or a personal portfolio piece.

---

## 17. REFERENCES

1. MDN Web Docs — Window.localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
2. MDN Web Docs — Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
3. MDN Web Docs — CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
4. Google Fonts: https://fonts.google.com
5. W3C — HTML5 Specification: https://www.w3.org/TR/html52/
6. GST Council of India — GST Rate Structure (for CGST/SGST reference): https://www.gst.gov.in
