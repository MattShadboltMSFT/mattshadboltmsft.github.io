# Deployment Guide - Jays Footy Stats

This guide provides step-by-step instructions for deploying the Jays Footy Stats application to various platforms.

## Prerequisites

Before deploying, ensure:
- ✅ Application builds successfully (`npm run build` in repository root)
- ✅ All tests pass
- ✅ Code is committed and pushed to GitHub

## Quick Links

- 🚀 **[Azure Deployment (FREE)](AZURE_DEPLOYMENT.md)** - Detailed Azure Static Web Apps guide
- ⚡ Vercel - Fast deployment (below)
- 🌐 Netlify - Alternative option (below)
- 📄 GitHub Pages - Simple and free (below)

## Deployment Options

### Option 1: Azure Static Web Apps (FREE - Recommended for Azure users)

**See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for complete Azure deployment guide.**

Azure Static Web Apps offers a generous free tier perfect for this application:
- ✅ **100% Free** - No credit card required
- ✅ **100 GB bandwidth/month** - More than enough
- ✅ **Automatic CI/CD** - GitHub Actions included
- ✅ **Custom domains** - Free SSL certificates
- ✅ **PR preview environments** - Test before merging

**Quick Start:**
1. Go to https://portal.azure.com
2. Create a resource → "Static Web Apps"
3. Select Free tier
4. Connect to GitHub repository
5. Set app location: `/`
6. Set output location: `dist`
7. Deploy!

Configuration files included: `staticwebapp.config.json`, `.github/workflows/azure-static-web-apps.yml`

---

### Option 2: Vercel (Fast & Easy)

Vercel provides the best experience for Vite/React applications with automatic deployments.

#### Method A: Deploy via GitHub Integration (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select the `MattShadboltMSFT/mattshadboltmsft.github.io` repository
   - Vercel will auto-detect the configuration

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Root Directory: **.**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

5. **Configure Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Method B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? jays-footy-stats
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

**Configuration**: The `vercel.json` file is already configured with:
- Build command and output directory
- SPA routing (all routes → index.html)
- Security headers
- Service worker caching rules

---

### Option 2: Netlify

Netlify is another excellent option with great PWA support.

#### Method A: Deploy via GitHub Integration

1. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign in with your GitHub account

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select the `MattShadboltMSFT/mattshadboltmsft.github.io` repository

3. **Configure Build Settings**
   - Base directory: **.**
   - Build command: **npm run build**
   - Publish directory: **dist**

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your app will be live at `https://random-name.netlify.app`

5. **Configure Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain

#### Method B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy

# For production deployment
netlify deploy --prod
```

#### Method C: Drag and Drop

1. Build the app locally:
   ```bash
   npm install
   npm run build
   ```

2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder to the upload area
4. Your site is live!

**Configuration**: The `netlify.toml` file is already configured with:
- Build command and publish directory
- SPA routing redirects
- Security headers
- Asset caching rules

---

### Option 3: GitHub Pages

GitHub Pages is free and works well for static sites.

#### Setup

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js (if needed)**
   
   For `username.github.io` repositories, no changes needed (served from root by default).
   
   For other repo names, add base URL:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/ (root)`
   - Save

6. **Access your site**
   - URL: `https://MattShadboltMSFT.github.io/`

**Note**: GitHub Pages may take a few minutes to go live after first deployment.

---

### Option 4: Azure Static Web Apps

If you prefer Azure:

1. **Install Azure CLI** (if not already installed)
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Create Static Web App**
   ```bash
   az staticwebapp create \
     --name jays-footy-stats \
     --resource-group your-resource-group \
     --source https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io \
     --location "East US 2" \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

4. **Or use Azure Portal**
   - Go to Azure Portal → Create a resource
   - Search "Static Web Apps" → Create
   - Link to GitHub repository
   - Configure build settings
   - Deploy

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Application loads successfully
- [ ] All pages are accessible (home, dashboard, match entry, history)
- [ ] Can add a new match
- [ ] Can load test data
- [ ] Charts display correctly on dashboard
- [ ] Export CSV works
- [ ] Export PDF works
- [ ] Offline functionality (disable network in DevTools)
- [ ] PWA installable (mobile devices)
- [ ] Responsive on mobile devices
- [ ] Service worker registered

## Testing Your Deployment

### Basic Functionality Test
```bash
# Open your deployed URL
# Example: https://jays-footy-stats.vercel.app

1. Click "Load Test Data" - should load 17 matches
2. Navigate to Dashboard - should show charts
3. Navigate to Match History - should list all matches
4. Click "New Match" - should open form
5. Try exporting CSV and PDF
```

### PWA Test
1. Open site on mobile device
2. Tap browser menu → "Add to Home Screen" or "Install"
3. App should install and open like native app
4. Test offline: Turn on airplane mode, app should still work

### Performance Test
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for Performance, PWA, Accessibility
4. Target scores: Performance 90+, PWA 100, Accessibility 90+

## Continuous Deployment

Once set up with Vercel or Netlify:
- Every push to `main` branch auto-deploys to production
- Pull request previews are automatically generated
- Rollbacks are instant if needed

## Custom Domain Setup

### For Vercel
1. Project Settings → Domains
2. Add your domain (e.g., `footystats.com`)
3. Add DNS records as instructed:
   - Type: A, Value: 76.76.21.21
   - Type: CNAME, Value: cname.vercel-dns.com

### For Netlify
1. Site Settings → Domain management
2. Add custom domain
3. Configure DNS:
   - Type: A, Value: 75.2.60.5
   - Type: CNAME, Value: [your-site].netlify.app

## Environment Variables (Future Use)

If you need to add API keys or configuration:

**Vercel**:
```bash
vercel env add API_KEY
```

**Netlify**:
- Go to Site Settings → Build & deploy → Environment
- Add variables

**GitHub Pages**:
- Use GitHub Secrets in workflow file

## Troubleshooting

### Build Fails
- Check Node.js version (needs 20+)
- Verify all dependencies install: `npm install`
- Check build locally: `npm run build`
- Review build logs for specific errors

### 404 on Page Refresh
- Ensure SPA redirect is configured (already done in vercel.json/netlify.toml)
- For GitHub Pages, may need custom 404.html

### Service Worker Issues
- Clear browser cache
- Check service worker is registered in DevTools → Application
- Ensure HTTPS (required for service workers)

### Charts Not Displaying
- Check browser console for errors
- Verify Chart.js loaded correctly
- Test with test data first

## Rollback Procedure

### Vercel
```bash
vercel rollback
# Or via dashboard: Deployments → Previous deployment → Promote to Production
```

### Netlify
- Go to Deploys tab
- Find previous successful deploy
- Click "Publish deploy"

## Monitoring & Analytics (Optional)

Add analytics to track usage:
- **Google Analytics**: Add tracking ID to index.html
- **Vercel Analytics**: Enable in project settings
- **Netlify Analytics**: Enable in site settings

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://docs.github.com/pages

---

## Quick Start (Recommended)

**For fastest deployment**:
1. Push code to GitHub (already done ✅)
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
6. Done! 🎉

Your app will be live in ~2 minutes.

---

**Last Updated**: November 5, 2025  
**Application**: Jays Footy Stats v1.0  
**Status**: Ready for Deployment ✅
