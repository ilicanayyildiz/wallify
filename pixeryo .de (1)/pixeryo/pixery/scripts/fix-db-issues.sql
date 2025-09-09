-- SQL script to fix common issues in the production database

-- Drop and recreate the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-create the trigger
CREATE TRIGGER IF NOT EXISTS on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify products table exists, create it if not 
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      thumbnail_url TEXT,
      image_url TEXT,
      category TEXT,
      resolution TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE
    );
    
    -- Enable RLS on products
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    
    -- Allow public read access to products
    CREATE POLICY "Allow public read access to products" ON products
      FOR SELECT USING (true);
  END IF;
END
$$;

-- Verify purchases table exists, create it if not
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'purchases') THEN
    CREATE TABLE IF NOT EXISTS purchases (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users NOT NULL,
      product_id UUID REFERENCES products NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable RLS on purchases
    ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
    
    -- Allow users to view their own purchases
    CREATE POLICY "Users can view their own purchases" ON purchases
      FOR SELECT USING (auth.uid() = user_id);
    
    -- Allow users to insert their own purchases
    CREATE POLICY "Users can insert their own purchases" ON purchases
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Fix profiles table if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE,
      full_name TEXT,
      email TEXT UNIQUE,
      avatar_url TEXT,
      updated_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (id)
    );
    
    -- Set up Row Level Security (RLS) for profiles
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for profiles
    CREATE POLICY "Users can view their own profile" ON profiles
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "Users can update their own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
    
    -- Allow insert for new users
    CREATE POLICY "Users can insert their own profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END
$$; 