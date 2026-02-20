# Wolfe Productions — Invoice Generator
## Setup & Deployment Guide

---

### What this does
When you click **Generate Invoice**, it automatically:
1. Calls a Netlify serverless function with the invoice total
2. Creates a real Stripe Payment Link via the Stripe API
3. Generates a QR code on the invoice pointing to that link
4. Customer scans → Stripe checkout → Apple Pay available

---

### Step 1 — Get your Stripe Secret Key
1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to **Developers → API Keys**
3. Copy your **Secret key** (starts with `sk_live_...`)
   - Use `sk_test_...` first to test without real charges

---

### Step 2 — Deploy to Netlify

#### Option A — Drag & drop (easiest, no Git needed)
1. Go to [netlify.com](https://netlify.com) and sign up / log in
2. From your dashboard click **"Add new site" → "Deploy manually"**
3. Drag the entire `wolfe-invoice` folder onto the page
4. Netlify will deploy it instantly and give you a URL

#### Option B — GitHub (recommended for updates)
1. Create a new repo on GitHub, upload this folder
2. In Netlify: **"Add new site" → "Import from Git"**
3. Select your repo — Netlify auto-detects the `netlify.toml`

---

### Step 3 — Add your Stripe Secret Key as an environment variable
This keeps your key secure — never put it directly in code.

1. In Netlify, go to your site → **Site configuration → Environment variables**
2. Click **"Add a variable"**
3. Set:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_live_your_key_here` (or `sk_test_...` for testing)
4. Click Save
5. **Redeploy** the site (Deploys → Trigger deploy → Deploy site)

---

### Step 4 — Test it
1. Open your Netlify URL
2. Fill in the invoice form and click **Generate Invoice**
3. The button will show "Generating…" for a second while it calls Stripe
4. A QR code should appear in the Payment Info box
5. Scan it — you should land on a Stripe checkout page with the correct amount

---

### Going live vs testing
- Use `sk_test_...` key while testing — no real charges
- When ready, swap to `sk_live_...` in the environment variable
- Update the env var in Netlify and redeploy

---

### Troubleshooting
- **QR doesn't appear** — check the browser console for errors. Make sure the env variable is set and you've redeployed after adding it.
- **"Invalid amount" error** — make sure all line items have a rate and quantity filled in
- **Stripe error** — double-check your secret key is correct and has Payment Links permission

---

### File structure
```
wolfe-invoice/
├── index.html                          # The invoice generator
├── netlify.toml                        # Netlify config
├── package.json                        # Stripe SDK dependency
└── netlify/
    └── functions/
        └── create-payment-link.js      # Serverless function
```
