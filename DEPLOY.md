# BuildMart — Deployment Guide (Supabase + Railway + Vercel)

## Architecture
```
Browser → Vercel (React frontend)
              ↓
          Railway (Express backend)
              ↓
          Supabase (PostgreSQL database)
              ↕
          Paystack (payments)
```

---

## STEP 1 — Supabase (Database)

### 1a. Create your database

1. Go to https://supabase.com and sign in
2. Click **New project**
3. Name it `buildmart`
4. Set a strong database password (save it!)
5. Choose region closest to Nigeria (e.g. **eu-west-1** or **us-east-1**)
6. Click **Create new project** (takes ~2 minutes)

### 1b. Create all tables + seed data

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `backend/db/schema.sql`
4. Copy the entire file content
5. Paste it into the SQL editor
6. Click **Run** (green button)

You should see: `Success. 17 rows inserted (suppliers), 25 rows inserted (products)`

### 1c. Get your database connection string

1. In Supabase, go to **Settings → Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set in step 1a
6. Save this — you'll need it in Step 2

---

## STEP 2 — Railway (Backend hosting)

### 2a. Push backend to GitHub

If you haven't already:
```bash
cd C:\Users\HP\Buildmart\backend
git init
git add .
git commit -m "BuildMart backend"
# Create a GitHub repo called buildmart-backend and push to it
git remote add origin https://github.com/YOUR_USERNAME/buildmart-backend.git
git push -u origin main
```

### 2b. Deploy to Railway

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your `buildmart-backend` repo
4. Railway auto-detects Node.js

### 2c. Set environment variables in Railway

Click your service → **Variables** tab → add each one:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase connection string from Step 1c |
| `JWT_SECRET` | Any long random string (e.g. `buildmart_secret_key_2026_very_long`) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `buildmart2026` |
| `PAYSTACK_SECRET_KEY` | `sk_test_...` (from Paystack dashboard) |
| `PAYSTACK_PUBLIC_KEY` | `pk_test_...` (from Paystack dashboard) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` (set this after Step 3) |

### 2d. Get your backend URL

After deploy finishes, Railway gives you a URL like:
`https://buildmart-backend-production.up.railway.app`

Test it:
```
https://buildmart-backend-production.up.railway.app/api/health
```
Should return: `{ "success": true, "message": "BuildMart API is running" }`

```
https://buildmart-backend-production.up.railway.app/api/products
```
Should return your 25 products as JSON.

---

## STEP 3 — Vercel (Frontend hosting)

### 3a. Push frontend to GitHub

```bash
cd C:\Users\HP\Buildmart\frontend
git init
git add .
git commit -m "BuildMart frontend"
# Create a GitHub repo called buildmart-frontend and push to it
git remote add origin https://github.com/YOUR_USERNAME/buildmart-frontend.git
git push -u origin main
```

### 3b. Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **New Project → Import** your `buildmart-frontend` repo
3. Framework preset: **Create React App** (auto-detected)
4. Click **Deploy**

### 3c. Set environment variables in Vercel

Go to your project → **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | Your Railway backend URL (e.g. `https://buildmart-backend-production.up.railway.app`) |
| `REACT_APP_PAYSTACK_PUBLIC_KEY` | `pk_test_...` (from Paystack dashboard) |
| `REACT_APP_ADMIN_USER` | `admin` |
| `REACT_APP_ADMIN_PASS` | `buildmart2026` |
| `REACT_APP_SUPPORT_EMAIL` | `support@buildmart.ng` |
| `REACT_APP_SUPPORT_WHATSAPP` | `+2348012345678` |

After setting variables → **Redeploy** (Deployments tab → three dots → Redeploy)

### 3d. Get your frontend URL

Vercel gives you a URL like: `https://buildmart-xyz.vercel.app`

Go back to Railway and update `CORS_ORIGIN` to this URL.

---

## STEP 4 — Paystack Setup

1. Go to https://dashboard.paystack.com
2. Sign up / log in
3. **Settings → Developer** → copy your test keys:
   - `pk_test_...` → REACT_APP_PAYSTACK_PUBLIC_KEY (Vercel)
   - `sk_test_...` → PAYSTACK_SECRET_KEY (Railway)
4. Set webhook URL:
   - **Settings → API Keys & Webhooks → Webhook URL**
   - Set to: `https://your-railway-url.up.railway.app/api/payments/webhook`

When you're ready to go live with real money:
- Replace `pk_test_` with `pk_live_` in Vercel
- Replace `sk_test_` with `sk_live_` in Railway
- Update your Paystack business details for live approval

---

## STEP 5 — Final checks

1. Visit your Vercel URL → products load from database ✓
2. Visit Suppliers page → 17 suppliers show ✓
3. Add items to cart → checkout → Paystack popup appears ✓
4. Go to `/#admin` → login → dashboard shows real data ✓
5. Place a test order with Paystack test card:
   - Card: `4084 0840 8408 4081`
   - Expiry: any future date
   - CVV: `408`
   - PIN: `0000`

---

## Updating prices later

### Option A — Through the Admin panel
(When you build the price edit UI in AddProductPage)

### Option B — Directly in Supabase
1. Go to Supabase → **Table Editor → products**
2. Click any row → edit the `price` field
3. Save

### Option C — API call
```bash
curl -X PUT https://your-backend.up.railway.app/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 10500}'
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Products not loading | Check `REACT_APP_API_URL` is set in Vercel and redeployed |
| CORS error | Check `CORS_ORIGIN` in Railway matches your Vercel URL exactly |
| DB connection fails | Check `DATABASE_URL` is correct and includes the password |
| Paystack not working | Check both `REACT_APP_PAYSTACK_PUBLIC_KEY` (Vercel) and `PAYSTACK_SECRET_KEY` (Railway) |
| Admin login fails | Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Railway |
| Tables missing | Re-run `backend/db/schema.sql` in Supabase SQL Editor |

---

## Cost estimate (free tiers)

| Service | Free tier |
|---------|-----------|
| Supabase | 500MB database, 2GB bandwidth — enough to start |
| Railway | $5 credit/month free — enough for low traffic |
| Vercel | Unlimited for personal projects |
| Paystack | Free — charges per transaction (1.5% + ₦100 cap ₦2,000) |
