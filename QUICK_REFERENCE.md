# Quick Reference - Multi-App Setup

## URLs
- **Landing Page**: https://mattshadboltmsft.github.io/
- **Jays Footy Stats**: https://mattshadboltmsft.github.io/jaysfooty/

## Common Commands

### Development
```bash
# Run Jays Footy Stats locally
npm run dev

# Run from template
cd apps/template && npm run dev
```

### Building
```bash
# Build everything
npm run build

# Build just landing page
npm run build:landing

# Build just Jays Footy Stats
npm run build:jaysfooty
```

### Preview Build
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

## Add New App (Quick)

1. **Copy template**:
   ```bash
   cp -r apps/template apps/mynewapp
   ```

2. **Find and replace in all files**: `mynewapp` (replace with your app name)

3. **Install deps**:
   ```bash
   cd apps/mynewapp
   npm install
   ```

4. **Add to root package.json**:
   ```json
   "build:mynewapp": "cd apps/mynewapp && npm install && npm run build"
   ```
   
   And update main build script:
   ```json
   "build": "npm run build:landing && npm run build:jaysfooty && npm run build:mynewapp"
   ```

5. **Update landing page** (`index.html`) - Add your app card

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add mynewapp"
   git push
   ```

## Structure at a Glance

```
Root (/)
├── Landing Page              https://...github.io/
└── Apps
    ├── Jays Footy Stats     https://...github.io/jaysfooty/
    ├── Future App 1         https://...github.io/newapp1/
    └── Future App 2         https://...github.io/newapp2/
```

## Key Configuration Points

### For Each New App

1. **vite.config.js**
   ```js
   base: '/appname/'
   outDir: '../../dist/appname'  // or 'dist/appname' if at root
   ```

2. **React Router** (if using)
   ```jsx
   <BrowserRouter basename="/appname">
   ```

3. **package.json**
   ```json
   "name": "appname"
   ```

4. **Build Script** (add to root package.json)
   ```json
   "build:appname": "cd apps/appname && npm install && npm run build"
   ```

## Troubleshooting

### Routes not working
- Check `basename` in React Router matches `base` in vite.config.js

### Assets not loading
- Use relative paths or include base path
- Check `base` in vite.config.js

### Build fails
- Ensure `outDir` path is correct
- Run `npm install` in app directory
- Check that dependencies are listed in app's package.json

## Documentation Files
- `MULTI_APP_SETUP.md` - Full documentation
- `MIGRATION_SUMMARY.md` - What changed
- `apps/template/README.md` - Template instructions
- This file - Quick reference

## Deploy
Just push to main branch - GitHub Actions handles the rest!
