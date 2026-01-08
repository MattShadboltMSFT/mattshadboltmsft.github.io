# Matt Shadbolt - Apps Collection

A multi-app monorepo hosting various web applications under a single domain.

## Live Site
🌐 **https://mattshadboltmsft.github.io/**

## Apps

### 🏈 Jays Footy Stats
**URL**: https://mattshadboltmsft.github.io/jaysfooty/

An AFL statistics tracking application for junior players (Under 13's). Track matches, analyze performance, and export detailed reports with a modern, clean interface.

**Features:**
- ⚡ Quick match stat entry
- 📊 Season performance dashboard
- 📈 Progress tracking and trends
- 📱 Mobile-first design
- 💾 Offline capability (PWA)
- 📤 Data export (CSV/PDF)
- 🧪 Test data import

### 🚀 Future Apps
Additional applications can be easily added to this monorepo. See documentation below for how to add new apps.

## Repository Structure

```
mattshadboltmsft.github.io/
├── index.html              # Landing page (root)
├── src/                    # Jays Footy Stats source
├── apps/                   # Additional apps
│   ├── jaysfooty/         # Reference configs
│   └── template/          # Template for new apps
└── dist/                  # Build output
    ├── index.html         # Landing page
    └── jaysfooty/         # Jays Footy Stats app
```

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Run Jays Footy Stats locally
npm run dev
# Access at http://localhost:5173/jaysfooty/
```

### Build
```bash
# Build all apps
npm run build

# Build individual components
npm run build:landing
npm run build:jaysfooty

# Preview build
npm run preview
```

### Deploy
Push to main branch - GitHub Actions automatically builds and deploys to GitHub Pages.

## Adding New Apps

See comprehensive guides:
- **[Quick Reference](QUICK_REFERENCE.md)** - Fast commands and quick guide
- **[Multi-App Setup](MULTI_APP_SETUP.md)** - Complete documentation
- **[Migration Summary](MIGRATION_SUMMARY.md)** - What changed in the restructure

**Quick steps:**
1. Copy template: `cp -r apps/template apps/mynewapp`
2. Update configs with your app name
3. Add build script to root package.json
4. Update landing page
5. Commit and push

## Project Documentation

### Jays Footy Stats
- **[Product Specification](specs/PRODUCT_SPEC.md)** - Complete product requirements
- **[Test Data Specification](specs/TEST_DATA_SPEC.md)** - Test data feature
- **[Requirements Summary](specs/REQUIREMENTS_SUMMARY.md)** - Engineering quick reference
- **[Engineering Handoff](specs/ENGINEERING_HANDOFF.md)** - Sprint breakdown
- **[Deployment Guide](specs/DEPLOYMENT_GUIDE.md)** - Deployment instructions

### Repository Setup
- **[Quick Reference](QUICK_REFERENCE.md)** - Common commands and quick guide
- **[Multi-App Setup](MULTI_APP_SETUP.md)** - Full setup documentation
- **[Migration Summary](MIGRATION_SUMMARY.md)** - Restructure details

## Tech Stack

- **Framework**: React 19 + Vite
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **Database**: Dexie (IndexedDB wrapper)
- **Charts**: Chart.js with react-chartjs-2
- **PWA**: vite-plugin-pwa (offline support)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## Development Workflow

1. **Feature Development**: Work in main branch or feature branches
2. **Build**: `npm run build` creates production build
3. **Deploy**: Push to main triggers automatic deployment
4. **Verify**: Check https://mattshadboltmsft.github.io/

## Contributing

This is a personal project repository. For questions or suggestions, please open an issue.

## License

Private - All Rights Reserved

---

**For Development Team:** Review the documentation links above to get started.
