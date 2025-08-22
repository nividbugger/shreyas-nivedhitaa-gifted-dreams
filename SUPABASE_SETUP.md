# Supabase Setup Guide for Wedding Registry

This guide will walk you through setting up Supabase for your wedding registry application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `wedding-registry` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (the `anon` key under "Project API keys")

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `wishlist_items` table for storing wedding registry items
- `gifts` table for storing gift records and messages
- Sample data to get you started
- Proper indexes for performance
- Row Level Security policies for public access

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Navigate to the registry page (`/registry`)
4. You should see the sample wishlist items loaded from Supabase

## Database Tables Overview

### `wishlist_items` Table
Stores all the items in the couple's wishlist:
- Item details (title, description, price, store)
- Purchase status and buyer information
- Product URLs for easy purchasing

### `gifts` Table
Records all gifts received:
- Links to purchased wishlist items
- Cash gift records
- Personal messages from guests
- Guest information

## Row Level Security (RLS)

The schema includes RLS policies that allow:
- **Public read access** to both tables (guests can view items and gifts)
- **Public insert/update** permissions (guests can purchase items, add gifts)
- **Public delete** on wishlist items (couple can manage their wishlist)

This is appropriate for a wedding registry where you want guests to interact freely.

## Sample Data

The schema includes sample data:
- 3 wishlist items (coffee maker, bedsheets, skincare set)
- 2 gift records (1 cash gift, 1 item purchase)

You can modify or delete this sample data through the Supabase dashboard.

## Monitoring and Management

### View Your Data
1. Go to **Table Editor** in Supabase dashboard
2. Select `wishlist_items` or `gifts` to view/edit data
3. You can manually add, edit, or delete records here

### Real-time Updates
The application automatically syncs with Supabase, so changes made in the dashboard will appear in the app immediately.

### Backup Your Data
1. Go to **Settings** → **Database**
2. Use the backup features to create regular backups
3. You can also export data as CSV from the Table Editor

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your `.env.local` file is in the project root
- Ensure the Supabase project is active (not paused)

### Permission Errors
- Check that RLS policies are properly set up
- Verify the anon key has the correct permissions

### Data Not Appearing
- Check the browser console for errors
- Verify the schema was applied correctly
- Test the connection in the Supabase dashboard

## Security Considerations

### For Production Use
1. **Review RLS Policies**: The current setup allows public access, which is fine for a wedding registry but consider your specific needs
2. **Environment Variables**: Never commit your `.env.local` file to version control
3. **API Keys**: The anon key is safe to use in frontend applications
4. **Database Backups**: Set up regular backups for important data

### Optional: Add Authentication
If you want to restrict access to invited guests only:
1. Enable Supabase Auth
2. Update RLS policies to require authentication
3. Implement login/signup in the application

## Next Steps

1. Customize the sample data with your actual wishlist items
2. Update the couple's names and details in the application
3. Test the full flow: adding items, purchasing, sending messages
4. Deploy your application with the Supabase configuration

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- Check the main README.md for application-specific help
