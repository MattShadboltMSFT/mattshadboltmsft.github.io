# Repository Structure Diagram

## URL Mapping

```
https://mattshadboltmsft.github.io/
│
├─ /                          → Landing Page (index.html)
│
├─ /jaysfooty/               → Jays Footy Stats App
│  ├─ /                      → Home
│  ├─ /match/new             → New Match Entry
│  ├─ /match/:id             → Edit Match
│  ├─ /match/:id/view        → View Match Details
│  ├─ /history               → Match History
│  └─ /dashboard             → Dashboard
│
├─ /newapp1/                 → Future App 1 (Coming Soon)
│
└─ /newapp2/                 → Future App 2 (Coming Soon)
```

## File Structure

```
mattshadboltmsft.github.io/
│
├─ 📄 index.html                    # Landing page source
├─ 📄 package.json                  # Root package config
├─ 📄 vite.config.js               # Vite config for Jays Footy
│
├─ 📁 src/                          # Jays Footy Stats source
│  ├─ App.jsx                       # (basename="/jaysfooty")
│  ├─ main.jsx
│  ├─ 📁 pages/
│  ├─ 📁 components/
│  ├─ 📁 services/
│  ├─ 📁 context/
│  └─ 📁 theme/
│
├─ 📁 public/                       # Public assets
│
├─ 📁 apps/                         # Apps directory
│  │
│  ├─ 📁 jaysfooty/                # Reference configs (not source)
│  │  ├─ index.html
│  │  ├─ vite.config.js            # (base: '/jaysfooty/')
│  │  └─ package.json
│  │
│  └─ 📁 template/                 # Template for new apps
│     ├─ README.md
│     ├─ index.html
│     ├─ vite.config.js
│     ├─ package.json
│     └─ 📁 src/
│        ├─ App.jsx
│        └─ main.jsx
│
├─ 📁 scripts/
│  └─ build-landing.js             # Copies landing page to dist
│
├─ 📁 specs/                       # Documentation
│  ├─ PRODUCT_SPEC.md
│  └─ ...
│
├─ 📁 .github/
│  └─ 📁 workflows/
│     └─ deploy.yml                # CI/CD pipeline
│
└─ 📁 dist/                        # Build output (generated, not committed)
   ├─ index.html                   # Landing page
   └─ 📁 jaysfooty/               # Jays Footy Stats build
      ├─ index.html
      ├─ 📁 assets/
      └─ ...
```

## Build Flow

```
┌─────────────────────┐
│  npm run build      │
└──────────┬──────────┘
           │
           ├─────────────────────────────────┐
           │                                 │
           ▼                                 ▼
┌──────────────────────┐         ┌──────────────────────┐
│ npm run build:landing│         │npm run build:jaysfooty│
└──────────┬───────────┘         └──────────┬───────────┘
           │                                 │
           │ scripts/build-landing.js        │ vite build
           │                                 │
           ▼                                 ▼
    dist/index.html              dist/jaysfooty/**/*
```

## Deployment Flow

```
┌──────────────────┐
│ git push origin  │
│      main        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│  GitHub Actions         │
│  .github/workflows/     │
│      deploy.yml         │
└────────┬────────────────┘
         │
         ├─ Checkout code
         ├─ Setup Node.js
         ├─ npm ci
         ├─ npm run build
         └─ Deploy to GitHub Pages
                │
                ▼
┌───────────────────────────────┐
│   GitHub Pages               │
│   mattshadboltmsft.github.io │
└───────────────────────────────┘
```

## Developer Workflow

### Working on Jays Footy Stats
```
Edit files in src/
     ↓
npm run dev
     ↓
Test at localhost:5173/jaysfooty/
     ↓
npm run build
     ↓
Commit & Push
     ↓
Auto-deploy
```

### Adding New App
```
Copy apps/template → apps/mynewapp
     ↓
Update configs (vite, package.json, etc.)
     ↓
cd apps/mynewapp && npm install
     ↓
Update root package.json build scripts
     ↓
Update landing page index.html
     ↓
npm run build (test)
     ↓
Commit & Push
     ↓
Auto-deploy
```

## Key Configuration Points

### Landing Page
- **Source**: `index.html` (root)
- **Output**: `dist/index.html`
- **Build**: `scripts/build-landing.js`

### Jays Footy Stats
- **Source**: `src/`, `public/`
- **Config**: `vite.config.js` (base: '/jaysfooty/')
- **Router**: `src/App.jsx` (basename="/jaysfooty")
- **Output**: `dist/jaysfooty/`

### Future Apps
- **Source**: `apps/[appname]/`
- **Config**: `apps/[appname]/vite.config.js`
- **Output**: `dist/[appname]/`

## Architecture Benefits

✅ **Separation**: Each app isolated in subdirectory  
✅ **Scalability**: Easy to add more apps  
✅ **Independence**: Apps can use different tech stacks  
✅ **Simplicity**: Clear build process  
✅ **Maintenance**: Easy to update individual apps  
✅ **Professional**: Clean landing page for portfolio
