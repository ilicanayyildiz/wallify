-- Database Migration: Update products table from price_cents to credits_cost
-- Run this script to update your existing database

-- Step 1: Add new credits_cost column
ALTER TABLE products ADD COLUMN IF NOT EXISTS credits_cost INTEGER DEFAULT 1;

-- Step 2: Update existing products to convert price_cents to credits_cost
-- Assuming 1 Euro = 100 credits, and price_cents was in cents
UPDATE products 
SET credits_cost = CASE 
  WHEN price_cents > 0 THEN price_cents / 100
  ELSE 1
END
WHERE credits_cost IS NULL OR credits_cost = 1;

-- Step 3: Make credits_cost NOT NULL after data migration
ALTER TABLE products ALTER COLUMN credits_cost SET NOT NULL;

-- Step 4: Drop the old price_cents column (optional - uncomment if you're sure)
-- ALTER TABLE products DROP COLUMN price_cents;

-- Step 5: Add updated_at column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 6: Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Create new trigger
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Update RLS policies for products
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published products" ON products;
DROP POLICY IF EXISTS "Users can insert products" ON products;

-- Create new policies
CREATE POLICY "Anyone can view published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete products" ON products
  FOR DELETE USING (true);

-- Step 8: Verify the migration
SELECT 
  id, 
  name, 
  price_cents, 
  credits_cost, 
  is_published,
  created_at,
  updated_at
FROM products 
LIMIT 5;
