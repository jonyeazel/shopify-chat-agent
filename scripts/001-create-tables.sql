-- CRO Quote Tool Database Schema
-- The Shopify Guy - Automated CRO Agency System

-- Leads table - stores all prospect information
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  store_domain TEXT NOT NULL,
  store_name TEXT,
  storefront_api_key TEXT,
  contact_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'proposal_sent', 'paid', 'building', 'completed', 'churned')),
  source TEXT DEFAULT 'quote_tool'
);

-- Store metrics table - raw data from Shopify Sidekick CSVs
CREATE TABLE store_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  -- Lifetime CRO Metrics
  total_sessions BIGINT,
  conversion_rate DECIMAL(10, 8),
  avg_session_duration DECIMAL(10, 2),
  total_visitors BIGINT,
  sessions_completed_checkout BIGINT,
  sessions_with_cart_adds BIGINT,
  sessions_reached_checkout BIGINT,
  -- Customer LTV Metrics
  total_customers BIGINT,
  returning_customer_rate DECIMAL(10, 8),
  orders_per_customer DECIMAL(10, 2),
  amount_per_customer DECIMAL(12, 2),
  -- Calculated fields
  cart_abandonment_rate DECIMAL(10, 8),
  checkout_abandonment_rate DECIMAL(10, 8),
  health_score INTEGER DEFAULT 0,
  revenue_opportunity DECIMAL(15, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly metrics for trend analysis
CREATE TABLE monthly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  sessions BIGINT,
  sessions_completed_checkout BIGINT,
  conversion_rate DECIMAL(10, 8),
  avg_session_duration DECIMAL(10, 2),
  visitors BIGINT,
  sessions_with_cart_adds BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table - generated pricing proposals
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  -- Pricing breakdown
  base_build_price DECIMAL(12, 2) NOT NULL,
  monthly_retainer DECIMAL(12, 2) NOT NULL,
  rev_share_percentage DECIMAL(5, 2),
  ab_domain_upsell DECIMAL(12, 2),
  total_upfront DECIMAL(12, 2) NOT NULL,
  -- Proposal details
  proposal_fee DECIMAL(12, 2) DEFAULT 97.00,
  proposal_paid BOOLEAN DEFAULT FALSE,
  proposal_paid_at TIMESTAMPTZ,
  stripe_payment_id TEXT,
  -- Quote status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'expired', 'requoted')),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  -- Package selected
  package_tier TEXT CHECK (package_tier IN ('starter', 'growth', 'scale')),
  payment_model TEXT CHECK (payment_model IN ('retainer', 'rev_share', 'hybrid')),
  -- Admin overrides
  admin_override_price DECIMAL(12, 2),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table - for accepted quotes that become builds
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  -- Project details
  v0_project_url TEXT,
  ab_test_domain TEXT,
  production_domain TEXT,
  -- Build status
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'review', 'deployed', 'live', 'paused', 'terminated')),
  build_started_at TIMESTAMPTZ,
  build_completed_at TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ,
  -- Payment tracking
  next_payment_due TIMESTAMPTZ,
  payments_current BOOLEAN DEFAULT TRUE,
  last_payment_at TIMESTAMPTZ,
  total_paid DECIMAL(15, 2) DEFAULT 0,
  -- Performance tracking
  baseline_conversion_rate DECIMAL(10, 8),
  current_conversion_rate DECIMAL(10, 8),
  revenue_generated DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages for AI support
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  -- Contract terms
  contract_type TEXT CHECK (contract_type IN ('standard', 'custom')),
  terms_accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  signature_data TEXT,
  -- Kill switch terms
  grace_period_days INTEGER DEFAULT 7,
  auto_terminate BOOLEAN DEFAULT TRUE,
  -- PDF storage
  contract_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table for tracking all transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  -- Payment details
  amount DECIMAL(12, 2) NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('proposal', 'upfront', 'retainer', 'rev_share', 'upsell')),
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRO Issues identified by AI analysis
CREATE TABLE cro_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT,
  estimated_impact DECIMAL(15, 2),
  fix_price DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cro_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public insert for lead capture, admin read all
CREATE POLICY "Allow public lead creation" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public lead read by email" ON leads FOR SELECT USING (true);
CREATE POLICY "Allow public lead update" ON leads FOR UPDATE USING (true);

CREATE POLICY "Allow public metrics insert" ON store_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public metrics read" ON store_metrics FOR SELECT USING (true);

CREATE POLICY "Allow public monthly metrics insert" ON monthly_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public monthly metrics read" ON monthly_metrics FOR SELECT USING (true);

CREATE POLICY "Allow public quotes insert" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public quotes read" ON quotes FOR SELECT USING (true);
CREATE POLICY "Allow public quotes update" ON quotes FOR UPDATE USING (true);

CREATE POLICY "Allow public projects read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public projects insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public projects update" ON projects FOR UPDATE USING (true);

CREATE POLICY "Allow public chat insert" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public chat read" ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Allow public contracts read" ON contracts FOR SELECT USING (true);
CREATE POLICY "Allow public contracts insert" ON contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public contracts update" ON contracts FOR UPDATE USING (true);

CREATE POLICY "Allow public payments read" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public payments insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public payments update" ON payments FOR UPDATE USING (true);

CREATE POLICY "Allow public issues insert" ON cro_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public issues read" ON cro_issues FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_store_metrics_lead ON store_metrics(lead_id);
CREATE INDEX idx_monthly_metrics_lead ON monthly_metrics(lead_id);
CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_projects_lead ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_chat_messages_lead ON chat_messages(lead_id);
CREATE INDEX idx_payments_project ON payments(project_id);
CREATE INDEX idx_cro_issues_lead ON cro_issues(lead_id);
