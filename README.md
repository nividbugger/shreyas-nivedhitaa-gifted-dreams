# Wedding Registry - Nivedhitaa & Shreyas

A beautiful, modern wedding registry application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎁 **Wishlist Management**: Couples can add, edit, and remove items from their wishlist
- 💝 **Gift Purchasing**: Guests can purchase items or contribute cash gifts
- 💌 **Personal Messages**: Guests can leave heartfelt messages with their gifts
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🔄 **Real-time Updates**: Powered by Supabase for real-time data synchronization
- 🎨 **Elegant Design**: Wedding-themed UI with beautiful gradients and animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, real-time subscriptions)
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd shreyas-nivedhitaa-gifted-dreams
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the Project URL and anon public key
3. In the Supabase SQL Editor, run the schema from `supabase-schema.sql`

### 4. Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Supabase Database Schema

The application uses two main tables:

### `wishlist_items` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | VARCHAR(255) | Item title |
| `description` | TEXT | Item description |
| `url` | TEXT | Product URL |
| `store` | VARCHAR(100) | Store name (Amazon, Flipkart, etc.) |
| `price` | VARCHAR(50) | Item price |
| `image_url` | TEXT | Optional image URL |
| `status` | VARCHAR(20) | 'available', 'purchased', or 'reserved' |
| `purchased_by` | VARCHAR(255) | Name of purchaser |
| `purchase_date` | DATE | Date of purchase |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### `gifts` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `type` | VARCHAR(10) | 'item' or 'cash' |
| `item_id` | UUID | Foreign key to wishlist_items |
| `item_title` | VARCHAR(255) | Item title (for reference) |
| `amount` | VARCHAR(50) | Cash gift amount |
| `guest_name` | VARCHAR(255) | Guest's name |
| `message` | TEXT | Personal message |
| `from_name` | VARCHAR(255) | Gift sender name |
| `date` | DATE | Gift date |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Application Structure

```
src/
├── components/ui/          # Reusable UI components (shadcn/ui)
├── contexts/              # React Context providers
│   └── RegistryContext.tsx # Main application state
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   └── utils.ts          # General utilities
├── pages/                 # Application pages
│   ├── Index.tsx         # Landing page
│   ├── GuestRegistry.tsx # Guest interface
│   ├── CoupleAdmin.tsx   # Couple admin panel
│   └── NotFound.tsx      # 404 page
├── services/             # External service integrations
│   └── supabaseService.ts # Supabase database operations
└── assets/               # Static assets
```

## Key Features Explained

### Guest Experience
- Browse the couple's wishlist
- Purchase items with personal messages
- Send cash gifts via UPI
- View delivery address for physical gifts

### Couple Admin Panel
- Add new items to wishlist
- Remove items from wishlist
- View all gifts and messages received
- Track purchase status of items

### Real-time Updates
- Items are marked as purchased immediately
- New gifts appear in real-time
- Fallback to local state if Supabase is unavailable

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

Made with ❤️ for Nivedhitaa & Shreyas's special day
