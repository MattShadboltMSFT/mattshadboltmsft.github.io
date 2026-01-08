# Multi-App Monorepo Structure

This repository hosts multiple web applications under a single domain with a landing page at the root.

## Current Structure

```
mattshadboltmsft.github.io/
├── index.html                 # Landing page (root)
├── src/                       # Jays Footy Stats source
├── public/                    # Public assets
├── apps/                      # Template/future apps directory
│   └── jaysfooty/            # Copy of Jays Footy for reference
├── scripts/
│   └── build-landing.js      # Build script for landing page
├── dist/                     # Build output (generated)
│   ├── index.html            # Landing page
│   └── jaysfooty/            # Jays Footy Stats app
└── package.json              # Root package configuration
```

## Live URLs

- **Landing Page**: https://mattshadboltmsft.github.io/
- **Jays Footy Stats**: https://mattshadboltmsft.github.io/jaysfooty/

## Development

### Run Jays Footy Stats locally
```bash
npm run dev
# Access at http://localhost:5173/jaysfooty/
```

### Build all apps
```bash
npm run build
# Builds landing page and all apps to dist/
```

### Build individual components
```bash
npm run build:landing   # Build landing page only
npm run build:jaysfooty # Build Jays Footy Stats only
```

## Adding a New App

To add a new application to this monorepo (e.g., `/newapp1`):

### Option 1: Separate Directory Approach (Recommended for isolation)

1. **Create a new app directory** under `apps/`:
   ```bash
   mkdir -p apps/newapp1
   cd apps/newapp1
   ```

2. **Initialize the app** (using Vite, Next.js, or your preferred framework):
   ```bash
   npm create vite@latest . -- --template react
   # or
   npm create next-app@latest .
   ```

3. **Configure the app** for subdirectory deployment:
   
   Create `apps/newapp1/vite.config.js`:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     base: '/newapp1/',
     build: {
       outDir: '../../dist/newapp1',
       emptyOutDir: true,
     },
     plugins: [react()],
   })
   ```

4. **Update the root build process**:
   
   In root `package.json`, add:
   ```json
   {
     "scripts": {
       "build": "npm run build:landing && npm run build:jaysfooty && npm run build:newapp1",
       "build:newapp1": "cd apps/newapp1 && npm install && npm run build",
       "dev:newapp1": "cd apps/newapp1 && npm run dev"
     }
   }
   ```

5. **Update the landing page** (`index.html`):
   ```html
   <a href="/newapp1/" class="app-card">
     <div class="app-icon">🚀</div>
     <h2 class="app-title">New App 1</h2>
     <p class="app-description">
       Description of your new app.
     </p>
     <span class="status-badge status-active">Active</span>
   </a>
   ```

6. **If using React Router**, configure basename:
   ```javascript
   <BrowserRouter basename="/newapp1">
     {/* routes */}
   </BrowserRouter>
   ```

### Option 2: Root-Level Approach (Current Jays Footy Setup)

Keep your app at the root level and configure it to build to a subdirectory:

1. **Update `vite.config.js`** with base and build.outDir
2. **Update router** with basename
3. **Add build script** to package.json

### Option 3: Workspace Approach (Advanced)

Convert to npm workspaces for better dependency management:

1. Update root `package.json`:
   ```json
   {
     "workspaces": [
       "apps/*"
     ]
   }
   ```

2. Each app in `apps/` has its own `package.json`
3. Run `npm install` at root to link all workspaces
4. Use `npm run build -w apps/newapp1` to build specific apps

## Deployment

The GitHub Actions workflow automatically:
1. Installs dependencies
2. Runs `npm run build` (builds all apps)
3. Deploys the `dist/` folder to GitHub Pages

**Commit and push to trigger deployment:**
```bash
git add .
git commit -m "Add new app"
git push origin main
```

## Repository Organization Tips

### Code Isolation
- Keep each app's source code in its own directory under `apps/`
- Each app can have its own dependencies, config, and build process
- Shared code can go in a `shared/` or `common/` directory

### Naming Convention
- Use lowercase, hyphenated names for apps: `my-new-app`
- URL paths match directory names: `/my-new-app/`

### Build Output
- All apps build to `dist/<appname>/`
- Landing page builds to `dist/index.html`
- Never commit the `dist/` folder (it's generated)

## Future Apps

Placeholder apps are visible on the landing page:
- New App 1: `/newapp1/`
- New App 2: `/newapp2/`

Simply follow the steps above to create and deploy them!

## Troubleshooting

### Routes not working after deployment
- Ensure `basename` is set in React Router
- Ensure `base` is set in vite.config.js
- Check that paths are relative or absolute with the base path

### Assets not loading
- Use relative paths: `./image.png` instead of `/image.png`
- Or use the base path: `/jaysfooty/image.png`

### App not building
- Check that build:outDir points to correct location
- Ensure `emptyOutDir: true` in vite config
- Verify all dependencies are installed

## Links

- [GitHub Repository](https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Documentation](https://vitejs.dev/)
