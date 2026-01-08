# New App Template

This directory contains a template structure for creating new apps in the monorepo.

## Quick Start

1. Copy this template:
   ```bash
   cp -r apps/template apps/mynewapp
   cd apps/mynewapp
   ```

2. Update the configuration files with your app name

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start developing:
   ```bash
   npm run dev
   ```

## Files to Update

- `vite.config.js` - Update base path and output directory
- `package.json` - Update name and description
- `index.html` - Update title and meta tags
- `src/App.jsx` - Update basename in Router if using React Router

## Adding to Build

In root `package.json`, add your app to the build script:
```json
"build": "npm run build:landing && npm run build:jaysfooty && npm run build:mynewapp"
```
