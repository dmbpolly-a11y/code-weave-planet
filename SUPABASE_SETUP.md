# Supabase + Google OAuth Setup Guide

## Overview
This guide walks you through setting up Supabase authentication with Google OAuth for Code-Weave Planet.

## Prerequisites
- Supabase account (free tier available)
- Google Cloud project
- Vercel account (for deployment)

---

## 1. Create Supabase Project

### A. Sign up to Supabase
1. Visit [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email

### B. Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Project name**: `code-weave-planet`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Select closest to your location
3. Click **"Create new project"** and wait 2-3 minutes

### C. Get Your Credentials
1. Once the project loads, click **Settings** (bottom left)
2. Go to **API** tab
3. Copy these values:
   - **Project URL** (e.g., `https://xxxx.supabase.co`) → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 2. Set Up Google OAuth

### A. Create Google Cloud Project
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project:
   - Click project dropdown at top
   - Click **"NEW PROJECT"**
   - Name: `Code Weave Planet`
   - Click **"CREATE"**

### B. Enable Google+ API
1. Search for **"Google+ API"** in the search bar
2. Click it and press **"ENABLE"**

### C. Create OAuth Credentials
1. Go to **Credentials** (left sidebar)
2. Click **"Create Credentials"** > **OAuth 2.0 Client ID**
3. If prompted, configure the OAuth consent screen first:
   - Click **"Create Consent Screen"**
   - Choose **"External"**
   - Fill in:
     - **App name**: `Code Weave Planet`
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **"SAVE AND CONTINUE"** through all screens
4. Back in Credentials:
   - Choose **Web Application**
   - Name: `Code Weave Planet Web`
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:5173/auth/callback
   https://yourusername.vercel.app/auth/callback
   ```
   *(Replace `yourusername` with your Vercel username)*
6. Click **"CREATE"**
7. Copy your:
   - **Client ID**
   - **Client Secret**

### D. Connect to Supabase
1. Go back to Supabase dashboard
2. Click **Authentication** (left sidebar)
3. Go to **Providers** tab
4. Find and click **Google**
5. Toggle **Enable** to turn it on
6. Paste your:
   - **Client ID** from Google Cloud
   - **Client Secret** from Google Cloud
7. Click **"Save"**

---

## 3. Local Development Setup

### A. Create .env.local File
In your project root, create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Supabase.

### B. Install Dependencies
```bash
npm install
```

### C. Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- Register with email/password
- Login with email/password
- Login with Google

---

## 4. Deploy to Vercel

### A. Push Code to GitHub
```bash
git add .
git commit -m "Add Supabase authentication"
git push origin main
```

### B. Deploy on Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository: `code-weave-planet`
4. In **Environment Variables**, add:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://your-project.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `your-anon-key-here`
5. Click **"Deploy"**

### C. Update Google OAuth
After Vercel gives you a domain (e.g., `code-weave-planet-abc.vercel.app`):
1. Go to Google Cloud Console
2. Go to **Credentials** > Your OAuth app
3. Update **Authorized redirect URIs**:
   ```
   https://code-weave-planet-abc.vercel.app/auth/callback
   ```
4. Save

---

## 5. Testing Authentication

### Email/Password Flow
1. Go to `/register`
2. Enter email and password
3. You should receive a confirmation email
4. Confirm email and login

### Google OAuth Flow
1. Go to `/login` or `/register`
2. Click **"Sign in with Google"** or **"Sign up with Google"**
3. You'll be redirected to Google to authenticate
4. You'll be redirected back and logged in

---

## Troubleshooting

### "Environment variables not found"
- Make sure `.env.local` exists in your project root
- Restart `npm run dev`
- Check spelling of variable names (must start with `VITE_`)

### "Google OAuth not working"
- Verify redirect URIs match your local/Vercel URL
- Check that Google+ API is enabled
- Verify Client ID and Secret are correct in Supabase

### "Email confirmation not sending"
- Check Supabase email settings (Authentication > Email Templates)
- By default, Supabase uses its own email service
- In production, configure your own email provider

### Still having issues?
- Check browser console for error messages
- Check Supabase logs: Authentication > Logs
- Visit [Supabase Docs](https://supabase.com/docs)

---

## Environment Variables Summary

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `VITE_SUPABASE_URL` | Supabase > Settings > API > Project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Settings > API > anon public | `eyJhbGc...` |
| Google Client ID | Google Cloud > Credentials | `1234567890-abc...apps.googleusercontent.com` |
| Google Client Secret | Google Cloud > Credentials | `GOCSP...` |

---

## Next Steps

After successful deployment, you can:
1. Enable email notifications
2. Add more OAuth providers (GitHub, Discord, etc.)
3. Set up database tables for user profiles
4. Configure role-based access control
5. Add custom email templates

For more info, visit [Supabase Documentation](https://supabase.com/docs)
