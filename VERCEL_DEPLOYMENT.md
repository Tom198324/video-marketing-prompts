# 🚀 Vercel Deployment Guide - Video Marketing Prompts

This guide will help you deploy your Video Marketing Prompts application permanently on Vercel.

---

## 📋 Prerequisites

Before starting, you need:

1. **GitHub Account** - [Sign up here](https://github.com/signup)
2. **Vercel Account** - [Sign up here](https://vercel.com/signup) (use your GitHub account)
3. **PlanetScale Account** (for MySQL database) - [Sign up here](https://planetscale.com/signup)

All services have **free tiers** that are sufficient for this project.

---

## 🗄️ Step 1: Set Up Production Database (PlanetScale)

### Why PlanetScale?
- Free MySQL-compatible database
- Serverless (scales automatically)
- Works perfectly with Vercel
- No credit card required for free tier

### Instructions:

1. **Create PlanetScale Account**
   - Go to https://planetscale.com/signup
   - Sign up with GitHub

2. **Create New Database**
   - Click "New database"
   - Name: `video-marketing-prompts`
   - Region: Choose closest to your users
   - Click "Create database"

3. **Get Connection String**
   - Click "Connect"
   - Select "Prisma" or "General"
   - Copy the connection string (format: `mysql://user:pass@host/database?sslaccept=strict`)
   - **Save this string** - you'll need it for Vercel

4. **Create Database Schema**
   - Go to "Console" tab in PlanetScale
   - Run this SQL:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE prompts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promptNumber INT NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  scenarioType VARCHAR(100) NOT NULL,
  industrySector VARCHAR(100) NOT NULL,
  visualStyle VARCHAR(100) NOT NULL,
  durationSeconds INT NOT NULL,
  originalDuration INT NOT NULL,
  promptJson MEDIUMTEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  promptId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (promptId) REFERENCES prompts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (userId, promptId)
);

CREATE TABLE generated_variations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  originalPromptId INT NOT NULL,
  variationJson MEDIUMTEXT NOT NULL,
  parameters TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (originalPromptId) REFERENCES prompts(id) ON DELETE CASCADE
);
```

5. **Import Prompts Data**
   - You'll need to import the 50 prompts after deployment
   - Instructions provided in Step 4 below

---

## 📦 Step 2: Push Project to GitHub

1. **Create New GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `video-marketing-prompts`
   - Make it **Public** or **Private** (your choice)
   - **Do NOT** initialize with README
   - Click "Create repository"

2. **Upload Your Project**
   
   **Option A: Using GitHub Web Interface (Easiest)**
   - Download the project ZIP from this task
   - Extract it on your computer
   - Go to your GitHub repository
   - Click "uploading an existing file"
   - Drag and drop all files
   - Commit changes

   **Option B: Using Git Command Line**
   ```bash
   cd video-marketing-english
   git init
   git add .
   git commit -m "Initial commit - English version"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/video-marketing-prompts.git
   git push -u origin main
   ```

---

## 🌐 Step 3: Deploy to Vercel

1. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository: `video-marketing-prompts`
   - Click "Import"

2. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `pnpm install`

3. **Add Environment Variables**
   
   Click "Environment Variables" and add these:

   | Name | Value | Notes |
   |------|-------|-------|
   | `DATABASE_URL` | Your PlanetScale connection string | From Step 1 |
   | `NODE_ENV` | `production` | Required |
   | `VITE_API_BASE_URL` | `/api` | API endpoint |
   | `OAUTH_CLIENT_ID` | Your Manus OAuth ID | Optional, for auth |
   | `OAUTH_CLIENT_SECRET` | Your Manus OAuth secret | Optional, for auth |
   | `OAUTH_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/callback` | Update after deployment |

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://video-marketing-prompts.vercel.app`

---

## 📊 Step 4: Import Prompts Data

After deployment, you need to import the 50 prompts into your PlanetScale database.

### Method 1: Using PlanetScale Console (Recommended)

1. Go to your PlanetScale database
2. Click "Console" tab
3. Upload and run the SQL import script (provided in `database_import.sql`)

### Method 2: Using the Import Script

1. **Install Dependencies Locally**
   ```bash
   cd video-marketing-english
   pnpm install
   ```

2. **Set Environment Variable**
   ```bash
   export DATABASE_URL="your-planetscale-connection-string"
   ```

3. **Run Import Script**
   ```bash
   npx tsx scripts/import_english_prompts.ts
   ```

4. **Verify Import**
   ```bash
   # Check in PlanetScale Console
   SELECT COUNT(*) FROM prompts;
   # Should return 50
   ```

---

## ✅ Step 5: Verify Deployment

1. **Visit Your Site**
   - Go to your Vercel URL
   - Check that the homepage loads

2. **Test Features**
   - Browse prompts page: `/prompts`
   - View a prompt detail: `/prompt/1`
   - Check filters work
   - Verify all 50 prompts are visible

3. **Check Console**
   - Open browser DevTools (F12)
   - Look for any errors in Console tab
   - Check Network tab for failed requests

---

## 🔧 Troubleshooting

### Issue: "No prompts found"
**Solution**: Import prompts data (Step 4)

### Issue: "Database connection failed"
**Solution**: 
- Check `DATABASE_URL` in Vercel environment variables
- Verify PlanetScale database is running
- Check connection string format

### Issue: "Build failed"
**Solution**:
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Try building locally first: `pnpm build`

### Issue: "404 on API routes"
**Solution**:
- Check `vercel.json` configuration
- Verify API routes in `server/routers.ts`
- Check `VITE_API_BASE_URL` environment variable

---

## 🔄 Making Updates

After initial deployment, any changes you push to GitHub will automatically redeploy:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Vercel automatically rebuilds and deploys
4. Check deployment status at https://vercel.com/dashboard

---

## 📈 Monitoring & Analytics

### Vercel Dashboard
- View deployment history
- Check build logs
- Monitor performance
- See visitor analytics

### PlanetScale Dashboard
- Monitor database queries
- Check storage usage
- View connection stats
- Manage backups

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Plans Start At |
|---------|-----------|---------------------|
| **Vercel** | 100GB bandwidth/month | $20/month |
| **PlanetScale** | 5GB storage, 1 billion row reads/month | $29/month |
| **GitHub** | Unlimited public repos | $4/month (private) |

**Total Cost for This Project**: **$0/month** (free tier is sufficient)

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Buy a domain (e.g., from Namecheap, Google Domains)
   - Add it in Vercel: Settings → Domains
   - Update DNS records

2. **Enable OAuth** (Optional)
   - Configure Manus OAuth in Vercel environment variables
   - Update redirect URI
   - Test login flow

3. **Add Analytics** (Optional)
   - Vercel Analytics (built-in)
   - Google Analytics
   - Plausible Analytics

4. **Set Up Monitoring**
   - Vercel provides basic monitoring
   - Consider Sentry for error tracking
   - Set up uptime monitoring (e.g., UptimeRobot)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

---

## 🆘 Support

If you encounter issues:

1. Check Vercel build logs
2. Check PlanetScale connection
3. Review this guide carefully
4. Check GitHub repository settings
5. Contact support:
   - Vercel: https://vercel.com/support
   - PlanetScale: https://planetscale.com/support

---

**🎉 Congratulations! Your Video Marketing Prompts application is now permanently deployed!**

*Last updated: November 27, 2025*
