/**
 * AFL Data Service
 * Fetches AFL player statistics and SuperCoach scores from external sources
 * 
 * IMPORTANT: This service makes direct requests to external websites.
 * Due to CORS (Cross-Origin Resource Sharing) policies, these requests may be blocked
 * when running in a browser environment.
 * 
 * Workarounds:
 * 1. Use a CORS proxy service (e.g., https://corsproxy.io, https://cors-anywhere.herokuapp.com)
 * 2. Set up a backend proxy server to fetch data on behalf of the client
 * 3. Use browser extensions that disable CORS during development
 * 4. Deploy the app with a serverless function to handle data fetching
 */

// Configuration constants
const REQUEST_DELAY_MS = 100; // Delay between requests to avoid overwhelming servers
const MAX_AFL_ROUNDS = 24; // Standard number of AFL rounds per season

/**
 * Fetch HTML content from a URL
 * Note: May require CORS proxy for cross-origin requests
 */
async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

/**
 * Parse AFL Tables player statistics
 * Extracts player names from the statistics page
 */
function parseAFLTablesPlayers(html, year) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const players = [];
  
  // AFL Tables typically has player statistics in table rows
  // Look for tables with player data
  const tables = doc.querySelectorAll('table');
  
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
      // Skip header rows
      if (index === 0) return;
      
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        // First cell typically contains player name
        const nameCell = cells[0];
        if (nameCell && nameCell.textContent.trim()) {
          const name = nameCell.textContent.trim();
          // Filter out non-player rows
          if (name && !name.includes('TOTAL') && !name.includes('Average')) {
            players.push({
              name: name,
              year: year
            });
          }
        }
      }
    });
  });
  
  return players;
}

/**
 * Fetch SuperCoach scores for a specific round
 * @param {number} year - The AFL season year (e.g., 2023)
 * @param {number} round - The round number (1-24)
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
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
    console.error(`Error fetching SuperCoach data for ${year} round ${round}:`, error);
    return [];
  }
}

/**
 * Fetch all SuperCoach scores for a season
 * @param {number} year - The AFL season year
 * @param {number} maxRounds - Maximum number of rounds to fetch (default: MAX_AFL_ROUNDS)
 * @param {Function} onProgress - Optional progress callback
 */
export async function fetchSuperCoachSeason(year, maxRounds = MAX_AFL_ROUNDS, onProgress = null) {
  const allScores = [];
  
  for (let round = 1; round <= maxRounds; round++) {
    if (onProgress) {
      onProgress(round, maxRounds);
    }
    
    try {
      const roundScores = await fetchSuperCoachRound(year, round);
      allScores.push(...roundScores);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    } catch (error) {
      console.error(`Failed to fetch round ${round}:`, error);
    }
  }
  
  return allScores;
}

/**
 * Calculate average SuperCoach scores per player
 * @param {Array} scores - Array of score objects with name and score properties
 * @returns {Array} Array of player objects with calculated averages
 */
export function calculateAverageScores(scores) {
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
 * Fetch AFL Tables player data
 * @param {number} year - The AFL season year
 */
export async function fetchAFLTablesPlayers(year) {
  // Validate year parameter
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error(`Invalid year: ${year}`);
  }
  
  const url = `https://afltables.com/afl/stats/${year}.html`;
  
  try {
    const html = await fetchHTML(url);
    return parseAFLTablesPlayers(html, year);
  } catch (error) {
    console.error(`Error fetching AFL Tables data for ${year}:`, error);
    throw error;
  }
}

/**
 * Generate CSV content from player data
 */
export function generateCSV(playerData) {
  if (!playerData || playerData.length === 0) {
    return '';
  }
  
  // CSV Header
  let csv = 'Player Name,Games Played,Total Score,Average SuperCoach Score\n';
  
  // CSV Rows
  playerData.forEach(player => {
    const row = [
      `"${player.name}"`,
      player.gamesPlayed,
      player.totalScore,
      player.averageScore
    ].join(',');
    csv += row + '\n';
  });
  
  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Fetch and generate CSV for a specific year
 * @param {number} year - The AFL season year
 * @param {Function} onProgress - Optional progress callback
 */
export async function generateSeasonCSV(year, onProgress = null) {
  try {
    // Update progress
    if (onProgress) {
      onProgress({ status: 'fetching', message: `Fetching SuperCoach scores for ${year}...` });
    }
    
    // Fetch SuperCoach scores for all rounds
    const scores = await fetchSuperCoachSeason(year, MAX_AFL_ROUNDS, (round, maxRounds) => {
      if (onProgress) {
        onProgress({
          status: 'fetching',
          message: `Fetching round ${round}/${maxRounds} for ${year}...`,
          progress: (round / maxRounds) * 100
        });
      }
    });
    
    if (onProgress) {
      onProgress({ status: 'processing', message: `Processing data for ${year}...` });
    }
    
    // Calculate averages
    const playerData = calculateAverageScores(scores);
    
    if (onProgress) {
      onProgress({ status: 'generating', message: `Generating CSV for ${year}...` });
    }
    
    // Generate CSV
    const csv = generateCSV(playerData);
    
    if (onProgress) {
      onProgress({ status: 'complete', message: `CSV generated for ${year}`, data: playerData });
    }
    
    return {
      year: year,
      csv: csv,
      playerData: playerData
    };
  } catch (error) {
    console.error(`Error generating CSV for ${year}:`, error);
    if (onProgress) {
      onProgress({ status: 'error', message: `Error: ${error.message}` });
    }
    throw error;
  }
}

/**
 * Generate CSVs for multiple years
 */
export async function generateAllSeasonCSVs(years, onProgress = null) {
  const results = [];
  
  for (const year of years) {
    try {
      const result = await generateSeasonCSV(year, onProgress);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate CSV for ${year}:`, error);
      results.push({
        year: year,
        error: error.message
      });
    }
  }
  
  return results;
}
