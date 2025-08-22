# How to Run Database Schema in Supabase

## Quick Steps

1. **Open Supabase Dashboard**: Go to [supabase.com](https://supabase.com) → Your Project
2. **SQL Editor**: Click "SQL Editor" in sidebar → "New query"
3. **Copy Schema**: Open `supabase-schema.sql` → Select All → Copy
4. **Execute**: Paste in SQL Editor → Click "Run" button
5. **Verify**: Go to "Table Editor" → Check for `wishlist_items` and `gifts` tables

## What the Schema Creates

- ✅ `wishlist_items` table with sample data (3 items)
- ✅ `gifts` table with sample data (2 gifts)
- ✅ Proper indexes for performance
- ✅ Row Level Security policies
- ✅ Auto-updating timestamps
- ✅ UUID primary keys

## After Running the Schema

1. **Test the Connection**: 
   - Restart your dev server: `npm run dev`
   - Go to http://localhost:8080/registry
   - You should see the sample wishlist items from Supabase

2. **Check for Errors**:
   - Open browser console (F12)
   - Look for any Supabase connection errors
   - If you see errors, double-check your `.env.local` file

3. **Verify Data**:
   - In Supabase Table Editor, click on `wishlist_items`
   - You should see 3 sample items
   - Click on `gifts` to see 2 sample gift records

## Troubleshooting

**If you get permission errors**:
- Make sure you're logged into the correct Supabase account
- Verify you have admin access to the project

**If tables already exist**:
- The schema uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- Existing data won't be lost

**If you see "relation already exists" warnings**:
- This is normal and can be ignored
- It means some parts of the schema were already created

## Next Steps After Migration

1. **Customize the Data**: Replace sample items with your actual wishlist
2. **Test All Features**: Try adding items, purchasing, sending gifts
3. **Update App Content**: Change couple names, UPI details, addresses
4. **Deploy**: Your app is now ready for production deployment

## Sample Data Included

The migration creates these sample items:
- Premium Coffee Maker (₹25,000) - Available
- Silk Bedsheet Set (₹8,500) - Already purchased
- Skincare Gift Set (₹12,000) - Available

And these sample gifts:
- Cash gift from "Priya & Family" (₹5,000)
- Item purchase by "Arjun & Meera"

You can modify or delete this sample data through the Supabase Table Editor.
