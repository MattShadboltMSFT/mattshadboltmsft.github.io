# SC Builder

This is the SC Builder application for generating AFL SuperCoach statistics CSV files.

## Features

### AFL SuperCoach CSV Generator

Generates CSV files with AFL player statistics and average SuperCoach scores for seasons 2023-2025. The CSV files are automatically saved to the `dataOutput` folder.

The script:
- Fetches SuperCoach scores from footywire.com for all rounds
- Calculates average SuperCoach scores per player per season
- Generates CSV files with:
  - Player Name
  - Games Played
  - Total Score
  - Average SuperCoach Score
- Saves files to `dataOutput/afl_supercoach_{year}.csv`

#### How to Use

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the CSV generator:
   ```bash
   npm run generate-csvs
   ```

The script will fetch data for all configured seasons (2023, 2024, 2025) and save the CSV files to the `dataOutput` folder in the project root.

**Note:** This script fetches data from external sources in real-time, so it requires an internet connection and may take several minutes to complete.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate CSV files:
   ```bash
   npm run generate-csvs
   ```

3. Start developing:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Technical Details

### Data Sources

- **FootyWire**: `https://www.footywire.com/afl/footy/supercoach_round?year={year}&round={round}&p=&s=T` - SuperCoach scores

### Architecture

The application consists of:
- `scripts/generateCSVs.js` - Node.js script for fetching and processing AFL data
- Built with React, React Router, and Vite for the web app
- Uses jsdom for HTML parsing in Node.js

### Output

CSV files are saved to: `dataOutput/afl_supercoach_{year}.csv`

Each file contains:
- Header row: `Player Name,Games Played,Total Score,Average SuperCoach Score`
- One row per player with their statistics for that season
- Players sorted by average score (descending)
