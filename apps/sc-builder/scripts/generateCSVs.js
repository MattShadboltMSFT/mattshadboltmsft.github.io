/**
 * AFL SuperCoach CSV Generator Script
 * 
 * This script fetches AFL player statistics and SuperCoach scores from external sources
 * and generates CSV files for seasons 2023-2025.
 * 
 * Usage: node scripts/generateCSVs.js
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration constants
const REQUEST_DELAY_MS = 500; // Delay between requests to avoid overwhelming servers
const MAX_AFL_ROUNDS = 24; // Standard number of AFL rounds per season
const AVAILABLE_YEARS = [2023, 2024, 2025]; // Configurable years - update as needed
const OUTPUT_DIR = path.join(__dirname, '../../../dataOutput');

/**
 * Fetch HTML content from a URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP error! status: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Fetch SuperCoach scores for a specific round
 */
async function fetchSuperCoachRound(year, round) {
  // Validate parameters to prevent injection
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error(`Invalid year: ${year}`);
  }
  if (!Number.isInteger(round) || round < 1 || round > MAX_AFL_ROUNDS) {
    throw new Error(`Invalid round: ${round}`);
  }
  
  const url = `https://www.footywire.com/afl/footy/supercoach_round?year=${year}&round=${round}&p=&s=T`;
  
  try {
    const html = await fetchHTML(url);
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const scores = [];
    
    // FootyWire typically displays SuperCoach scores in a table
    const tables = doc.querySelectorAll('table');
    
    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip header
        
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const nameCell = cells[1]; // Player name is typically in second column
          const scoreCell = cells[cells.length - 1]; // Score is often in last column
          
          if (nameCell && scoreCell) {
            const name = nameCell.textContent.trim();
            const scoreText = scoreCell.textContent.trim();
            const score = parseInt(scoreText, 10);
            
            if (name && !isNaN(score)) {
              scores.push({
                name: name,
                round: round,
                score: score
              });
            }
          }
        }
      });
    });
    
    return scores;
  } catch (error) {
    console.error(`Error fetching SuperCoach data for ${year} round ${round}:`, error.message);
    return [];
  }
}

/**
 * Fetch all SuperCoach scores for a season
 */
async function fetchSuperCoachSeason(year, maxRounds = MAX_AFL_ROUNDS) {
  const allScores = [];
  
  console.log(`Fetching SuperCoach scores for ${year}...`);
  
  for (let round = 1; round <= maxRounds; round++) {
    console.log(`  Fetching round ${round}/${maxRounds}...`);
    
    try {
      const roundScores = await fetchSuperCoachRound(year, round);
      allScores.push(...roundScores);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    } catch (error) {
      console.error(`  Failed to fetch round ${round}:`, error.message);
    }
  }
  
  console.log(`  Total scores fetched: ${allScores.length}`);
  return allScores;
}

/**
 * Calculate average SuperCoach scores per player
 */
function calculateAverageScores(scores) {
  const playerScores = {};
  
  scores.forEach(({ name, score }) => {
    if (!playerScores[name]) {
      playerScores[name] = {
        name: name,
        scores: [],
        total: 0,
        count: 0
      };
    }
    
    playerScores[name].scores.push(score);
    playerScores[name].total += score;
    playerScores[name].count += 1;
  });
  
  // Calculate averages
  const result = Object.values(playerScores).map(player => ({
    name: player.name,
    gamesPlayed: player.count,
    totalScore: player.total,
    averageScore: Number((player.total / player.count).toFixed(1)) // Round to 1 decimal
  }));
  
  // Sort by average score descending
  result.sort((a, b) => b.averageScore - a.averageScore);
  
  return result;
}

/**
 * Generate CSV content from player data
 */
function generateCSV(playerData) {
  if (!playerData || playerData.length === 0) {
    return '';
  }
  
  // CSV Header
  let csv = 'Player Name,Games Played,Total Score,Average SuperCoach Score\n';
  
  // CSV Rows
  playerData.forEach(player => {
    // Escape double quotes in player names according to RFC 4180
    const escapedName = player.name.replace(/"/g, '""');
    const row = [
      `"${escapedName}"`,
      player.gamesPlayed,
      player.totalScore,
      player.averageScore
    ].join(',');
    csv += row + '\n';
  });
  
  return csv;
}

/**
 * Generate and save CSV for a specific year
 */
async function generateSeasonCSV(year) {
  try {
    console.log(`\n=== Processing Season ${year} ===`);
    
    // Fetch SuperCoach scores for all rounds
    const scores = await fetchSuperCoachSeason(year, MAX_AFL_ROUNDS);
    
    if (scores.length === 0) {
      console.log(`No scores found for ${year}`);
      return null;
    }
    
    console.log(`Processing data for ${year}...`);
    
    // Calculate averages
    const playerData = calculateAverageScores(scores);
    
    console.log(`Generating CSV for ${year} (${playerData.length} players)...`);
    
    // Generate CSV
    const csv = generateCSV(playerData);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Write CSV to file
    const filename = path.join(OUTPUT_DIR, `afl_supercoach_${year}.csv`);
    fs.writeFileSync(filename, csv, 'utf8');
    
    console.log(`✓ CSV saved: ${filename}`);
    
    return {
      year: year,
      filename: filename,
      playerCount: playerData.length
    };
  } catch (error) {
    console.error(`✗ Error generating CSV for ${year}:`, error.message);
    return {
      year: year,
      error: error.message
    };
  }
}

/**
 * Main function - Generate CSVs for all years
 */
async function main() {
  console.log('AFL SuperCoach CSV Generator');
  console.log('============================\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  
  const results = [];
  
  for (const year of AVAILABLE_YEARS) {
    const result = await generateSeasonCSV(year);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n=== Summary ===');
  results.forEach(result => {
    if (result.error) {
      console.log(`${result.year}: Failed - ${result.error}`);
    } else {
      console.log(`${result.year}: Success - ${result.playerCount} players`);
    }
  });
  
  console.log('\nDone!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
