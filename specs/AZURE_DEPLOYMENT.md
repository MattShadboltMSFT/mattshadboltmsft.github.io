# Azure Deployment Guide - Jays Footy Stats

Complete guide for deploying the Jays Footy Stats application to **Azure Static Web Apps** (Free Tier Available).

## Why Azure Static Web Apps?

- ✅ **Free Tier Available** - Perfect for this application
- ✅ **Automatic CI/CD** - GitHub Actions integration included
- ✅ **Custom Domains** - Free SSL certificates
- ✅ **Global CDN** - Fast worldwide performance
- ✅ **PWA Support** - Full Progressive Web App capabilities

## Free Tier Limits

The Azure Static Web Apps Free tier includes:
- **100 GB bandwidth/month** - More than enough for this app
- **0.5 GB storage** - Plenty for the application
- **2 custom domains** - Can add your own domain
- **Unlimited staging environments** - PR previews
- **No credit card required** to start

## Prerequisites

- GitHub account (you already have this ✅)
- Azure account (free to create)
- This repository

## Option 1: Deploy via Azure Portal (Easiest - 5 minutes)

### Step 1: Create Azure Account (if needed)

1. Go to https://azure.microsoft.com/free
2. Click "Start free"
3. Sign in with GitHub, Microsoft, or create new account
4. No credit card required for free tier
5. Complete account setup

### Step 2: Create Static Web App

1. **Go to Azure Portal**
   - Visit https://portal.azure.com
   - Sign in with your account

2. **Create Resource**
   - Click "+ Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

3. **Configure Basics**
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new → "jays-footy-stats-rg"
   - **Name**: `jays-footy-stats` (must be globally unique, add suffix if needed)
   - **Plan type**: **Free** ✅
   - **Region**: Choose closest to you (e.g., "East US 2")
   - Click "Next: Deployment"

4. **Configure Deployment**
   - **Source**: GitHub
   - Click "Sign in with GitHub"
   - **Organization**: MattShadboltMSFT
   - **Repository**: mattshadboltmsft.github.io
   - **Branch**: main
   
5. **Build Details**
   - **Build Presets**: Custom
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `dist`

6. **Review and Create**
   - Review settings
   - Click "Create"
   - Wait 2-3 minutes for deployment

### Step 3: Access Your App

1. Once deployment completes, go to resource
2. Click "Browse" or copy URL
3. Your app is live! 🎉
4. URL format: `https://[your-app-name].azurestaticapps.net`

### Step 4: Configure Custom Domain (Optional)

1. In your Static Web App, go to "Custom domains"
2. Click "+ Add"
3. Choose "Custom domain on other DNS"
4. Follow DNS configuration instructions

---

## Option 2: Deploy via GitHub Actions (Automated)

The repository already includes Azure Static Web Apps workflow configuration.

### Setup Steps

1. **Create Static Web App in Azure Portal**
   - Follow Option 1, Steps 1-2 (through step 6)
   - Azure will automatically add deployment token to GitHub

2. **Or manually add deployment token**
   - Go to your Static Web App in Azure Portal
   - Click "Manage deployment token"
   - Copy the token
   - Go to GitHub repository Settings → Secrets and variables → Actions
   - Create new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste the token
   - Save

3. **Trigger Deployment**
   - Push to main branch, or
   - Workflow will auto-run on PR
   - Check Actions tab for deployment status

4. **Verify Deployment**
   - Go to Azure Portal → Your Static Web App
   - Click "Browse"
   - App should be live

**Workflow File**: `.github/workflows/azure-static-web-apps.yml` ✅ Already configured!

---

## Option 3: Deploy via Azure CLI

For developers who prefer command line:

### Install Azure CLI

```bash
# macOS
brew install azure-cli

# Windows
winget install Microsoft.AzureCLI

# Linux/WSL
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Login and Deploy

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name jays-footy-stats-rg --location eastus2

# Create Static Web App
az staticwebapp create \
  --name jays-footy-stats \
  --resource-group jays-footy-stats-rg \
  --source https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --sku Free \
  --login-with-github

# Get deployment token
az staticwebapp secrets list \
  --name jays-footy-stats \
  --resource-group jays-footy-stats-rg \
  --query "properties.apiKey" -o tsv

# Copy token to GitHub Secrets
```

---

## Configuration Files

All configuration files are already included:

### `staticwebapp.config.json`
- SPA routing configuration
- Security headers (X-Frame-Options, CSP, etc.)
- Cache control for assets
- MIME type mappings
- Service worker caching rules

This file is automatically used by Azure Static Web Apps.

