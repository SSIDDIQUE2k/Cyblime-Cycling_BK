-- =============================================
-- Missing tables for Cyblime Cycling Club
-- Run this in Supabase SQL Editor
-- =============================================

-- Route Comments (reviews on route detail pages)
CREATE TABLE IF NOT EXISTS route_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  conditions_date DATE,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE route_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read route comments"
  ON route_comments FOR SELECT
  USING (true);

-- Authenticated users can post reviews
CREATE POLICY "Authenticated users can create route comments"
  ON route_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own route comments"
  ON route_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own route comments"
  ON route_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Page Content (CMS - admin editable page content)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read page content
CREATE POLICY "Anyone can read page content"
  ON page_content FOR SELECT
  USING (true);

-- Only authenticated users can insert/update (admin check should be in app layer)
CREATE POLICY "Authenticated users can insert page content"
  ON page_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page content"
  ON page_content FOR UPDATE
  TO authenticated
  USING (true);

-- Index for fast page lookups
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON page_content(page_key);
CREATE INDEX IF NOT EXISTS idx_route_comments_route_id ON route_comments(route_id);
