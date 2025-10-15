# Auth Setup Guide

## The Problem

Your authentication was failing because:
1. `CONVEX_SITE_URL` was incorrectly set to `http://localhost:3000` in `.env.local`
2. The Convex `SITE_URL` environment variable was set to your production domain
3. After OAuth, users were redirected to production instead of localhost

## How Convex Auth Works

```
User clicks "Sign In with Discord"
    ↓
Redirected to Discord OAuth
    ↓
Discord redirects to: https://determined-bird-322.convex.cloud/api/auth/callback/discord
    ↓
Convex processes the auth
    ↓
Convex redirects to: [SITE_URL environment variable]
    ↓
User lands on your app with auth token
```

## OAuth Callback URLs (Set in Discord/Google dashboards)

These URLs tell Discord/Google where to send users after they approve:

- **Discord**: `https://determined-bird-322.convex.cloud/api/auth/callback/discord`
- **Google**: `https://determined-bird-322.convex.cloud/api/auth/callback/google`

**These never change** - they always point to your Convex deployment.

## SITE_URL (Set in Convex deployment)

This tells Convex where to redirect users AFTER it processes the OAuth:

- **For local development**:
  ```bash
  npx convex env set SITE_URL http://localhost:3000
  ```

- **For production**:
  ```bash
  npx convex env set SITE_URL https://shadowdark.dustatron.com
  ```

**You switch this** depending on where you're testing.

## Current Status

✅ Fixed `.env.local` - removed incorrect `CONVEX_SITE_URL`
✅ Set Convex `SITE_URL` to `http://localhost:3000` for local testing
✅ Updated `auth.config.ts` to remove incorrect configuration

## What You Need to Do

### 1. Update Discord OAuth Callback URL

Go to: https://discord.com/developers/applications/1427113393361387550/oauth2

Make sure the **Redirect URL** is:
```
https://determined-bird-322.convex.cloud/api/auth/callback/discord
```

### 2. Update Google OAuth Callback URL

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth client (ID: `119402082356-t6pj82iogp9pnm9r6n2vug6neh5265gq`)

Make sure one of the **Authorized redirect URIs** is:
```
https://determined-bird-322.convex.cloud/api/auth/callback/google
```

### 3. Test the Auth Flow

1. Restart your dev server if it's running:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Click "Sign In" → Choose Discord or Google
4. After approving, you should be redirected back to localhost:3000 and see your user menu

### 4. When Deploying to Production

Before deploying, switch SITE_URL back to production:
```bash
npx convex env set SITE_URL https://shadowdark.dustatron.com
```

The OAuth callback URLs in Discord/Google never need to change - they always point to Convex.

## Troubleshooting

If auth still doesn't work:

1. **Check browser console** for errors
2. **Check Convex logs**: Go to https://dashboard.convex.dev and look for errors in the logs
3. **Verify environment variables**:
   ```bash
   npx convex env list
   ```
   Should show `SITE_URL=http://localhost:3000`

4. **Clear browser cookies** and try again - old auth tokens might be cached
