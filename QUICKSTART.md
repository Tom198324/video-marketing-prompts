# ⚡ Quick Start Guide - Deploy in 15 Minutes

This guide will get your Video Marketing Prompts application live on Vercel in about 15 minutes.

---

## 📋 What You Need

- GitHub account
- Vercel account (sign up with GitHub)
- PlanetScale account (for database)

All are **free** - no credit card required!

---

## 🚀 5-Step Deployment

### Step 1: Create PlanetScale Database (3 min)

1. Go to https://planetscale.com/signup
2. Create account with GitHub
3. Click "New database" → Name it `video-marketing-prompts`
4. Click "Connect" → Copy the connection string
5. Save it somewhere safe!

### Step 2: Upload to GitHub (3 min)

1. Go to https://github.com/new
2. Name: `video-marketing-prompts`
3. Make it Public
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag and drop all project files
7. Click "Commit changes"

### Step 3: Deploy to Vercel (5 min)

1. Go to https://vercel.com/new
2. Click "Import" next to your GitHub repo
3. Click "Deploy" (don't change anything yet)
4. Wait for build to complete
5. You'll get a URL like: `https://your-project.vercel.app`

### Step 4: Add Database Connection (2 min)

1. In Vercel, go to your project
2. Click "Settings" → "Environment Variables"
3. Add variable:
   - Name: `DATABASE_URL`
   - Value: Your PlanetScale connection string (from Step 1)
4. Click "Save"
5. Go to "Deployments" → Click "..." → "Redeploy"

### Step 5: Import Prompts Data (2 min)

1. Go to PlanetScale → Your database → "Console"
2. Copy and paste the SQL from `database_import.sql`
3. Or run the import script locally:
   ```bash
   export DATABASE_URL="your-connection-string"
   npx tsx scripts/import_english_prompts.ts
   ```

---

## ✅ Done!

Visit your Vercel URL - your site is now live with all 50 prompts!

---

## 🆘 Troubleshooting

**Site shows "No prompts"?**
→ Complete Step 5 (import prompts data)

**Build failed?**
→ Check Vercel build logs, make sure all files were uploaded to GitHub

**Database error?**
→ Verify `DATABASE_URL` in Vercel environment variables

---

## 📚 Need More Details?

See the complete guide: `VERCEL_DEPLOYMENT.md`

---

**🎉 Congratulations! Your site is live!**
