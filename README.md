# Tayyab Shahzad Jewellers — Storefront & Owner Demo

React 19, React Router, Vite 8, Tailwind CSS 4 and TypeScript. The existing dark photographic homepage hero and supplied product/logo files are preserved. The interface uses shared charcoal, warm beige, ivory and antique-gold tokens in `src/index.css`.

## Run locally

Use Node 22.12+ or Node 24 LTS, and npm. From the folder containing `package.json`:

```sh
npm install
npm run dev
```

Open the Local URL shown by Vite (normally http://localhost:3000). The compatible esbuild dependency and npm lockfile are included, so `--legacy-peer-deps` is no longer needed. If your Windows C: drive is full, use `npm install --cache D:\npm-cache` on a drive with free space.

```sh
npm test
npm run lint
npm run build
npm run preview
```

`npm test` runs the original utilities and the added order/stock/payment/permission tests. For hosting, serve `dist` with an SPA fallback to `index.html`; deep links such as `/admin/login` and `/order-confirmation/:reference` need that fallback. No deployment has been performed.

## Access and roles — demo only

Open `/admin/login` and select **Owner demo**. There are no frontend passwords or hardcoded client credentials. The Email/Password form is a visual integration point: it validates inputs and reports sign-in unavailable; it does not send or save credentials. No password-reset link is shown because no reset provider exists.

- **Owner demo:** all eight management modules and record changes.
- **Staff demo:** overview only, explicitly read-only. Administrative mutations also check the role at the demo service layer.
- **Storefront visitor:** guest browsing and simulated checkout, no customer accounts.
- Sessions expire after one hour and use sessionStorage. Logout removes the session. Direct admin routes redirect to login; validated return destinations remain inside the admin routes.
- `/admin-demo` and `/admin-demo/login` redirect to the updated routes.

These are presentation permissions, not secure authentication. Browser storage and frontend guards can be edited by anyone with access to that browser. Never enter real client credentials or real customer/payment information. All supplied names, orders, prices and rates are sample/demo data. Demo storage remains under `tsj_demo_*` keys and is not connected to a live store.

## Management modules

- **Overview:** period-filtered booked sales, open orders, outstanding balances, low stock; one record-derived chart, recent orders and an attention list. No invented growth/profit figures. Periods are displayed; outstanding balances and operational queues include all open records.
- **Orders:** search, independent payment/fulfilment filters, date/value sort, pagination; purchased-item snapshots, address, payments, notes and recorded status history; fulfilment updates, simulated verified payments and print/save-PDF invoice.
- **Products & Inventory:** create/edit; unique SKU; collections and category; multiple existing product images with primary selection; metal/purity; grams for gross/stone/net weights; variants; fixed or metal-rate pricing, making/stone charges; whole-piece stock and thresholds; draft/active/archived states. Negative/inconsistent values are rejected. Existing images are not altered.
- **Custom Orders:** table and optional board; create/edit, design/reference details, size, estimated/actual weight, quote/deposit/balance, artisan and promised date; production notes and newly recorded stage/deposit history. Existing samples do not invent past events. Storefront custom requests also appear as New Request records.
- **Customers:** sample contact details, preferences and notes, recorded order history and calculated balances; new demo checkout customers are included.
- **Gold Rates:** manually entered PKR rates per tola, purity, source and updated time; estimator and karat calculation. Rates are never described as a live feed. New metal-rate prices use configured rates; agreed order snapshots do not change.
- **Reports:** date-filtered orders/sales, custom orders, inventory by product creation date; working CSV export. Inventory is current stock, not historical stock valuation. CSV formula-like text is escaped.
- **Settings:** store/contact information, delivery fee, tax, discount, optional delivery estimate, postal requirement, COD city/amount eligibility and optional bank-transfer instructions; local JSON backup/import/reset. No API/payment secrets are configured here.

Cancelled orders retain their financial history. Cancellation does not automatically refund money or restock pieces: review stock separately in this demo. Unknown historical order images show an explicit unavailable-image placeholder; no unrelated jewellery design is substituted.

## Checkout and confirmation

1. Open a product, select variants and add it to the enquiry bag.
2. Open `/bag` and choose **Continue to demo checkout**. The existing quotation-request flow remains available.
3. Enter sample customer/delivery details. Pakistani local (`03XXXXXXXXX`) and `+92` phone formats are accepted. Email is optional; no email service is connected. Draft details survive errors within the session.
4. COD is enabled in the initial sample configuration; the Owner can set city/amount limits or disable it. Bank transfer appears only when enabled with configured instructions. No invented bank details are supplied. There is no card provider or raw card collection.
5. Review images, variants, purity/weight, line totals, configured delivery/tax/discount and final PKR total. A changed price or stock level requires review before submission.
6. Place a simulated order. A unique reference and order-time snapshot are saved with a stock update in one localStorage ledger write. The cart is cleared after a successful order commit. Repeat clicks/retries with the same submission key return the same order; confirmation refresh never creates an order.
7. Confirmation and `/order-status/:reference` show that exact saved record. Unknown references do not fall back to another customer’s order. Item details and agreed prices remain unchanged after catalogue/rate edits. Bank-transfer references remain unverified until the Owner records a simulated verified payment. COD states remain payment due on delivery.

Print / Save Invoice PDF uses the browser print dialog. It is a demo invoice, not proof of real payment. No email, WhatsApp notification, courier booking, dispatch progress or tracking number is fabricated. The assistant is hidden during checkout/confirmation so floating controls do not cover fields or order details.

## Provisioning a real client Owner account

**No real Owner account has been provisioned.** There is no existing authentication provider, API server, persistent database or payment integration in the supplied project. Do not deploy the browser demo as a production order system.

Before real use, implement and verify these backend requirements:

1. Connect a server-side authentication provider and database. Create/invite the client's own email through that provider's supported account flow, after the client authorises the invitation. Assign Owner in a server-controlled role table; never accept roles supplied by the browser.
2. Replace demo sessions with provider sessions and server-checked permissions for every administrative operation. Define granular staff grants. Add provider password reset, session expiry/revocation, supported rate limiting and server audit logs.
3. Store catalogue, customers, orders, order-item snapshots, payment history, custom jobs and inventory in the database. Place orders in a server transaction with stock locks and unique idempotency keys. Recalculate prices, eligibility, delivery, discounts and tax on the server; prevent cross-tab/concurrent overselling.
4. Protect guest orders using a secure, scoped guest-access mechanism, or authenticated customer access. A visible order reference alone is not sufficient authorisation. Local demo references provide no confidentiality.
5. Configure actual bank instructions/COD rules with the owner. For online cards, use a hosted/tokenised provider and verify signed server-side payment events. Protect webhook idempotency; test payment success, pending and failure flows before enabling them.
6. Connect email/WhatsApp/courier services only if required and authorised. Display confirmation, shipment estimates and tracking only when those services verify them. Keep secrets solely in protected server environment variables.
7. Replace sample records and editorial demo artwork with approved client content and verify backups, privacy/access controls and fulfilment policies. The dark-stone hero is the prior editorial AI adaptation of supplied demo imagery, not proof of an actual stocked product. Obtain approved product photography before launch.

No emails, invitations, credentials, external orders or payments were sent during this implementation.

## Verification and limits

The implementation was checked with Chromium on desktop and mobile, including 320, 375, 390, 430, 768, 1024 and 1440px. Storefront hero, login, all admin modules, checkout and confirmation were inspected for layout overflow; tables scroll within their own containers. The browser connection could not reach the local dev server, so isolated local Playwright/Chromium was used.

Automated utility/domain tests cover phone/redirect validation, Owner/Staff mutation guards and expiry, weight validation, metal/making/stone price calculations, tax/delivery/discount totals, order snapshots, duplicate retry, aggregate variant stock, price-change rejection, failed storage commit, and bank-transfer verification. Browser flows exercise form validation, product create/edit/persistence/multiple images, custom-stage updates, order notes/fulfilment/payment records, rate changes, report date filters/CSV downloads, settings, logout and Staff restrictions.

Real authentication, server authorisation, payment-provider outcomes, external notifications, concurrency across browsers, courier fulfilment and production deployment are not implemented or verified. Browser-only persistence is local to that browser and may be cleared or lost. The existing private-demo `noindex, nofollow` metadata is preserved.
