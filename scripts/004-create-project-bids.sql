-- Create project_bids table for the bidding system
CREATE TABLE IF NOT EXISTS project_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact info
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  store_domain TEXT,
  
  -- Project details
  service_category TEXT NOT NULL,
  project_description TEXT NOT NULL,
  
  -- Bid details
  selected_tier TEXT NOT NULL,
  bid_amount INTEGER NOT NULL, -- in cents
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')),
  counter_amount INTEGER, -- if you counter-offer
  admin_notes TEXT,
  
  -- Conversation context
  conversation_id TEXT,
  uploaded_images TEXT[] -- URLs of any uploaded images
);

-- Enable RLS
ALTER TABLE project_bids ENABLE ROW LEVEL SECURITY;

-- Policy for service role (admin)
CREATE POLICY "Service role can do everything" ON project_bids
  FOR ALL USING (true);

-- Create index for faster lookups
CREATE INDEX idx_project_bids_status ON project_bids(status);
CREATE INDEX idx_project_bids_email ON project_bids(email);
CREATE INDEX idx_project_bids_created ON project_bids(created_at DESC);
