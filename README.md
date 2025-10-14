# Shadowdark GM Tools

A web application providing game master tools for the Shadowdark RPG system. Built with modern web technologies for a fast, real-time experience.

## Tech Stack

- **Frontend**: [TanStack Start](https://tanstack.com/start) (file-based routing), React 19, TailwindCSS 4
- **Backend**: [Convex](https://convex.dev) (real-time database and backend functions)
- **Authentication**: Convex Auth with Discord OAuth
- **Build Tool**: Vite
- **Language**: TypeScript

## Features

- Discord authentication for saving and sharing GM content
- Real-time data synchronization across devices
- User profiles with preferences (theme, favorite tables)
- Monster and spell lookup (public)
- Save personal campaigns and prep work (authenticated users only)

## Prerequisites

- Node.js 18+ and npm
- A Convex account (free at [convex.dev](https://convex.dev))
- A Discord application for OAuth (free at [Discord Developer Portal](https://discord.com/developers/applications))

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd gm-tools
npm install
```

### 2. Set Up Convex

```bash
# Login to Convex (creates account if needed)
npx convex login

# Initialize Convex project (follow prompts)
npx convex dev
```

This will create a `.env.local` file with your `CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL`.

### 3. Set Up Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to **OAuth2** settings in the sidebar
4. Under **Redirects**, add:
   ```
   https://YOUR-DEPLOYMENT.convex.site/api/auth/callback/discord
   ```
   (Replace `YOUR-DEPLOYMENT` with your Convex deployment URL from `.env.local`)
5. Copy your **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Add to your `.env.local`:

```bash
# Site URL for local development
CONVEX_SITE_URL=http://localhost:3000

# Discord OAuth credentials
AUTH_DISCORD_ID=your-client-id-here
AUTH_DISCORD_SECRET=your-client-secret-here
```

Set the Discord credentials on your Convex deployment:

```bash
npx convex env set AUTH_DISCORD_ID your-client-id-here
npx convex env set AUTH_DISCORD_SECRET your-client-secret-here
npx convex env set SITE_URL http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

This starts both the Convex dev server and the web dev server. The app will be available at:

- Web app: http://localhost:3000
- Convex dashboard: https://dashboard.convex.dev

## Development Commands

```bash
# Start both Convex and web dev servers
npm run dev

# Start individual servers
npm run dev:web      # Vite dev server only (port 3000)
npm run dev:convex   # Convex dev server only
npm run dev:ts       # TypeScript watch mode

# Build for production
npm run build

# Format code
npm run format
```

## Project Structure

```
gm-tools/
├── convex/              # Convex backend functions
│   ├── auth.ts          # Auth configuration
│   ├── schema.ts        # Database schema
│   ├── userProfiles.ts  # User profile functions
│   └── ...
├── src/
│   ├── components/      # React components
│   │   ├── AuthStatus.tsx
│   │   ├── SignIn.tsx
│   │   └── SignOut.tsx
│   ├── routes/          # File-based routes
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Home page
│   │   └── ...
│   ├── router.tsx       # Router configuration
│   └── main.tsx         # App entry point
└── .env.local           # Environment variables (not committed)
```

## Authentication

The app uses Discord OAuth for authentication:

- **Public features**: Search monsters and spells (no login required)
- **Authenticated features**: Save campaigns, prep work, and preferences

Users can sign in with Discord using the button in the header. The authentication state is managed by Convex Auth and persists across sessions.

## Deployment

### Deploy Backend (Convex)

```bash
npx convex deploy
```

### Deploy Frontend

The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.). Make sure to:

1. Set the production `VITE_CONVEX_URL` environment variable
2. Update Discord OAuth redirect URL for production:
   ```
   https://YOUR-PRODUCTION-DEPLOYMENT.convex.site/api/auth/callback/discord
   ```
3. Set production environment variables on Convex:
   ```bash
   npx convex env set SITE_URL https://your-production-domain.com --prod
   npx convex env set AUTH_DISCORD_ID your-client-id --prod
   npx convex env set AUTH_DISCORD_SECRET your-client-secret --prod
   ```

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Shadowdark RPG](https://www.thearcanelibrary.com/pages/shadowdark)

## License

[Add your license here]
