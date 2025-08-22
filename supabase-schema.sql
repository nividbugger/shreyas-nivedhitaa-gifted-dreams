-- Wedding Registry Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    store VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'purchased', 'reserved')),
    purchased_by VARCHAR(255),
    purchase_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('item', 'cash')),
    item_id UUID REFERENCES public.wishlist_items(id) ON DELETE SET NULL,
    item_title VARCHAR(255),
    amount VARCHAR(50),
    guest_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_wishlist_items_updated_at 
    BEFORE UPDATE ON public.wishlist_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at 
    BEFORE UPDATE ON public.gifts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.wishlist_items (title, description, url, store, price, status, purchased_by, purchase_date) VALUES
('Premium Coffee Maker', 'Espresso machine for our morning coffee rituals together', 'https://amazon.in/example', 'Amazon', '₹25,000', 'available', NULL, NULL),
('Silk Bedsheet Set', 'Luxurious silk bedsheets for our new home', 'https://flipkart.com/example', 'Flipkart', '₹8,500', 'purchased', 'Arjun & Meera', '2024-01-14'),
('Skincare Gift Set', 'Premium skincare collection for the bride', 'https://nykaa.com/example', 'Nykaa', '₹12,000', 'available', NULL, NULL);

-- Insert sample gifts
INSERT INTO public.gifts (type, item_id, item_title, amount, guest_name, message, from_name, date) VALUES
('cash', NULL, NULL, '₹5,000', 'Priya & Family', 'Wishing you both a lifetime of happiness!', 'Priya, Raj, and Kids', '2024-01-15'),
('item', (SELECT id FROM public.wishlist_items WHERE title = 'Silk Bedsheet Set'), 'Silk Bedsheet Set', NULL, 'Arjun', 'Hope you enjoy your cozy nights together!', 'Arjun & Meera', '2024-01-14');

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a wedding registry)
-- Allow everyone to read wishlist items
CREATE POLICY "Allow public read access on wishlist_items" ON public.wishlist_items
    FOR SELECT USING (true);

-- Allow everyone to read gifts
CREATE POLICY "Allow public read access on gifts" ON public.gifts
    FOR SELECT USING (true);

-- Allow everyone to insert gifts (guests can add gifts)
CREATE POLICY "Allow public insert on gifts" ON public.gifts
    FOR INSERT WITH CHECK (true);

-- Allow everyone to update wishlist items (for purchasing)
CREATE POLICY "Allow public update on wishlist_items" ON public.wishlist_items
    FOR UPDATE USING (true);

-- Allow everyone to insert wishlist items (couple can add items)
CREATE POLICY "Allow public insert on wishlist_items" ON public.wishlist_items
    FOR INSERT WITH CHECK (true);

-- Allow everyone to delete wishlist items (couple can remove items)
CREATE POLICY "Allow public delete on wishlist_items" ON public.wishlist_items
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wishlist_items_status ON public.wishlist_items(status);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON public.wishlist_items(created_at);
CREATE INDEX IF NOT EXISTS idx_gifts_type ON public.gifts(type);
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON public.gifts(created_at);
CREATE INDEX IF NOT EXISTS idx_gifts_item_id ON public.gifts(item_id);
