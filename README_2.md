# Jays Footy Stats

An AFL statistics tracking Progressive Web App (PWA) for junior Under 13's players. Track performance, view trends, and export season reports.

## 🚀 Deployment Status

This application is ready for deployment! Multiple free deployment options available.

**🎯 Quick Deploy Options (All FREE):**
- **Azure Static Web Apps** (FREE): [Complete Guide →](specs/AZURE_DEPLOYMENT.md) - 100% free, no credit card
- **GitHub Pages** (FREE): [Enable in Settings →](#deployment) - Simplest free option
- **Vercel**: [Deploy to Vercel →](https://vercel.com/new/clone?repository-url=https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io)
- **Netlify**: [Deploy to Netlify →](https://app.netlify.com/start/deploy?repository=https://github.com/MattShadboltMSFT/mattshadboltmsft.github.io)

📖 See [DEPLOYMENT_GUIDE.md](specs/DEPLOYMENT_GUIDE.md) for all deployment options

## Features

- ✅ **Match Recording** - Quick stat entry with +/- counters
- ✅ **Season Dashboard** - Visual performance trends with charts
- ✅ **Match History** - Complete match list with edit/delete
- ✅ **Personal Bests** - Track career highs across all stats
- ✅ **Data Export** - CSV and PDF season reports
- ✅ **Test Data** - Load 2025 fixture data for testing
- ✅ **Offline Support** - Works without internet (PWA)
- ✅ **Mobile First** - Optimized for phone use at games

## Stats Tracked

- Kicks & Handballs
- Marks & Tackles
- Goals & Behinds
- Spoils, Smothers & Interceptions
- Free Kicks (For/Against)

## Tech Stack

- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **Storage:** IndexedDB via Dexie.js
- **Charts:** Chart.js with react-chartjs-2
- **Styling:** Tailwind CSS v4
- **PWA:** vite-plugin-pwa with Workbox
- **Export:** jsPDF + jspdf-autotable
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React Context (AppContext)
├── data/           # Test fixture data
├── db/             # Database schema and models
├── pages/          # Page components (Home, Dashboard, etc.)
├── services/       # Business logic (matchService, exportService)
└── App.jsx         # Main app with routing
```

## Usage

### Adding a Match

1. Click "New Match" button
2. Enter match details (opponent, date, venue)
3. Use +/- buttons to record stats
4. Save match

### Test Data

Load test data to see the app with sample matches:

1. On home page, click "Load Test Data"
2. 17 matches from 2025 fixture will be added
3. View dashboard and reports with realistic data
4. Clear test data anytime without affecting real matches

### Exporting Data

From the Dashboard:
- Click "Export CSV" for spreadsheet
- Click "Export PDF" for printable report

## Deployment

📖 **See [DEPLOYMENT_GUIDE.md](specs/DEPLOYMENT_GUIDE.md) for complete deployment instructions**

The app is ready to deploy to multiple platforms:

### Option 1: Vercel (Recommended - 2 minutes)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Click Deploy
4. Done! ✅

Configuration files included: `vercel.json`

### Option 2: Netlify
1. Go to https://app.netlify.com
2. Import from GitHub
3. Click Deploy

Configuration files included: `netlify.toml`

### Option 3: GitHub Pages
Automated workflow is configured in `.github/workflows/deploy.yml`
1. Enable GitHub Pages in repository settings
2. Push to main branch
3. GitHub Actions will build and deploy automatically

### Other Options
- Azure Static Web Apps
- AWS Amplify
- Cloudflare Pages

All platforms supported with the provided configuration files.

## Offline Support

The app uses a service worker to cache assets and work offline:
- All pages work without internet
- Data stored locally in IndexedDB
- PWA can be installed on mobile devices

## Browser Support

- Chrome/Edge (latest)
- Safari (iOS 14+)
- Firefox (latest)
- Android Chrome (latest 2 versions)

## License

This project is for personal use.

## Season Timeline

- **Development:** 6-8 weeks
- **Target Completion:** Late March
- **Season Start:** April 2025

---

Built with ❤️ for junior AFL players and their families.
