-- Add Stripe customer ID to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add subscription tracking to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS next_payment_date TIMESTAMPTZ;

-- Create payments table for tracking all payments
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_type TEXT NOT NULL, -- 'proposal', 'deposit', 'final', 'retainer'
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policy for payment_history
CREATE POLICY "Allow all operations on payment_history" ON payment_history FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_history_lead_id ON payment_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_project_id ON payment_history(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_stripe_customer_id ON leads(stripe_customer_id);
