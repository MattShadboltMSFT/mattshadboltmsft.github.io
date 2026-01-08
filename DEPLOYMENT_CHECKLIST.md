# Deployment Checklist

Use this checklist when deploying changes or adding new apps.

## Pre-Deployment Checks

### For Landing Page Updates
- [ ] Updated `index.html` with correct information
- [ ] Tested locally with `npm run build && npm run preview`
- [ ] Verified all links work
- [ ] Checked responsive design (mobile/tablet/desktop)

### For Jays Footy Stats Updates
- [ ] Tested locally with `npm run dev`
- [ ] Verified all routes work with `/jaysfooty` basename
- [ ] Checked database functionality (IndexedDB)
- [ ] Tested PWA offline capabilities
- [ ] Verified data export features work
- [ ] Build succeeds: `npm run build:jaysfooty`

### For New App Addition
- [ ] Copied template: `cp -r apps/template apps/[appname]`
- [ ] Updated all occurrences of app name in:
  - [ ] `vite.config.js` (base and outDir)
  - [ ] `package.json` (name)
  - [ ] `index.html` (title and meta)
  - [ ] `src/App.jsx` (basename in Router)
- [ ] Installed dependencies: `cd apps/[appname] && npm install`
- [ ] Added build script to root `package.json`:
  - [ ] `build:[appname]` script
  - [ ] Updated main `build` script to include new app
- [ ] Updated landing page `index.html` with new app card
- [ ] Tested app locally: `cd apps/[appname] && npm run dev`
- [ ] Build succeeds: `npm run build`

## Build Verification

```bash
# Clean build
rm -rf dist
npm run build

# Verify output structure
ls -la dist/
ls -la dist/jaysfooty/

# Preview locally
npm run preview
# Test at http://localhost:4173
```

### Check These URLs Locally
- [ ] http://localhost:4173/ (Landing page)
- [ ] http://localhost:4173/jaysfooty/ (Jays Footy Stats)
- [ ] http://localhost:4173/jaysfooty/history (Sample sub-route)
- [ ] http://localhost:4173/[newapp]/ (If adding new app)

## Commit and Deploy

```bash
# Check what's changed
git status

# Add files
git add .

# Commit with clear message
git commit -m "Description of changes"

# Push to trigger deployment
git push origin main
```

## Post-Deployment Verification

### Immediate Checks (2-5 minutes after push)
- [ ] GitHub Actions workflow completes successfully
  - Visit: https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io/actions
- [ ] No build errors in workflow logs

### Live Site Checks (5-10 minutes after push)
- [ ] Landing page loads: https://mattshadboltmsft.github.io/
- [ ] Jays Footy Stats loads: https://mattshadboltmsft.github.io/jaysfooty/
- [ ] All navigation links work
- [ ] Assets load correctly (images, fonts, icons)
- [ ] Routes work correctly (test deep links)
- [ ] PWA still functional (test offline mode for Jays Footy)
- [ ] Database operations work
- [ ] Export features work
- [ ] Mobile responsive design works

### New App Checks (if applicable)
- [ ] New app loads: https://mattshadboltmsft.github.io/[appname]/
- [ ] All routes work
- [ ] Assets load correctly
- [ ] Landing page link works

## Troubleshooting

### Build Fails in GitHub Actions
1. Check workflow logs for errors
2. Verify build works locally: `npm run build`
3. Check for missing dependencies
4. Ensure all file paths are correct

### App Not Loading / 404 Errors
1. Verify `base` in vite.config.js matches URL path
2. Check `basename` in React Router matches `base`
3. Ensure build output went to correct directory
4. Check GitHub Pages settings (should deploy from `/dist`)

### Assets Not Loading
1. Use relative paths or include base path
2. Check file paths in imports
3. Verify assets are in build output

### Routes Not Working
1. Check `basename` prop in BrowserRouter
2. Verify routes don't have leading slash conflicts
3. Test routes locally first

## Rollback Plan

If deployment breaks:

```bash
# Revert to previous commit
git log --oneline -10  # Find good commit
git revert [commit-hash]
git push origin main

# Or hard reset (use carefully)
git reset --hard [commit-hash]
git push origin main --force
```

## Emergency Contacts

- GitHub Repository: https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io
- GitHub Pages Docs: https://docs.github.com/en/pages
- Vite Docs: https://vitejs.dev/

## Notes

- Deployment typically takes 2-10 minutes
- DNS/CDN caching may cause delays
- Hard refresh (Ctrl+F5 / Cmd+Shift+R) to clear browser cache
- Check in incognito/private mode to avoid cache issues
