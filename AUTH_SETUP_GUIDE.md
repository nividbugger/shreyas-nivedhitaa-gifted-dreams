# Authentication Setup Guide

This guide will help you set up authentication for the couple admin section using Supabase Auth.

## 🔐 What's Been Added

### New Files Created:
- `src/services/authService.ts` - Authentication service layer
- `src/contexts/AuthContext.tsx` - React context for auth state
- `src/pages/Login.tsx` - Login page for the couple
- `src/components/ProtectedRoute.tsx` - Route protection component

### Modified Files:
- `src/App.tsx` - Added AuthProvider and protected routes
- `src/pages/Index.tsx` - Updated "Couple Login" button to go to `/login`
- `src/pages/CoupleAdmin.tsx` - Added logout functionality and user info

## 🚀 How It Works

### Authentication Flow:
1. **Public Access**: Guests can view registry (`/registry`) without login
2. **Protected Admin**: Admin panel (`/admin`) requires authentication
3. **Login Required**: Clicking "Couple Login" goes to `/login` page
4. **Auto-Redirect**: After login, users are redirected to admin panel
5. **Session Persistence**: Login state is maintained across browser sessions

### Routes:
- `/` - Home page (public)
- `/registry` - Guest registry (public)
- `/login` - Login page (public)
- `/admin` - Admin panel (protected - requires login)

## 📋 Setup Steps

### Step 1: Enable Authentication in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Settings**
3. Make sure **Enable email confirmations** is turned OFF (for simplicity)
4. Under **Auth Providers**, ensure **Email** is enabled

### Step 2: Create Your Couple Account

You have two options to create the couple's login account:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user**
3. Enter:
   - **Email**: `couple@wedding.com` (or your preferred email)
   - **Password**: Create a strong password
   - **Email Confirm**: Set to `true`
4. Click **Create user**

#### Option B: Using the Application (Advanced)
1. Temporarily add this code to create an account (remove after use):
```javascript
// Add this to a component temporarily
import { AuthService } from '@/services/authService';

const createAccount = async () => {
  try {
    await AuthService.signUpCouple('couple@wedding.com', 'your-strong-password');
    console.log('Account created successfully!');
  } catch (error) {
    console.error('Error creating account:', error);
  }
};
```

### Step 3: Test the Authentication

1. **Start your dev server**: `npm run dev`
2. **Go to home page**: http://localhost:8080
3. **Click "Couple Login"**: Should redirect to `/login`
4. **Enter credentials**: Use the email/password you created
5. **Successful login**: Should redirect to `/admin` with logout button
6. **Test logout**: Click logout button, should redirect to home

## 🔧 Configuration Details

### Environment Variables
No additional environment variables needed - uses existing Supabase config.

### Security Features
- **Protected Routes**: Admin panel requires authentication
- **Session Management**: Automatic login state persistence
- **Secure Logout**: Properly clears session data
- **Route Guards**: Automatic redirects for unauthorized access

## 🎯 User Experience

### For the Couple:
1. Click "Couple Login" on home page
2. Enter email and password
3. Access admin panel to manage wishlist and view gifts
4. Logout when done

### For Guests:
- No change in experience
- Can still access registry without any login
- All guest features work as before

## 🛠️ Customization Options

### Change Login Credentials:
1. Go to Supabase **Authentication** → **Users**
2. Find your user and click to edit
3. Update email or reset password

### Customize Login Page:
- Edit `src/pages/Login.tsx`
- Update styling, text, or add features like "Remember Me"

### Add More Users:
- Create additional accounts in Supabase dashboard
- All accounts will have admin access

## 🔍 Troubleshooting

### "Invalid login credentials" error:
- Check email/password are correct
- Verify user exists in Supabase dashboard
- Ensure email confirmation is disabled

### Infinite loading on login:
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Check network tab for failed requests

### Can't access admin panel:
- Try logging out and back in
- Clear browser cache/cookies
- Check if user session exists in Supabase

### Authentication not working:
- Verify AuthProvider wraps the app in `App.tsx`
- Check that ProtectedRoute is used correctly
- Ensure Supabase Auth is enabled

## 📱 Mobile Considerations

The login page is fully responsive and works on all devices. The authentication state is maintained across mobile browsers.

## 🚀 Production Deployment

When deploying to production:
1. **Update credentials**: Change from test email to real couple email
2. **Enable email confirmation**: For added security (optional)
3. **Set up custom domain**: Configure Supabase auth with your domain
4. **Test thoroughly**: Verify all auth flows work in production

## 🔐 Security Best Practices

1. **Strong passwords**: Use complex passwords for the couple account
2. **Regular logout**: Don't stay logged in on shared devices
3. **Monitor access**: Check Supabase auth logs for suspicious activity
4. **Backup access**: Consider having backup admin credentials

---

Your wedding registry now has secure authentication! The couple can safely manage their registry while guests continue to have seamless access.
