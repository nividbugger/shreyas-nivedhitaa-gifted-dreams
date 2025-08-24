-- Reset RLS policies for wedding registry
-- Wedding registries should be publicly viewable for guests

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Couple can manage wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Guests can view and purchase wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Couple can view all gifts" ON public.gifts;
DROP POLICY IF EXISTS "Guests can view and add gifts" ON public.gifts;

-- Drop the restrictive function
DROP FUNCTION IF EXISTS public.validate_registry_access();

-- Create appropriate policies for wedding registry

-- Wishlist Items Policies
CREATE POLICY "Anyone can view wishlist items" 
ON public.wishlist_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update wishlist items for purchases" 
ON public.wishlist_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Only authenticated users can add wishlist items" 
ON public.wishlist_items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete wishlist items" 
ON public.wishlist_items 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Gifts Policies  
CREATE POLICY "Anyone can view gifts" 
ON public.gifts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add gifts" 
ON public.gifts 
FOR INSERT 
WITH CHECK (true);