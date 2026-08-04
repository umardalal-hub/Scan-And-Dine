# 🍽️ Scan & Dine

**Tagline:** Scan • Order • Dine

Scan & Dine is a **QR-code based restaurant ordering system** that runs entirely in the browser. A customer scans a QR code stuck on their table, the app detects the table number from the URL, and from there they can browse the menu, add items to a cart, apply a coupon, place an order and generate a bill — all without a waiter, a backend server, or an internet connection after the first load. A second screen, the **Waiter Dashboard**, shows incoming orders live so kitchen staff know exactly what to prepare and for which table.

This project was built as a **college mini/major project** to demonstrate front-end web development, client-side state management, and UX/UI design skills using only HTML, CSS and JavaScript.

---

## ✨ Features

### Customer side
- 📷 **QR-code table detection** — opening `index.html?table=05` automatically remembers "Table 05" for the whole session.
- 🥦 **Full menu** across 6 categories: Veg Starters, Veg Main Course, Desserts, Non-Veg Starters, Non-Veg Main Course, Drinks.
- 🏷️ Each item shows an **image (emoji-illustration)**, name, description, price, **Veg/Non-Veg mark**, **Popular** and **Chef's Special** badges, and availability (Sold Out state).
- ❤️ **Favorites** — tap the heart icon on any dish.
- 🛒 **Smart cart** — add, increase/decrease quantity, remove single items, or clear the whole cart.
- 📝 **Cooking instructions** box (e.g. "less spicy, no onion").
- 🎟️ **Coupon codes** (demo codes `SND10` and `WELCOME50`) with live discount preview.
- 🧾 **Automatic bill calculation** — subtotal, discount, CGST, SGST and service charge, all configurable.
- 🧾 **Printable bill / receipt page** with a "Download PDF" option (uses the browser's native print-to-PDF, so no extra library is needed).
- 🌗 **Dark mode** toggle, remembered across visits.
- 🔔 **Toast notifications** for every action (added to cart, coupon applied, order placed, etc).
- 📱 **Mobile-first, fully responsive**, Apple-inspired **glassmorphism** UI with smooth animations.

### Waiter side
- 🧑‍🍳 **Waiter Dashboard** listing every incoming order in real time (polls Local Storage + listens for cross-tab updates).
- 🔔 **Sound notification** (generated with the Web Audio API — no audio file needed) when a new order arrives.
- 📊 Live stats: orders **Preparing**, **Ready**, **Served**.
- ➡️ One-tap **status transitions**: Preparing → Ready → Served.
- 📜 **Completed Orders** section for a history of served orders.

---

## 🛠️ Technology Used

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (Custom Properties / Variables, Flexbox, Grid, Glassmorphism, Animations) |
| Logic | Vanilla JavaScript (ES6+, no frameworks) |
| Data storage | Browser `localStorage` — **no backend, no database, no Node.js, no PHP, no Firebase** |
| Fonts | Google Fonts — *Fraunces*, *Manrope*, *JetBrains Mono* (falls back to system fonts offline) |

Everything runs **100% client-side**. There is nothing to install, deploy, or configure on a server.

---

## 📁 Folder Structure

```
Scan-And-Dine/
│
├── index.html                 → Home page (QR landing, categories, offers)
├── veg-category.html          → Veg category hub
├── veg-starters.html          → Veg Starters menu
├── veg-main-course.html       → Veg Main Course menu
├── desserts.html              → Desserts menu
├── nonveg-category.html       → Non-Veg category hub
├── nonveg-starters.html       → Non-Veg Starters menu
├── nonveg-main-course.html    → Non-Veg Main Course menu
├── drinks.html                → Drinks & Beverages menu
├── cart.html                  → Cart, coupon, GST bill preview, place order
├── bill.html                  → Final printable receipt
├── waiter-dashboard.html      → Waiter/staff order queue
│
├── css/
│   └── style.css              → Single external stylesheet (design tokens, components, animations)
│
├── js/
│   ├── app.js                 → Core module: menu data, storage helpers, cart, theme, toasts
│   ├── cart.js                → Cart page logic (bill maths, coupon, place order)
│   ├── bill.js                → Bill page logic (receipt rendering, print/PDF)
│   └── dashboard.js           → Waiter Dashboard logic (orders, sound, status)
│
├── assets/
│   ├── images/logo.png        → App logo
│   └── icons/                 → Reserved for future icon assets
│
├── README.md                  → This file
├── PROJECT_REPORT.md          → Full college project documentation
└── VIVA.md                    → 30 viva questions with answers
```

---

## 🚀 Installation & How to Run

You do **not** need Node.js, npm, or any server-side software. You only need a code editor and a browser.

### Step 1 — Install Visual Studio Code
1. Download VS Code from [https://code.visualstudio.com](https://code.visualstudio.com).
2. Run the installer and follow the on-screen steps (accept defaults).
3. Launch VS Code once installation finishes.

### Step 2 — Install the "Live Server" extension
1. In VS Code, click the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X`).
2. Search for **"Live Server"** by *Ritwick Dey*.
3. Click **Install**.

> **Why Live Server is required:** Opening `index.html` by double-clicking it loads the page using the `file://` protocol. Modern browsers block certain JavaScript features (like `fetch`, some LocalStorage edge cases, and query-string based routing in strict setups) under `file://` for security reasons. Live Server instead serves the project over `http://localhost:5500`, which behaves exactly like a real website and avoids these browser security restrictions — this is the same reason almost every web project is "run locally" through a lightweight local server rather than opened directly as a file.

### Step 3 — Open the project
1. In VS Code, go to **File → Open Folder…**
2. Select the `Scan-And-Dine` folder.

### Step 4 — Run the project
1. In the file explorer, right-click `index.html`.
2. Select **"Open with Live Server"**.
3. Your default browser will open automatically at a URL like:
   ```
   http://127.0.0.1:5500/index.html
   ```
4. To simulate scanning a QR code for **Table 5**, change the URL to:
   ```
   http://127.0.0.1:5500/index.html?table=05
   ```
5. To view the **Waiter Dashboard**, open a second browser tab at:
   ```
   http://127.0.0.1:5500/waiter-dashboard.html
   ```
   Place an order from the first tab and watch it appear (with a sound alert) on the dashboard tab.

### `file://` vs `http://localhost` — what's the difference?
| | `file://...index.html` | `http://localhost:5500` |
|---|---|---|
| How it loads | Directly from disk | Served by a lightweight local web server |
| Browser security | Very restrictive — many web APIs are blocked or behave inconsistently | Same rules a real deployed website would follow |
| LocalStorage | Works, but tied to the file path in some browsers, so results can look inconsistent | Reliable — behaves like production |
| Recommended for this project | ❌ Not recommended | ✅ Recommended |

### A note on browser security & LocalStorage
Browsers isolate LocalStorage **per origin** (a combination of protocol + domain + port). Serving the project via `http://localhost:5500` gives it a single, stable origin, so all pages of Scan & Dine reliably share the same cart, table number, and orders. LocalStorage itself simply stores text (we store JSON strings) in the browser, persists after the tab is closed, and is only ever readable by pages from that same origin — which is exactly why no backend or database is required for a project like this.

---

## 🔭 Future Scope

- Real QR code image generation per table (currently the QR scan is simulated visually; the URL parameter already does the real detection work).
- Optional lightweight backend (Node.js/Express or Firebase) to sync orders across multiple physical devices instead of one browser's LocalStorage.
- Online payment gateway integration (Razorpay/Stripe) at checkout.
- Multi-language menu support.
- Admin panel to add/edit/remove menu items instead of hardcoding them in `app.js`.
- Push notifications to the customer when their order status changes.
- Analytics dashboard for the restaurant owner (best-selling items, peak hours, etc).

---

## 📸 Screenshots

*(Add screenshots of Home, Menu, Cart, Bill and Waiter Dashboard pages here before submission.)*

- `Home Page` — ![screenshot placeholder](assets/images/screenshot-home.png)
- `Menu Page` — ![screenshot placeholder](assets/images/screenshot-menu.png)
- `Cart Page` — ![screenshot placeholder](assets/images/screenshot-cart.png)
- `Bill Page` — ![screenshot placeholder](assets/images/screenshot-bill.png)
- `Waiter Dashboard` — ![screenshot placeholder](assets/images/screenshot-dashboard.png)

---

## 📄 License

This project is released under the **MIT License**. You are free to use, copy, modify and distribute it for educational and personal purposes, with attribution appreciated.

```
MIT License — Copyright (c) 2026 Scan & Dine Project
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, subject
to the inclusion of the above copyright notice in all copies.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```
