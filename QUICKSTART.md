# Quick Start Guide - Autoscale-AI

Get Autoscale-AI up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] GitHub OAuth App created
- [ ] OpenAI API key obtained

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready (takes ~2 minutes)
3. Go to Settings > Database
4. Copy the connection string (Connection Pooling or Direct Connection)
5. Replace `[YOUR-PASSWORD]` with your database password

## Step 3: Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Autoscale-AI (or your choice)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

## Step 4: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-`)

## Step 5: Create Environment File

Create a `.env` file in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 6: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 7: Run Development Server

```bash
npm run dev
```

## Step 8: Open Your Browser

Visit [http://localhost:3000](http://localhost:3000)

## Step 9: Sign In and Test

1. Click "Sign In with GitHub"
2. Authorize the application
3. Create a new project
4. Deploy it!

## Troubleshooting

### Database Connection Error
- Verify your `DATABASE_URL` is correct
- Check Supabase project is active
- Try using Connection Pooling URL instead

### GitHub OAuth Error
- Verify callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
- Check Client ID and Secret are correct

### OpenAI API Error
- Verify API key is correct
- Check you have credits in your OpenAI account
- Ensure API key has proper permissions

### Build Errors
- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall
- Check Node.js version: `node --version` (should be 18+)

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Vercel
- Check [README.md](./README.md) for full documentation
- Explore the codebase to understand the architecture

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub if you encounter problems

