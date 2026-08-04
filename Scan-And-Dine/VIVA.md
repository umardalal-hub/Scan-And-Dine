# Scan & Dine — 30 Viva Questions & Answers

**1. What is Scan & Dine?**
A QR-code based restaurant ordering system that lets customers browse a menu, place orders, and generate a bill directly from their table, built entirely with HTML, CSS and JavaScript with no backend.

**2. Why doesn't this project use a backend or database?**
The goal was to demonstrate that a complete, realistic ordering flow can be built purely on the front end using the browser's LocalStorage as the data layer, keeping the project simple, free to host, and fast to set up — while still teaching the core concepts (data modelling, CRUD-like operations, state management) that a real backend would eventually need.

**3. How does the app know which table a customer is sitting at?**
The QR code on the table encodes a URL like `index.html?table=05`. When that page loads, JavaScript reads the `table` value from the URL's query string using `URLSearchParams` and saves it to LocalStorage, so every other page in the session can look it up.

**4. What is LocalStorage?**
A key–value storage API built into web browsers that lets a website save small amounts of text data (up to ~5–10MB) that persists even after the browser is closed, scoped to the site's origin.

**5. Why must values be converted with `JSON.stringify()` before saving to LocalStorage?**
Because LocalStorage can only store strings. Objects and arrays (like the cart or an order) are converted to a JSON string with `JSON.stringify()` before saving, and parsed back into JavaScript objects with `JSON.parse()` when read.

**6. What data does the `cart` key store?**
An array of small objects like `[{id: "vs1", qty: 2}]`, storing only the item's id and quantity — the actual name/price is always looked up fresh from `MENU_DATA` so the cart never goes stale if a price changes.

**7. What is the difference between `localStorage` and `sessionStorage`?**
`localStorage` persists indefinitely until explicitly cleared, while `sessionStorage` is cleared automatically when the browser tab is closed. Scan & Dine uses `localStorage` so a customer's table/cart survives even if they briefly close and reopen the browser.

**8. How is the bill total calculated?**
`computeBill()` in `cart.js` takes the cart subtotal, subtracts any coupon discount to get a taxable amount, then adds CGST and SGST (each a configurable percentage) plus a service charge percentage, all defined in `restaurantSettings`.

**9. What are CGST and SGST?**
Central GST and State GST — under India's GST system, an intra-state sale splits the total GST rate equally between the central and state governments, so both are shown separately on the bill.

**10. How does the Waiter Dashboard know a new order has arrived?**
It reads the `allOrders` key from LocalStorage on load, then re-renders whenever the browser's `storage` event fires (which happens automatically when another tab writes to LocalStorage) and also on a 4-second polling interval as a fallback, comparing the new order count to the last known count to decide whether to play a sound.

**11. How is the notification sound generated without an audio file?**
Using the Web Audio API — `dashboard.js` creates two short sine-wave oscillator tones programmatically (`playNotificationSound()`), so no `.mp3`/`.wav` asset needs to be shipped with the project.

**12. What are the three statuses an order can have?**
`preparing`, `ready`, and `served`. The waiter advances an order through these stages using the "Mark Ready" / "Mark as Served" buttons, which call `advanceOrderStatus()`.

**13. Why is the cart stored separately from the order?**
The cart represents an in-progress selection that can still change; an order is a frozen snapshot created only once "Place Order" is clicked. Keeping them separate means editing the cart never affects a bill that has already been generated.

**14. What happens to the cart after an order is placed?**
`placeOrder()` in `cart.js` calls `clearCart()` and resets the cooking-instructions and coupon keys, so the customer starts fresh for any next round of ordering.

**15. How does the coupon system work?**
Valid coupon codes and their flat rupee discount are stored in `restaurantSettings.coupons` (e.g. `{"SND10": 10}`). `applyCoupon()` checks the typed code against this object, and if valid, saves it under the `appliedCoupon` key so `computeBill()` can subtract it from the subtotal.

