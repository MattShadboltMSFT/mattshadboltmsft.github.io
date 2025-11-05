import Dexie from 'dexie';

// Define the database
export const db = new Dexie('JaysFootyStatsDB');

// Define schema
db.version(1).stores({
  players: '++id, name, teamName, season',
  matches: '++id, date, opponent, playerId, isTestData',
  settings: 'key'
});

// Player model
export class Player {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name || '';
    this.teamName = data.teamName || '';
    this.season = data.season || new Date().getFullYear();
    this.jerseyNumber = data.jerseyNumber || null;
    this.photo = data.photo || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Match model
export class Match {
  constructor(data = {}) {
    this.id = data.id;
    this.playerId = data.playerId || 1; // Default player
    this.date = data.date || new Date().toISOString();
    this.opponent = data.opponent || '';
    this.venue = data.venue || '';
    this.position = data.position || '';
    this.quartersPlayed = data.quartersPlayed || 4;
    this.weather = data.weather || '';
    this.result = data.result || 'Unknown'; // 'Win', 'Loss', 'Draw', 'Unknown'
    this.score = data.score || '';
    this.isTestData = data.isTestData || false;
    
    // Stats
    this.stats = {
      kicks: data.stats?.kicks || 0,
      handballs: data.stats?.handballs || 0,
      marks: data.stats?.marks || 0,
      goals: data.stats?.goals || 0,
      behinds: data.stats?.behinds || 0,
      tackles: data.stats?.tackles || 0,
      spoils: data.stats?.spoils || 0,
      smothers: data.stats?.smothers || 0,
      interceptions: data.stats?.interceptions || 0,
      freesFor: data.stats?.freesFor || 0,
      freesAgainst: data.stats?.freesAgainst || 0
    };
    
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Initialize default player if none exists
export async function initializeDefaultPlayer() {
  const playerCount = await db.players.count();
  if (playerCount === 0) {
    const defaultPlayer = new Player({
      name: 'Jay',
      teamName: 'Mordi-Brae U12 Mixed',
      season: 2025,
    });
    await db.players.add(defaultPlayer);
  }
}

// Get or create default player
export async function getDefaultPlayer() {
  let player = await db.players.orderBy('id').first();
  if (!player) {
    await initializeDefaultPlayer();
    player = await db.players.orderBy('id').first();
  }
  return player;
}

// Database initialization
export async function initDatabase() {
  try {
    await initializeDefaultPlayer();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
