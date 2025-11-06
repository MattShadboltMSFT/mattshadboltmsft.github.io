# Deployment Guide - Jays Footy Stats

This guide provides step-by-step instructions for deploying the Jays Footy Stats application.

## Prerequisites

Before deploying, ensure:
- ✅ Application builds successfully (`npm run build` in repository root)
- ✅ All tests pass
- ✅ Code is committed and pushed to GitHub

## Quick Links

- 📄 **GitHub Pages** - Recommended: Simple, free, and integrated (below)
- ⚡ Vercel - Fast deployment (below)
- 🌐 Netlify - Alternative option (below)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

GitHub Pages is free and works well for static sites, with seamless GitHub integration.

#### Setup

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Save

2. **Push to Main**
   - Push your code to the main branch
   - Workflow will auto-deploy
   - Check Actions tab for status

3. **Access your site**
   - URL: `https://MattShadboltMSFT.github.io/`
   - Or custom domain if configured

**Workflow File**: `.github/workflows/deploy.yml` ✅ Already configured!

**Note**: GitHub Pages may take a few minutes to go live after first deployment.

**Benefits:**
- ✅ **100% Free** - Built into GitHub
- ✅ **Automatic deployment** - Every push to main
- ✅ **Custom domains** - Free SSL certificates
- ✅ **CDN included** - Fast worldwide performance

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

### Option 3: Netlify

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
2. Go to repository Settings → Pages
3. Source: "GitHub Actions"
4. Save
5. Push to main branch to trigger deployment
6. Done! 🎉

Your app will be live at `https://MattShadboltMSFT.github.io/` in ~2 minutes.

**Alternative - Vercel**:
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your repository
4. Click "Deploy"
5. Done! 🎉

Your app will be live in ~2 minutes.

---

**Last Updated**: November 5, 2025  
**Application**: Jays Footy Stats v1.0  
**Status**: Ready for Deployment ✅
