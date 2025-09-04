-- Basic Database Migration for Wallify
-- Run this in Supabase SQL Editor - ONE BY ONE

-- Step 1: Add is_published column
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Step 2: Add credits_cost column  
ALTER TABLE products ADD COLUMN IF NOT EXISTS credits_cost INTEGER DEFAULT 1;

-- Step 3: Add description column
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 4: Add stock column
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100;

-- Step 5: Add created_by column
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID;

-- Step 6: Add updated_at column
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 7: Update existing products
UPDATE products SET credits_cost = 1 WHERE credits_cost IS NULL;
UPDATE products SET is_published = true WHERE is_published IS NULL;
UPDATE products SET stock = 100 WHERE stock IS NULL;
UPDATE products SET description = 'Premium quality wallpaper' WHERE description IS NULL;

-- Step 8: Verify
SELECT * FROM products LIMIT 1;
