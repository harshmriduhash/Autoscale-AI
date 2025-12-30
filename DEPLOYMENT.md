# Deployment Guide - Autoscale-AI

This guide will help you deploy Autoscale-AI to Vercel.

## Prerequisites

1. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your PostgreSQL connection string from Settings > Database

2. **GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `https://your-app.vercel.app/api/auth/callback/github`
   - Copy Client ID and Client Secret

3. **OpenAI API Key**
   - Sign up at [openai.com](https://openai.com)
   - Get your API key from the dashboard

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables

In Vercel project settings, add these environment variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]
GITHUB_CLIENT_ID=[Your GitHub Client ID]
GITHUB_CLIENT_SECRET=[Your GitHub Client Secret]
OPENAI_API_KEY=[Your OpenAI API Key]
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Update GitHub OAuth Callback URL

After deployment, update your GitHub OAuth App callback URL to:
```
https://your-app.vercel.app/api/auth/callback/github
```

### 5. Run Database Migrations

After first deployment, you can run migrations via Vercel CLI or Supabase dashboard:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma db push
```

Or use Supabase SQL Editor to run the Prisma schema.

### 6. Verify Deployment

1. Visit your Vercel deployment URL
2. Click "Sign In with GitHub"
3. Authorize the app
4. Create a test project
5. Deploy it!

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure connection pooling is enabled if using Supabase

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check `NEXTAUTH_SECRET` is set
- Ensure GitHub OAuth callback URL matches your domain

### Build Failures
- Check all environment variables are set
- Verify Node.js version (should be 18+)
- Check build logs in Vercel dashboard

### OpenAI API Issues
- Verify API key is correct
- Check API usage limits
- Ensure you have credits in your OpenAI account

## Post-Deployment

1. **Set up Custom Domain** (Optional)
   - Add your domain in Vercel project settings
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

2. **Enable Analytics** (Optional)
   - Enable Vercel Analytics in project settings

3. **Set up Monitoring** (Optional)
   - Configure Sentry or similar error tracking
   - Set up uptime monitoring

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_URL` | Your app's public URL | `https://app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth (32+ chars) | Generated secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | `abc123...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | `def456...` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL (same as NEXTAUTH_URL) | `https://app.vercel.app` |

## Support

For issues or questions, please open an issue on GitHub.
