# Database Schema Summary for Wedding Registry

## Quick Setup Checklist

✅ **Project is running locally** at http://localhost:8080  
✅ **Supabase credentials configured** in `.env.local`  
⚠️ **Next step**: Run the SQL schema in your Supabase dashboard  

## Required Supabase Tables

### 1. `wishlist_items` Table

```sql
CREATE TABLE public.wishlist_items (
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
```

**Purpose**: Stores all wishlist items that the couple wants to receive as gifts.

**Key Fields**:
- `title`: Item name (e.g., "Premium Coffee Maker")
- `description`: Why they want this item
- `url`: Direct link to purchase the item
- `store`: Where to buy it (Amazon, Flipkart, Nykaa, etc.)
- `price`: Cost of the item
- `status`: 'available', 'purchased', or 'reserved'
- `purchased_by`: Name of the person who bought it
- `purchase_date`: When it was purchased

### 2. `gifts` Table

```sql
CREATE TABLE public.gifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('item', 'cash')),
    item_id UUID REFERENCES public.wishlist_items(id) ON DELETE SET NULL,
    item_title VARCHAR(255),
    amount VARCHAR(50),
    guest_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Records all gifts received, both physical items and cash contributions.

**Key Fields**:
- `type`: Either 'item' (purchased from wishlist) or 'cash' (money gift)
- `item_id`: Links to wishlist item if it's a physical gift
- `item_title`: Name of the item (for reference)
- `amount`: Cash amount if it's a money gift
- `guest_name`: Name of the gift giver
- `message`: Personal message from the guest
- `from_name`: Who the gift is from (might be different from guest_name)
- `date`: When the gift was given

## Application Features Supported

### For Guests (`/registry` page):
1. **Browse Wishlist**: View all available items
2. **Purchase Items**: Mark items as purchased with personal message
3. **Send Cash Gifts**: Contribute money with UPI details
4. **Leave Messages**: Personal notes for the couple

### For Couple (`/admin` page):
1. **Manage Wishlist**: Add/remove items
2. **View Gifts**: See all received gifts and messages
3. **Track Status**: Monitor what's been purchased

## Sample Data Included

The schema includes sample data to get you started:

**Wishlist Items**:
- Premium Coffee Maker (₹25,000) - Available
- Silk Bedsheet Set (₹8,500) - Already purchased by "Arjun & Meera"
- Skincare Gift Set (₹12,000) - Available

**Gift Records**:
- Cash gift of ₹5,000 from "Priya & Family"
- Item purchase of bedsheet set by "Arjun & Meera"

## Security & Permissions

The database is configured with Row Level Security (RLS) policies that allow:
- **Public read access**: Anyone can view wishlist and gifts
- **Public write access**: Guests can purchase items and add gifts
- **Public management**: Couple can add/remove wishlist items

This is appropriate for a wedding registry where you want easy guest access.

## Next Steps

1. **Run the Schema**: Copy `supabase-schema.sql` content into your Supabase SQL Editor
2. **Test the Connection**: Restart your dev server and check if data loads
3. **Customize Data**: Replace sample items with your actual wishlist
4. **Update Details**: Change couple names, UPI details, delivery address

## File Structure Created

```
├── .env.local                 # Your Supabase credentials (DO NOT COMMIT)
├── .env.example              # Template for environment variables
├── supabase-schema.sql       # Complete database schema
├── src/lib/supabase.ts       # Supabase client configuration
├── src/services/supabaseService.ts  # Database operations
├── src/contexts/RegistryContext.tsx # Updated with Supabase integration
├── README.md                 # Complete setup guide
├── SUPABASE_SETUP.md        # Detailed Supabase instructions
└── DATABASE_SCHEMA_SUMMARY.md # This file
```

## Troubleshooting

**If data doesn't load**:
1. Check browser console for errors
2. Verify environment variables are correct
3. Ensure Supabase schema was applied successfully
4. Check Supabase dashboard for any issues

**If you see "Error loading data"**:
- The app will fall back to local sample data
- This means Supabase connection failed
- Check your credentials and network connection

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):
1. Add the same environment variables to your hosting platform
2. The app will automatically use Supabase in production
3. Make sure your Supabase project is not paused
4. Consider setting up database backups

---

Your wedding registry is now ready to use! The project runs locally and will connect to Supabase once you run the schema.