**16. How is the "Download PDF" feature implemented without a PDF library?**
It calls the browser's native `window.print()`, and the print dialog's own "Save as PDF" destination option is used to produce a PDF — this avoids adding an external JavaScript library and keeps the app fully offline-capable.

**17. How is dark mode implemented?**
By toggling a `data-theme="dark"` attribute on the `<html>` element. CSS custom properties are redefined inside an `html[data-theme="dark"]` selector, so every component that already uses `var(--bg)`, `var(--ink)`, etc. automatically re-themes without needing separate dark-mode CSS classes for each component.

**18. Why use CSS variables (custom properties) instead of hardcoded colors?**
They centralize the design system in one place, make dark mode possible with a single attribute toggle, and make the whole UI easy to re-theme or maintain consistently.

**19. What is glassmorphism, and where is it used in this project?**
A UI style using translucent, blurred "frosted glass" panels over a colourful background. It's applied via the `.glass` class and the topbar/bottom-nav, using `backdrop-filter: blur()` combined with a semi-transparent background color.

**20. What is event delegation, and where is it used?**
Instead of attaching a click listener to every single button (which would be expensive and break after re-rendering), one listener is attached to a parent container, and `e.target.closest()` is used to figure out which child was actually clicked. This is used in `handleMenuContainerClick()` so Add/stepper/favorite buttons all work correctly even after cards are redrawn.

**21. Why is a single external CSS file used instead of separate files per page?**
The project brief required one shared, reusable design system so styles stay consistent across every page and there's no duplicated or conflicting CSS between pages.

**22. What does "mobile-first" design mean?**
Designing and writing CSS for the smallest screen size first, then adding rules (via `@media (min-width: ...)`) to enhance the layout for larger screens — rather than the reverse. Scan & Dine's default styles target a phone-width column, then adapt for tablets/desktop.

**23. Why is Live Server recommended instead of opening `index.html` directly?**
Opening a file directly uses the `file://` protocol, which browsers treat with extra security restrictions and can behave inconsistently with LocalStorage and query-string based routing. Live Server serves the project over `http://localhost`, matching how a real deployed website behaves.

**24. What is the purpose of the `data-nav` attribute on the `<body>` tag?**
It tells `initBottomNav()` in `app.js` which bottom-navigation icon should be highlighted as "active" on that page, including for sub-pages like `veg-starters.html` that should still highlight the "Veg" tab.

**25. How does the app avoid writing duplicate HTML for six nearly-identical menu pages?**
All six category pages share the exact same markup structure and simply call `renderMenuItems('#itemList', '<categoryKey>')` with a different category key, so all the actual rendering logic lives once in `app.js`.

**26. What happens if a menu item is marked `available: false`?**
`foodCardHTML()` shows a disabled "Sold Out" button instead of the Add button, and `badgesHTML()` adds a "Sold Out" badge, so customers can see the item but cannot add it to the cart.

**27. How would you extend this project to support multiple restaurants or tables syncing across different physical devices?**
By replacing the LocalStorage calls with API calls to a real backend (e.g. Node.js + a database, or Firebase), while keeping almost all of the front-end rendering logic (in `app.js`, `cart.js`, `bill.js`, `dashboard.js`) unchanged, since it already treats storage access through a small set of central functions.

**28. What security limitation does this project have?**
Because there is no login/authentication and all data lives in LocalStorage, anyone with access to the same browser (or the dashboard URL) can view or modify order data; this is acceptable for a demo/college project but would need proper authentication and a real backend for production use.

**29. How is responsiveness tested in this project?**
By resizing the browser window / using browser dev-tools device emulation to confirm the layout (grid columns, bottom nav, cards) adapts correctly from mobile widths up to desktop widths defined by the CSS media queries.

**30. What did you learn from building this project?**
Practical experience in structuring a multi-page vanilla JavaScript application, using LocalStorage as a lightweight data layer, applying a consistent design system with CSS custom properties, implementing common UX patterns (toasts, loaders, dark mode, glassmorphism), and thinking through a full product flow from a customer's QR scan to a waiter's kitchen dashboard and a final GST-compliant bill.
