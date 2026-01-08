# SC Builder

This is the SC Builder application for generating AFL SuperCoach statistics and CSV files.

## Features

### AFL SuperCoach CSV Generator

Generate CSV files with AFL player statistics and average SuperCoach scores for multiple seasons (2023-2025).

The tool:
- Fetches AFL player statistics from afltables.com
- Retrieves SuperCoach scores from footywire.com for all rounds
- Calculates average SuperCoach scores per player per season
- Generates downloadable CSV files with:
  - Player Name
  - Games Played
  - Total Score
  - Average SuperCoach Score

#### How to Use

1. Select the seasons you want to generate CSVs for (2023, 2024, 2025)
2. Click "Generate CSVs"
3. Wait for the data to be fetched and processed
4. Download individual CSV files or download all at once

**Note:** This tool fetches data from external sources in real-time, so it requires an internet connection and may take a few minutes to complete depending on the number of seasons selected.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start developing:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technical Details

### Data Sources

- **AFL Tables**: `https://afltables.com/afl/stats/{year}.html` - Player statistics
- **FootyWire**: `https://www.footywire.com/afl/footy/supercoach_round?year={year}&round={round}&p=&s=T` - SuperCoach scores

### Architecture

The application consists of:
- `aflDataService.js` - Service for fetching and processing AFL data
- `CSVGenerator.jsx` - React component with UI for generating CSVs
- Built with React, React Router, and Vite
