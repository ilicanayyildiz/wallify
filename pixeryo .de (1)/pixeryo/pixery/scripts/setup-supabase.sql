-- Create profiles table
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

-- Create a policy that allows users to view and update only their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert for new users
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create products table
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

-- Enable RLS on products but allow public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Create purchases table
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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create a profile for new users
CREATE TRIGGER IF NOT EXISTS on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 