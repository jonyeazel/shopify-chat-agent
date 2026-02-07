-- Sites Table - Multi-tenant offer card infrastructure
-- Each row = one deployed offer card

CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  
  -- Identity
  subdomain TEXT UNIQUE, -- card-123.offercard.io
  custom_domain TEXT UNIQUE, -- coolstore.com
  
  -- Source data
  source_url TEXT, -- the URL we scraped to create this
  source_type TEXT CHECK (source_type IN ('shopify', 'service', 'portfolio', 'restaurant', 'other')),
  
  -- Owner
  owner_email TEXT,
  owner_name TEXT,
  
  -- Branding (scraped or customized)
  site_name TEXT NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  avatar_url TEXT,
  primary_color TEXT DEFAULT '#253a2e',
  background_media_url TEXT, -- image or video background
  background_media_type TEXT CHECK (background_media_type IN ('image', 'video')),
  
  -- Music player
  music_track_url TEXT,
  music_artist TEXT,
  music_title TEXT,
  
  -- AI personality
  ai_system_prompt TEXT,
  ai_personality TEXT DEFAULT 'professional', -- professional, casual, luxury, playful
  
  -- Shopify integration (when connected)
  shopify_domain TEXT, -- store.myshopify.com
  shopify_storefront_token TEXT,
  shopify_connected BOOLEAN DEFAULT FALSE,
  
  -- Products (scraped initially, then synced from Shopify)
  products JSONB DEFAULT '[]'::jsonb,
  
  -- Affiliate/referral
  referred_by INTEGER REFERENCES sites(id),
  referral_code TEXT UNIQUE,
  affiliate_percentage DECIMAL(5,2) DEFAULT 10.00,
  
  -- Monetization
  platform_fee_percentage DECIMAL(5,2) DEFAULT 2.50,
  stripe_connect_id TEXT,
  
  -- Sponsor slots
  sponsor_slots JSONB DEFAULT '[]'::jsonb,
  
  -- Analytics
  total_visits INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'preview' CHECK (status IN ('preview', 'active', 'suspended', 'deleted')),
  is_template BOOLEAN DEFAULT FALSE, -- Site #1 is a template
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public site read" ON sites FOR SELECT USING (true);
CREATE POLICY "Allow public site insert" ON sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public site update" ON sites FOR UPDATE USING (true);

-- Indexes
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_sites_custom_domain ON sites(custom_domain);
CREATE INDEX idx_sites_referral_code ON sites(referral_code);
CREATE INDEX idx_sites_referred_by ON sites(referred_by);
CREATE INDEX idx_sites_status ON sites(status);

-- Insert Site #1 - TheShopifyGuy (Genesis Card)
INSERT INTO sites (
  id,
  custom_domain,
  source_type,
  owner_email,
  site_name,
  tagline,
  avatar_url,
  primary_color,
  ai_personality,
  referral_code,
  status,
  is_template,
  activated_at
) VALUES (
  1,
  'theshopifyguy.dev',
  'service',
  'jon@theshopifyguy.com',
  'TheShopifyGuy',
  '14 years. 100 stores. Let''s talk.',
  '/images/0a3a7659-2.jpg',
  '#253a2e',
  'professional',
  'TSG001',
  'active',
  TRUE,
  NOW()
);

-- Reset sequence to start after Site #1
SELECT setval('sites_id_seq', 1, true);
