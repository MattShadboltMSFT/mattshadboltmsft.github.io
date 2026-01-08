# Deployment Instructions - START HERE

## Important: GitHub Virtual Filesystem

You're currently working in a GitHub virtual filesystem (vscode-vfs://). To deploy these changes, you have two options:

## Option 1: Commit Through GitHub Web Interface (Recommended)

1. **Go to your repository**: https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io

2. **Create files directly on GitHub** or use the "Add file" → "Upload files" button

3. **Key files to create/update**:
   - `index.html` (landing page - REPLACE existing)
   - `vite.config.js` (update with base path)
   - `src/App.jsx` (add basename to router)
   - `package.json` (add new build scripts)
   - `scripts/build-landing.js` (new file)
   - All documentation files (optional but helpful)

4. **Commit message**: "Restructure to multi-app with landing page"

5. **Push to main branch** - GitHub Actions will automatically build and deploy

## Option 2: Clone Repository Locally (Full Control)

```powershell
# Navigate to where you want to work
cd C:\Users\mattsha\Projects  # or your preferred location

# Clone the repository
git clone https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io.git
cd mattshadboltmsft.github.io

# Open in VS Code
code .
```

Then apply all the changes from the vscode-vfs workspace to your local clone.

## Critical Changes Summary

### Files That MUST Be Updated:

1. **index.html** (root) - Replace entire file with landing page
2. **vite.config.js** - Add these lines:
   ```javascript
   base: '/jaysfooty/',
   build: {
     outDir: 'dist/jaysfooty',
     emptyOutDir: true,
   },
   ```

3. **src/App.jsx** - Update Router line:
   ```javascript
   <Router basename="/jaysfooty">
   ```

4. **package.json** - Update scripts:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "npm run build:landing && npm run build:jaysfooty",
     "build:landing": "node scripts/build-landing.js",
     "build:jaysfooty": "vite build",
     "lint": "eslint .",
     "preview": "vite preview"
   }
   ```

5. **scripts/build-landing.js** - Create new file:
   ```javascript
   import { copyFileSync, mkdirSync } from 'fs';
   import { dirname } from 'path';
   import { fileURLToPath } from 'url';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   mkdirSync('dist', { recursive: true });
   console.log('Building landing page...');
   copyFileSync('index.html', 'dist/index.html');
   console.log('✓ Landing page built successfully');
   ```

## Quick Copy-Paste Approach

If you want to manually create these files through GitHub's interface:

1. Go to: https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io
2. Click "Add file" → "Create new file"
3. For each file, paste the content from the vscode-vfs workspace
4. Commit each change

## After Committing

1. **Monitor GitHub Actions**: 
   - Go to https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io/actions
   - Watch the deployment workflow

2. **Wait 2-10 minutes** for deployment to complete

3. **Test the site**:
   - Landing page: https://mattshadboltmsft.github.io/
   - Jays Footy: https://mattshadboltmsft.github.io/jaysfooty/

## Need Help?

If you prefer, I can provide the exact content for each file that needs to be created/updated so you can copy-paste them through GitHub's web interface.

Let me know which approach you'd like to take!
