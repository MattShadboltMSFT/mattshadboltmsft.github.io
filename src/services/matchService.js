import { db, Match } from '../db/db';

// Validate player ID
function validatePlayerId(playerId) {
  if (!playerId || typeof playerId !== 'number') {
    throw new Error('Invalid player ID: must be a valid number');
  }
}

// Create a new match
export async function createMatch(matchData) {
  validatePlayerId(matchData.playerId);
  
  const match = new Match(matchData);
  match.createdAt = new Date().toISOString();
  match.updatedAt = new Date().toISOString();
  const id = await db.matches.add(match);
  return { ...match, id };
}

// Get all matches for a player
export async function getAllMatches(playerId, includeTestData = true) {
  validatePlayerId(playerId);
  
  let query = db.matches.where('playerId').equals(playerId);
  
  const matches = await query.toArray();
  
  if (!includeTestData) {
    return matches.filter(m => !m.isTestData);
  }
  
  return matches.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get a single match by ID
export async function getMatch(id) {
  return await db.matches.get(id);
}

// Update a match
export async function updateMatch(id, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.matches.update(id, updates);
  return await getMatch(id);
}

// Delete a match
export async function deleteMatch(id) {
  await db.matches.delete(id);
}

// Delete all test data
export async function clearTestData() {
  const allMatches = await db.matches.toArray();
  const testMatches = allMatches.filter(m => m.isTestData);
  const ids = testMatches.map(m => m.id);
  await db.matches.bulkDelete(ids);
  return ids.length;
}

// Get season statistics
export async function getSeasonStats(playerId, season) {
  const allMatches = await getAllMatches(playerId, true); // Get all matches first
  const matches = allMatches.filter(m => !m.isTestData); // Exclude test data
  const seasonMatches = matches.filter(m => {
    const matchYear = new Date(m.date).getFullYear();
    return matchYear === season;
  });

  if (seasonMatches.length === 0) {
    return {
      totalGames: 0,
      stats: {},
      averages: {}
    };
  }

  // Calculate totals
  const totals = {
    kicks: 0,
    handballs: 0,
    marks: 0,
    goals: 0,
    behinds: 0,
    tackles: 0,
    spoils: 0,
    smothers: 0,
    interceptions: 0,
    freesFor: 0,
    freesAgainst: 0
  };

  seasonMatches.forEach(match => {
    Object.keys(totals).forEach(key => {
      totals[key] += match.stats[key] || 0;
    });
  });

  // Calculate averages
  const averages = {};
  Object.keys(totals).forEach(key => {
    averages[key] = (totals[key] / seasonMatches.length).toFixed(1);
  });

  // Calculate personal bests
  const personalBests = {};
  Object.keys(totals).forEach(key => {
    personalBests[key] = Math.max(...seasonMatches.map(m => m.stats[key] || 0));
  });

  return {
    totalGames: seasonMatches.length,
    stats: totals,
    averages,
    personalBests,
    matches: seasonMatches
  };
}
