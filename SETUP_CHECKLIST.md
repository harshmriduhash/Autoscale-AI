# Setup Checklist

Use this checklist to ensure everything is configured correctly before deployment.

## Pre-Deployment Checklist

### Environment Variables
- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your app URL (localhost for dev, Vercel URL for prod)
- [ ] `NEXTAUTH_SECRET` - Random 32+ character string
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- [ ] `OPENAI_API_KEY` - OpenAI API key (starts with `sk-`)
- [ ] `NEXT_PUBLIC_APP_URL` - Public app URL (same as NEXTAUTH_URL)

### Database Setup
- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Prisma schema pushed: `npx prisma db push`
- [ ] Prisma client generated: `npx prisma generate`

### GitHub OAuth Setup
- [ ] GitHub OAuth App created
- [ ] Callback URL configured correctly
- [ ] Client ID and Secret copied

### OpenAI Setup
- [ ] OpenAI account created
- [ ] API key generated
- [ ] API key has sufficient credits

### Local Development
- [ ] Dependencies installed: `npm install`
- [ ] Environment file created: `.env`
- [ ] Development server runs: `npm run dev`
- [ ] Can sign in with GitHub
- [ ] Can create a project
- [ ] Can deploy a project

### Vercel Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added to Vercel
- [ ] GitHub OAuth callback URL updated to Vercel domain
- [ ] Build succeeds on Vercel
- [ ] App is accessible at Vercel URL
- [ ] Can sign in on production
- [ ] Can create and deploy projects on production

## Testing Checklist

### Authentication
- [ ] Can sign in with GitHub
- [ ] Session persists after page refresh
- [ ] Can sign out
- [ ] Redirects to sign-in when not authenticated

### Projects
- [ ] Can create a new project
- [ ] Can view project details
- [ ] Can edit project
- [ ] Can delete project
- [ ] Projects list shows all user projects

### Deployments
- [ ] Can start a deployment
- [ ] Deployment status updates correctly
- [ ] Deployment logs appear in real-time
- [ ] Can view deployment details
- [ ] Can rollback to previous deployment
- [ ] Deployment URL is generated

### AI Features
- [ ] AI optimization suggestions appear
- [ ] AI log analysis works
- [ ] AI log summarization works
- [ ] AI scaling predictions appear

## Common Issues

### Database Connection
- **Issue:** Cannot connect to database
- **Solution:** Verify DATABASE_URL, check Supabase project status

### Authentication
- **Issue:** GitHub OAuth fails
- **Solution:** Check callback URL matches exactly, verify Client ID/Secret

### Build Failures
- **Issue:** Build fails on Vercel
- **Solution:** Check all environment variables are set, verify Node.js version

### OpenAI Errors
- **Issue:** AI features don't work
- **Solution:** Verify API key, check account has credits

## Post-Deployment

- [ ] Update GitHub OAuth callback URL to production domain
- [ ] Test all features on production
- [ ] Monitor error logs
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)