---

## Post-Deployment

### Verify Everything Works

1. **Basic Functionality**
   ```
   - [ ] Home page loads
   - [ ] Can navigate to all pages
   - [ ] "Load Test Data" works (17 matches)
   - [ ] Dashboard shows charts
   - [ ] Match entry form works
   - [ ] CSV export works
   - [ ] PDF export works
   ```

2. **PWA Features**
   ```
   - [ ] Service worker registers
   - [ ] App installable on mobile
   - [ ] Works offline (test in DevTools)
   ```

3. **Performance**
   - Run Lighthouse test
   - Target: Performance 90+, PWA 100

### Monitor Your App

1. **Azure Portal → Your Static Web App**
   - View deployment history
   - Check build logs
   - Monitor bandwidth usage
   - View custom domain status

2. **GitHub Actions**
   - Check deployment status
   - View build logs
   - PR preview deployments

---

## GitHub Pages Alternative (Also Free)

If you prefer GitHub Pages instead of Azure:

### Quick Setup

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Save

2. **Push to Main**
   - Workflow will auto-deploy
   - Check Actions tab for status

3. **Access Your App**
   - URL: `https://mattshadboltmsft.github.io/`
   - Or custom domain if configured

**Workflow File**: `.github/workflows/deploy.yml` ✅ Already configured!

### Differences: Azure vs GitHub Pages

| Feature | Azure Static Web Apps (Free) | GitHub Pages |
|---------|------------------------------|--------------|
| **Custom Domains** | ✅ 2 free with SSL | ✅ 1 free with SSL |
| **PR Previews** | ✅ Automatic | ❌ No |
| **Global CDN** | ✅ Built-in | ✅ Built-in |
| **Build Minutes** | Unlimited | Unlimited |
| **Bandwidth** | 100 GB/month | 100 GB/month |
| **Storage** | 0.5 GB | 1 GB |
| **Custom Domains** | Easy setup | Easy setup |
| **Authentication** | ✅ Built-in (future) | ❌ No |

**Recommendation**: 
- **Azure Static Web Apps** - Best for production, PR previews, future API needs
- **GitHub Pages** - Simplest setup, still excellent performance

---

## Troubleshooting

### Build Fails in Azure

1. Check build logs in Azure Portal
2. Verify Node.js version (should be 20+)
3. Check build command: `npm run build`
4. Verify output directory: `dist`

### App Not Loading

1. Check that app location is `/`
2. Verify output location is `dist`
3. Check browser console for errors
4. Ensure `staticwebapp.config.json` is deployed

### Routing Issues (404 on page refresh)

- Should not happen - `staticwebapp.config.json` handles SPA routing
- If it does, check that config file is in the output directory

### Service Worker Not Working

- Azure Static Web Apps requires HTTPS (automatic)
- Clear browser cache and service worker
- Check Application tab in DevTools

---

## Costs

### Free Tier (Recommended)
- **$0/month** ✅
- Perfect for this application
- 100 GB bandwidth/month
- 0.5 GB storage
- 2 custom domains

### Standard Tier
- Only needed if you exceed free tier limits
- Unlikely for this application
- ~$9/month if needed

---

## Next Steps

1. **Deploy Now**
   - Choose Option 1 (Azure Portal) for easiest setup
   - Takes ~5 minutes
   - No credit card required

2. **Test Your Deployment**
   - Load test data
   - Verify all features work
   - Test on mobile device

3. **Add Custom Domain** (Optional)
   - Configure in Azure Portal
   - Free SSL certificate included

4. **Share Your App**
   - Share the Azure URL with users
   - Install as PWA on devices

---

## Support

- **Azure Static Web Apps Docs**: https://learn.microsoft.com/azure/static-web-apps/
- **GitHub Actions Integration**: https://learn.microsoft.com/azure/static-web-apps/github-actions-workflow
- **Free Tier Details**: https://azure.microsoft.com/pricing/details/app-service/static/

---

## Summary

**Recommended Path for Free Deployment:**

1. ✅ Create free Azure account (no credit card)
2. ✅ Deploy via Azure Portal (5 minutes)
3. ✅ App automatically deploys from GitHub
4. ✅ Get free `*.azurestaticapps.net` URL
5. ✅ Add custom domain if desired (free SSL)

**Alternative:** GitHub Pages is also free and takes 2 minutes to enable in repository settings.

Both options are excellent and completely free for this application!

---

**Last Updated**: November 5, 2025  
**Status**: Ready to Deploy ✅  
**Cost**: $0/month (Free Tier) 💰
