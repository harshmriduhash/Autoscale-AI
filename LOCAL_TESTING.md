# Local Testing Guide - Autoscale-AI

Follow these steps to run and test Autoscale-AI locally on your machine.

## Prerequisites Check

✅ **Node.js**: v22.16.0 (installed - good!)
✅ **Dependencies**: Already installed

## Step-by-Step Setup

### Step 1: Create Environment File

Create a `.env` file in the root directory (`G:\Vercel-AI\.env`):

```env
# Database (Supabase) - Get this from your Supabase project
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here-generate-with-openssl"

# GitHub OAuth - Get these from GitHub Developer Settings
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI - Get this from OpenAI Platform
OPENAI_API_KEY="sk-your-openai-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 2: Get Required Credentials

#### A. Supabase Database URL
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait ~2 minutes for database to be ready
4. Go to **Settings** → **Database**
5. Copy the **Connection string** (use "Connection Pooling" or "Direct connection")
6. Replace `[YOUR-PASSWORD]` with your database password

#### B. GitHub OAuth Credentials
1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Autoscale-AI` (or any name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

#### C. OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)

#### D. Generate NextAuth Secret
Run this command in your terminal:
```bash
openssl rand -base64 32
```
Copy the output and use it as `NEXTAUTH_SECRET`

### Step 3: Set Up Database Schema

Once you have your `.env` file with `DATABASE_URL`:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

This will create all the necessary tables in your Supabase database.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### Step 5: Open in Browser

Visit: **http://localhost:3000**

## Testing the Application

### 1. Test Authentication
- Click **"Sign In"** or **"Get Started"**
- Click **"Sign in with GitHub"**
- Authorize the application
- You should be redirected to the dashboard

### 2. Test Project Creation
- Click **"New Project"** button
- Fill in the form:
  - **Project Name**: `test-project`
  - **Description**: `My test project`
  - **Framework**: Select one (e.g., Next.js)
  - **Build Command**: `npm run build` (optional)
  - **Output Directory**: `.next` (optional)
- Click **"Create Project"**
- You should see the project detail page

### 3. Test Deployment
- On the project detail page, click **"Deploy"**
- You should be redirected to the deployment page
- Watch the logs appear in real-time
- Wait for deployment to complete (takes ~10 seconds)
- You should see a deployment URL

### 4. Test AI Features
- On the deployment page, check the **"AI Insights"** section
- You should see:
  - AI optimization suggestions
  - Log summarization
  - Scaling predictions

### 5. Test Project Management
- Go back to project detail page
- Click **"Edit"** to modify project settings
- Click **"Delete"** to delete a project (with confirmation)

### 6. Test Rollback
- Create another deployment
- On the deployment page, click **"Rollback"**
- A new deployment should be created with the previous version

## Quick Commands Reference

```bash
# Install dependencies (already done)
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Kill process on port 3000 (Windows PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Error
- Verify `DATABASE_URL` in `.env` is correct
- Check Supabase project is active
- Try using "Connection Pooling" URL instead of "Direct connection"
- Make sure password doesn't have special characters that need URL encoding

### GitHub OAuth Not Working
- Verify callback URL is exactly: `http://localhost:3000/api/auth/callback/github`
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Make sure no extra spaces in `.env` file

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is correct (starts with `sk-`)
- Check you have credits in your OpenAI account
- The app will work without OpenAI but AI features will show mock data

### Prisma Errors
- Make sure `DATABASE_URL` is set in `.env`
- Run `npx prisma generate` first
- Then run `npx prisma db push`

### Build Errors
- Delete `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Delete `node_modules`: `rm -rf node_modules` (or `rmdir /s node_modules` on Windows)
- Reinstall: `npm install`
- Regenerate Prisma: `npx prisma generate`

## What to Test

✅ **Authentication Flow**
- Sign in with GitHub
- Session persistence
- Sign out

✅ **Project CRUD**
- Create project
- View project details
- Edit project
- Delete project

✅ **Deployment Flow**
- Start deployment
- View real-time logs
- Check deployment status
- View deployment URL

✅ **AI Features**
- Optimization suggestions
- Error detection
- Log summarization
- Scaling predictions

✅ **Rollback**
- Rollback to previous deployment
- Verify version increments

## Next Steps

Once local testing is successful:
1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment
2. Check [README.md](./README.md) for full documentation
3. Explore the codebase to understand the architecture

## Need Help?

- Check console logs in browser (F12)
- Check terminal output for server errors
- Review [QUICKSTART.md](./QUICKSTART.md) for detailed setup
- Check [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for verification steps
