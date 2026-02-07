-- Add missing columns to contracts table for full contract management

ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS total_value DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS monthly_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS rev_share_percentage DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_signature' CHECK (status IN ('pending_signature', 'signed', 'active', 'terminated', 'expired'));

-- Create index for lead_id
CREATE INDEX IF NOT EXISTS idx_contracts_lead ON contracts(lead_id);
