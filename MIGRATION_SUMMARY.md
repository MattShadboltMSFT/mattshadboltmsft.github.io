# Repository Restructuring Summary

## Overview
Successfully transformed the repository from a single-app structure to a multi-app monorepo with a landing page and subdirectory routing.

## Changes Made

### 1. Landing Page Created
- **File**: `index.html` (root)
- **Purpose**: Acts as the main entry point showcasing all apps
- **URL**: https://mattshadboltmsft.github.io/
- **Features**:
  - Modern, responsive design with gradient background
  - Card-based layout for each app
  - Status badges (Active/Coming Soon)
  - Placeholder cards for future apps

### 2. Jays Footy Stats App Configuration
- **URL Changed**: From `/` to `/jaysfooty/`
- **Files Modified**:
  - `vite.config.js` - Added `base: '/jaysfooty/'` and output to `dist/jaysfooty`
  - `src/App.jsx` - Added `basename="/jaysfooty"` to React Router
- **Build Output**: `dist/jaysfooty/`

### 3. Build System Updates
- **File**: `package.json`
- **New Scripts**:
  - `build` - Builds landing page + all apps
  - `build:landing` - Builds landing page only
  - `build:jaysfooty` - Builds Jays Footy Stats only
- **Build Script**: `scripts/build-landing.js` - Copies landing page to dist

### 4. Template Structure for Future Apps
- **Location**: `apps/template/`
- **Contents**:
  - Sample React app with routing
  - Pre-configured vite.config.js
  - Package.json with minimal dependencies
  - README with instructions
- **Purpose**: Quick-start template for adding new apps

### 5. Documentation
- **MULTI_APP_SETUP.md**: Comprehensive guide covering:
  - Repository structure
  - Development workflow
  - How to add new apps (3 different approaches)
  - Deployment process
  - Troubleshooting tips

### 6. Apps Directory Structure
```
apps/
├── jaysfooty/          # Reference copy with configs for /jaysfooty path
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx     # With basename="/jaysfooty"
│       └── main.jsx
└── template/           # Template for new apps
    ├── README.md
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
```

## Important Notes

### Current Setup (Hybrid Approach)
The Jays Footy Stats app source code remains at the root (`src/`, `public/`, etc.) but:
- Builds to `dist/jaysfooty/` subdirectory
- Router uses `/jaysfooty` basename
- Vite uses `/jaysfooty/` base path

This approach:
- ✅ Requires minimal file moves
- ✅ Maintains Git history
- ✅ Works with GitHub virtual filesystem
- ✅ Easy to extend with new apps

### Adding Future Apps
Three options provided in documentation:
1. **Separate Directory** (Recommended) - Each app in `apps/` with own deps
2. **Root-Level** - Similar to current Jays Footy setup
3. **Workspace** - Advanced npm workspaces approach

## Next Steps

### To Test Locally
```bash
npm install
npm run build
npm run preview
```

### To Deploy
Simply commit and push - GitHub Actions will:
1. Run `npm run build`
2. Deploy `dist/` folder to GitHub Pages
3. Landing page at root, apps at subpaths

### To Add a New App
1. Copy template: `cp -r apps/template apps/mynewapp`
2. Update app name in configs
3. Install dependencies: `cd apps/mynewapp && npm install`
4. Add build script to root package.json
5. Update landing page index.html with new card
6. Commit and deploy

## Files Changed
- ✏️ `index.html` - Replaced with landing page
- ✏️ `vite.config.js` - Added base path and output directory
- ✏️ `src/App.jsx` - Added basename to router
- ✏️ `package.json` - Added new build scripts
- ➕ `scripts/build-landing.js` - Landing page build script
- ➕ `apps/jaysfooty/*` - Reference configuration
- ➕ `apps/template/*` - Template for new apps
- ➕ `MULTI_APP_SETUP.md` - Comprehensive documentation
- ➕ `MIGRATION_SUMMARY.md` - This file

## Verification Checklist
- [ ] Landing page displays at root
- [ ] Jays Footy Stats accessible at /jaysfooty/
- [ ] All routes work in Jays Footy Stats
- [ ] Assets load correctly
- [ ] PWA still functional
- [ ] Database/IndexedDB still works (same domain)

## Benefits
✅ Clean separation of concerns  
✅ Easy to add new apps  
✅ Each app can have different tech stack  
✅ Shared domain and hosting  
✅ Professional landing page  
✅ Minimal disruption to existing code  
✅ Template for rapid app creation  
✅ Well-documented process
