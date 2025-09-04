-- Complete Database Migration for Wallify
-- Run this in Supabase SQL Editor

-- Step 1: Add missing columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS credits_cost INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Convert existing price_cents to credits_cost
UPDATE products 
SET credits_cost = CASE 
  WHEN price_cents > 0 THEN price_cents / 100
  ELSE 1
END
WHERE credits_cost IS NULL OR credits_cost = 1;

-- Step 3: Make credits_cost NOT NULL
ALTER TABLE products ALTER COLUMN credits_cost SET NOT NULL;

-- Step 4: Set default values for existing products
UPDATE products 
SET 
  is_published = true,
  stock = 100,
  description = 'Premium quality wallpaper'
WHERE is_published IS NULL OR stock IS NULL OR description IS NULL;

-- Step 5: Verify the migration
SELECT 
  id, 
  name, 
  price_cents, 
  credits_cost, 
  is_published,
  stock,
  description,
  created_at
FROM products 
LIMIT 5;
