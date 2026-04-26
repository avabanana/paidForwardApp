# Supabase Setup Instructions

## Current Status
The app is currently using a **mock authentication system** for development and testing. This allows you to test the login functionality locally.

## To Set Up Real Supabase (Recommended for Production)

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login to your account
   - Click "New Project"
   - Choose your organization and enter project details

2. **Get Your Project Credentials:**
   - Go to Settings → API in your Supabase dashboard
   - Copy the "Project URL" and "anon/public" key

3. **Update the Configuration:**
   - Open `src/supabaseClient.js`
   - Replace the mock client with real Supabase credentials:
   ```javascript
   const supabaseUrl = 'https://your-project-id.supabase.com'
   const supabaseKey = 'your-anon-key'
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

4. **Set Up Database Tables:**
   Create a `users` table in your Supabase database with these columns:
   - `id` (uuid, primary key)
   - `username` (text)
   - `email` (text)
   - `xp` (integer, default: 0)
   - `gameWins` (integer, default: 0)
   - `gamesPlayed` (integer, default: 0)
   - `coursesCompleted` (integer, default: 0)
   - `streak` (integer, default: 0)
   - `tier` (text, default: 'adult')
   - `birthYear` (integer)
   - `courseProgressMap` (jsonb, default: '{}')
   - `achievements` (jsonb, default: '[]')
   - `lastLogin` (date)

5. **Enable Row Level Security (RLS):**
   - In your Supabase dashboard, go to Authentication → Policies
   - Enable RLS on the users table
   - Create policies to allow users to read/write their own data

## Local Development with Supabase CLI

For local development, you can also use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local Supabase
supabase init

# Start local Supabase
supabase start

# Update your config to use local URLs
const supabaseUrl = 'http://localhost:54321'
const supabaseKey = 'your-local-anon-key'
```

## Current Mock Authentication

The mock system allows:
- ✅ Sign up with email/password/username/birth year
- ✅ Sign in with email/password
- ✅ Sign out
- ✅ Persistent sessions (stored in localStorage)
- ✅ User data storage/retrieval

**Note:** Mock data is stored locally and will be lost when you clear browser storage.