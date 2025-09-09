-- Wallify Database Schema with Credits System

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  credits_cost INTEGER NOT NULL DEFAULT 1,
  image_path TEXT,
  file_path TEXT NOT NULL,
  stock INTEGER DEFAULT 100,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  total_cents INTEGER NOT NULL,
  credits_used INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  credits_cost INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credits transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL, -- positive for purchases, negative for usage
  type TEXT NOT NULL, -- 'purchase', 'usage', 'refund', 'bonus'
  description TEXT,
  order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit packages table
CREATE TABLE IF NOT EXISTS credit_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default credit packages (1 Euro = 100 Credits)
INSERT INTO credit_packages (name, credits, price_cents, is_popular, features) VALUES
('100 Credits', 100, 100, false, ARRAY['100 Premium Wallpapers', 'HD & 4K Resolutions', 'Commercial License']),
('500 Credits', 500, 500, true, ARRAY['500 Premium Wallpapers', 'All Resolutions (HD, 4K, 8K)', 'Commercial License']),
('1000 Credits', 1000, 1000, false, ARRAY['1000 Premium Wallpapers', 'All Resolutions', 'Commercial License']),
('2000 Credits', 2000, 2000, false, ARRAY['2000 Premium Wallpapers', 'All Resolutions', 'Commercial License']);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, credits)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert products" ON products
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = created_by);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Credit transactions policies
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit packages policies
CREATE POLICY "Anyone can view credit packages" ON credit_packages
  FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles 
    SET credits = credits + NEW.amount 
    WHERE id = NEW.user_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for credit transactions
CREATE TRIGGER credit_transaction_trigger
  AFTER INSERT ON credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits();

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION check_user_credits(user_uuid UUID, required_credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits 
  FROM user_profiles 
  WHERE id = user_uuid;
  
  RETURN COALESCE(current_credits, 0) >= required_credits;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_user_credits(user_uuid UUID, credits_to_deduct INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_profiles 
  SET credits = credits - credits_to_deduct 
  WHERE id = user_uuid AND credits >= credits_to_deduct;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
