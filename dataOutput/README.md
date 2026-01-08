# AFL SuperCoach CSV Output

This folder contains generated CSV files with AFL player statistics and average SuperCoach scores.

## Files

- `afl_supercoach_2023.csv` - Season 2023 statistics
- `afl_supercoach_2024.csv` - Season 2024 statistics  
- `afl_supercoach_2025.csv` - Season 2025 statistics

## CSV Format

Each file contains:
- **Player Name**: Full name of the player
- **Games Played**: Number of games the player participated in
- **Total Score**: Sum of all SuperCoach scores for the season
- **Average SuperCoach Score**: Average score per game (rounded to 1 decimal place)

## Example

```csv
Player Name,Games Played,Total Score,Average SuperCoach Score
"Marcus Bontempelli",22,2420,110.0
"Clayton Oliver",21,2184,104.0
"Patrick Cripps",20,2080,104.0
```

## Generation

To regenerate these files:

```bash
cd apps/sc-builder
npm run generate-csvs
```

**Note**: These files are excluded from git (see `.gitignore`).
