-- ============================================================
-- BuildMart Database Schema
-- Paste this into Supabase SQL Editor and click Run
-- ============================================================

-- ── Suppliers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         VARCHAR(255) NOT NULL UNIQUE,
  cat          VARCHAR(255) NOT NULL,
  loc          VARCHAR(255) NOT NULL,
  rating       FLOAT        DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  "totalOrders" VARCHAR(20)  DEFAULT '0',
  icon         VARCHAR(20)  DEFAULT '🏭',
  "isVerified"  BOOLEAN      DEFAULT true,
  "contactEmail" VARCHAR(255),
  "contactPhone" VARCHAR(50),
  description  TEXT,
  "createdAt"  TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Products ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255)  NOT NULL,
  brand        VARCHAR(100),
  description  TEXT,
  cat          VARCHAR(100)  NOT NULL,
  price        INTEGER       NOT NULL CHECK (price >= 0),
  "oldPrice"   INTEGER,
  unit         VARCHAR(100)  NOT NULL DEFAULT 'per piece',
  icon         VARCHAR(20),
  badge        VARCHAR(20)   CHECK (badge IN ('hot','new','sale')),
  color        VARCHAR(10)   DEFAULT '#F5F5F5',
  img          TEXT,
  "supplierId" UUID          REFERENCES suppliers(id) ON DELETE SET NULL,
  "supplierName" VARCHAR(255),
  stock        INTEGER       DEFAULT 999 CHECK (stock >= 0),
  "isActive"   BOOLEAN       DEFAULT true,
  "isFeatured" BOOLEAN       DEFAULT false,
  "createdAt"  TIMESTAMPTZ   DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Users (admin only — no customer accounts) ──────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "firstName"  VARCHAR(100),
  "lastName"   VARCHAR(100),
  email        VARCHAR(255) UNIQUE,
  password     VARCHAR(255),
  phone        VARCHAR(50),
  role         VARCHAR(20)  DEFAULT 'customer',
  address      VARCHAR(255),
  city         VARCHAR(100),
  state        VARCHAR(100),
  "zipCode"    VARCHAR(20),
  "lastLogin"  TIMESTAMPTZ,
  "isActive"   BOOLEAN      DEFAULT true,
  "createdAt"  TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                 UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "orderNumber"      VARCHAR(50)  UNIQUE,
  "userId"           UUID         REFERENCES users(id) ON DELETE SET NULL,
  "totalAmount"      DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax                DECIMAL(12,2) DEFAULT 0,
  "shippingCost"     DECIMAL(12,2) DEFAULT 5000,
  status             VARCHAR(50)  DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  "paymentStatus"    VARCHAR(50)  DEFAULT 'pending'
                     CHECK ("paymentStatus" IN ('pending','completed','failed')),
  "shippingAddress"  JSONB,
  "trackingNumber"   VARCHAR(100),
  "estimatedDelivery" DATE,
  notes              TEXT,
  "createdAt"        TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Order items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "orderId"     UUID         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "productId"   INTEGER      REFERENCES products(id) ON DELETE SET NULL,
  "productName" VARCHAR(255),
  quantity      INTEGER      NOT NULL CHECK (quantity >= 1),
  price         DECIMAL(12,2) NOT NULL,
  total         DECIMAL(12,2),
  sku           VARCHAR(100),
  "createdAt"   TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Transactions (Paystack payments) ─────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id              UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  reference       VARCHAR(100) NOT NULL UNIQUE,
  "orderId"       UUID         REFERENCES orders(id) ON DELETE SET NULL,
  "orderNumber"   VARCHAR(50),
  "customerName"  VARCHAR(255) NOT NULL,
  "customerEmail" VARCHAR(255) NOT NULL,
  "amountKobo"    BIGINT       NOT NULL,
  "amountNGN"     DECIMAL(12,2) NOT NULL,
  method          VARCHAR(50)  DEFAULT 'card',
  status          VARCHAR(20)  DEFAULT 'pending'
                  CHECK (status IN ('pending','success','failed','abandoned')),
  "paystackData"  JSONB,
  "createdAt"     TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Support requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_requests (
  id              UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "ticketId"      VARCHAR(50)  NOT NULL UNIQUE,
  "orderId"       VARCHAR(50),
  subject         VARCHAR(255) NOT NULL,
  message         TEXT         NOT NULL,
  "customerName"  VARCHAR(255) NOT NULL,
  "customerEmail" VARCHAR(255) NOT NULL,
  status          VARCHAR(20)  DEFAULT 'open'
                  CHECK (status IN ('open','in_progress','resolved','closed')),
  priority        VARCHAR(10)  DEFAULT 'medium'
                  CHECK (priority IN ('low','medium','high')),
  "adminNotes"    TEXT,
  "createdAt"     TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Carts ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId"    UUID         REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "cartId"    UUID         NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  "productId" INTEGER      REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER      NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  price       DECIMAL(12,2),
  "createdAt" TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Reviews ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  "productId" INTEGER      REFERENCES products(id) ON DELETE CASCADE,
  "userId"    UUID         REFERENCES users(id) ON DELETE SET NULL,
  "orderId"   UUID         REFERENCES orders(id) ON DELETE SET NULL,
  rating      INTEGER      CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  "createdAt" TIMESTAMPTZ  DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Indexes for performance ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_cat      ON products(cat);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products("isActive");
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created    ON orders("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_ref  ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================================
-- Seed Data — BuildMart Products & Suppliers
-- ============================================================

-- Suppliers
INSERT INTO suppliers (name, cat, loc, rating, "totalOrders", icon) VALUES
  ('Dangote Industries',  'Cement & Concrete',  'Nationwide',    4.9, '12K+', '🏭'),
  ('BUA Cement Co.',      'Cement',             'Nationwide',    4.8, '9K+',  '🏗'),
  ('Lafarge Holcim',      'Cement',             'Nationwide',    4.7, '7K+',  '🏗'),
  ('Iron Flex Ltd',       'Iron & Steel',       'Lagos, Abuja',  4.7, '5K+',  '⚙️'),
  ('SteelCo Nigeria',     'Iron & Steel',       'Lagos',         4.5, '2.5K+','🔧'),
  ('RomaTile Ceramics',   'Tiles & Flooring',   'Lagos',         4.8, '3.2K+','🪟'),
  ('TimberKing Ltd',      'Timber & Wood',      'Ibadan, PH',    4.6, '2K+',  '🪵'),
  ('MetalCo Roofing',     'Roofing',            'Lagos',         4.5, '4.1K+','🏠'),
  ('Gerard Roofing',      'Roofing',            'Lagos, Abuja',  4.8, '2.9K+','🏠'),
  ('BlockPro Industries', 'Blocks & Masonry',   'Lagos, Abuja',  4.6, '5K+',  '🧱'),
  ('PaveCo Nigeria',      'Blocks & Paving',    'Lagos',         4.4, '1.8K+','🔷'),
  ('SandMart Aggregates', 'Sand & Aggregates',  'Lagos, Ibadan', 4.5, '3.5K+','🪨'),
  ('RiverCo Aggregates',  'Sand & Aggregates',  'Delta, Rivers', 4.6, '2.8K+','🌊'),
  ('PitSands Ltd',        'Sand & Aggregates',  'Edo, Anambra',  4.3, '1.5K+','🔴'),
  ('GraniteCo Ltd',       'Granite & Stone',    'Ogun, Oyo',     4.7, '4K+',  '💎'),
  ('QuarryCo Nigeria',    'Granite & Stone',    'Abuja, Kogi',   4.5, '3.2K+','⛏️'),
  ('Dulux Nigeria',       'Paint & Finishes',   'Lagos',         4.9, '6K+',  '🎨')
ON CONFLICT (name) DO NOTHING;

-- Products (with supplier name denormalised for fast reads)
INSERT INTO products (id, name, brand, cat, "supplierName", price, "oldPrice", unit, icon, badge, color, img) VALUES
  (1,  'Dangote Cement 42.5',       'Dangote',    'Cement',  'Dangote Industries',  9800,  NULL,  'per bag (50kg)',  '🏗', 'hot',  '#E1F5EE', 'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?w=400&h=280&fit=crop&q=80'),
  (2,  'BUA Cement OPC 32.5',        'BUA',        'Cement',  'BUA Cement Co.',      8600,  9500,  'per bag (50kg)',  '🏗', 'sale', '#E1F5EE', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop&q=80'),
  (3,  'Lafarge Supaset Cement',      'Lafarge',    'Cement',  'Lafarge Holcim',      10200, NULL,  'per bag (50kg)',  '🏗', 'new',  '#E1F5EE', 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=280&fit=crop&q=80'),
  (4,  'Iron Rod Y12 (12mm)',         'Iron Flex',  'Iron',    'Iron Flex Ltd',       94000, NULL,  'per tonne',      '⚙️', NULL,   '#EAF3DE', 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=400&h=280&fit=crop&q=80'),
  (5,  'Iron Rod Y16 (16mm)',         'Iron Flex',  'Iron',    'Iron Flex Ltd',       98500, NULL,  'per tonne',      '⚙️', 'hot',  '#EAF3DE', 'https://images.unsplash.com/photo-1590503680237-3d8aed6f4c44?w=400&h=280&fit=crop&q=80'),
  (6,  'Binding Wire 25kg',           'SteelCo',    'Iron',    'SteelCo Nigeria',     12500, NULL,  'per roll',       '🔧', NULL,   '#EAF3DE', 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=280&fit=crop&q=80'),
  (7,  'Ceramic Wall Tile 30x30',     'RomaTile',   'Tiles',   'RomaTile Ceramics',   3800,  4500,  'per m2',         '🪟', 'sale', '#E6F1FB', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=280&fit=crop&q=80'),
  (8,  'Porcelain Floor Tile 60x60',  'RomaTile',   'Tiles',   'RomaTile Ceramics',   7200,  NULL,  'per m2',         '🪟', 'new',  '#E6F1FB', 'https://images.unsplash.com/photo-1619211047834-2f1fe83c1f8f?w=400&h=280&fit=crop&q=80'),
  (9,  'Hardwood Plank (3m)',         'TimberKing', 'Timber',  'TimberKing Ltd',      8500,  NULL,  'per piece',      '🪵', NULL,   '#FAEEDA', 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&h=280&fit=crop&q=80'),
  (10, 'Roofing Sheet (0.55mm)',       'MetalCo',    'Roofing', 'MetalCo Roofing',     4200,  NULL,  'per sheet',      '🏠', 'hot',  '#FAECE7', 'https://images.unsplash.com/photo-1587329310686-91f574d7a0c6?w=400&h=280&fit=crop&q=80'),
  (11, 'Stone Coated Roof (per m2)',   'Gerard',     'Roofing', 'Gerard Roofing',      12000, NULL,  'per m2',         '🏠', 'new',  '#FAECE7', 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=280&fit=crop&q=80'),
  (12, 'Dulux Weathershield 20L',      'Dulux',      'Paint',   'Dulux Nigeria',       58000, 64000, 'per bucket',     '🎨', 'sale', '#FBEAF0', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=280&fit=crop&q=80'),
  (13, 'Sharp Sand (Coarse)',         'SandMart',   'Sand',    'SandMart Aggregates', 78000, NULL,  'per tipper load','🪨', 'hot',  '#F5F0E8', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=280&fit=crop&q=80'),
  (14, 'Plaster Sand (Fine)',         'SandMart',   'Sand',    'SandMart Aggregates', 65000, NULL,  'per tipper load','🟤', NULL,   '#F5F0E8', 'https://images.unsplash.com/photo-1551523713-1a4a7f4f8e3b?w=400&h=280&fit=crop&q=80'),
  (15, 'River Sand (Washed)',         'RiverCo',    'Sand',    'RiverCo Aggregates',  85000, NULL,  'per tipper load','🪨', 'new',  '#F5F0E8', 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&h=280&fit=crop&q=80'),
  (16, 'Pit Sand (Red Sand)',         'PitSands',   'Sand',    'PitSands Ltd',        55000, NULL,  'per tipper load','🔴', NULL,   '#F5F0E8', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=280&fit=crop&q=80'),
  (17, 'White Sand (Plastering)',     'SandMart',   'Sand',    'SandMart Aggregates', 72000, NULL,  'per tipper load','⬜', NULL,   '#F5F0E8', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=280&fit=crop&q=80'),
  (18, 'Granite 3/4" (19mm)',         'GraniteCo',  'Granite', 'GraniteCo Ltd',       95000, NULL,  'per tipper load','🪨', 'hot',  '#ECEAE6', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=280&fit=crop&q=80'),
  (19, 'Granite 1/2" (12.5mm)',       'GraniteCo',  'Granite', 'GraniteCo Ltd',       88000, 95000, 'per tipper load','🪨', NULL,   '#ECEAE6', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop&q=80'),
  (20, 'Granite Dust / Quarry Fines', 'QuarryCo',   'Granite', 'QuarryCo Nigeria',    42000, 50000, 'per tipper load','🌫️','sale', '#ECEAE6', 'https://images.unsplash.com/photo-1565975591706-f68f8befd56b?w=400&h=280&fit=crop&q=80'),
  (21, 'Pea Gravel (Drainage)',        'RiverCo',    'Granite', 'RiverCo Aggregates',  60000, NULL,  'per tipper load','🪨', NULL,   '#ECEAE6', 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=280&fit=crop&q=80'),
  (22, 'Crushed Stone (Hardcore)',     'QuarryCo',   'Granite', 'QuarryCo Nigeria',    70000, NULL,  'per tipper load','💎', 'new',  '#ECEAE6', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=280&fit=crop&q=80'),
  (23, '9" Sandcrete Block (Solid)',  'BlockPro',   'Blocks',  'BlockPro Industries', 750,   NULL,  'per block',      '🧱', 'hot',  '#F0EBE1', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=280&fit=crop&q=80'),
  (24, '6" Sandcrete Block (Hollow)', 'BlockPro',   'Blocks',  'BlockPro Industries', 550,   NULL,  'per block',      '🧱', NULL,   '#F0EBE1', 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=280&fit=crop&q=80'),
  (25, 'Paving Block (Interlocking)', 'PaveCo',     'Blocks',  'PaveCo Nigeria',      1200,  NULL,  'per m2',         '🔷', 'new',  '#F0EBE1', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=280&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET
  price        = EXCLUDED.price,
  "oldPrice"   = EXCLUDED."oldPrice",
  "isActive"   = true,
  "updatedAt"  = NOW();

-- Link products to their suppliers
UPDATE products p
SET "supplierId" = s.id
FROM suppliers s
WHERE p."supplierName" = s.name
  AND p."supplierId" IS NULL;

-- Reset sequence so next auto-increment starts after 25
SELECT setval('products_id_seq', 25, true);
