// 2025 Season fixture data for Mordi-Brae U12 Mixed WILLIAMS
export const fixture2025 = [
  { date: '2025-04-05', opponent: 'Beaumaris', venue: 'Reserve Rd', result: 'Win' },
  { date: '2025-04-12', opponent: 'Cheltenham', venue: 'President Park', result: 'Win' },
  { date: '2025-04-26', opponent: 'St Pauls', venue: 'G H Cleland', result: 'Loss' },
  { date: '2025-05-03', opponent: 'Parkdale', venue: 'Jack Grut', result: 'Win' },
  { date: '2025-05-10', opponent: 'East Brighton', venue: 'Dendy Park', result: 'Loss' },
  { date: '2025-05-17', opponent: 'Highett', venue: 'G H Cleland', result: 'Win' },
  { date: '2025-05-24', opponent: 'Dingley', venue: 'Marcus Rd', result: 'Draw' },
  { date: '2025-05-31', opponent: 'Bentleigh', venue: 'G H Cleland', result: 'Win' },
  { date: '2025-06-07', opponent: 'South Yarra', venue: 'G H Cleland', result: 'Win' },
  { date: '2025-06-14', opponent: 'Clayton', venue: 'Meake Reserve', result: 'Loss' },
  { date: '2025-06-21', opponent: 'Hampton', venue: 'Boss James', result: 'Win' },
  { date: '2025-06-28', opponent: 'Moorabbin', venue: 'G H Cleland', result: 'Win' },
  { date: '2025-07-12', opponent: 'St Kilda City', venue: 'Peanut Farm', result: 'Win' },
  { date: '2025-07-19', opponent: 'Oakleigh', venue: 'G H Cleland', result: 'Loss' },
  { date: '2025-07-26', opponent: 'Sandringham', venue: 'G H Cleland', result: 'Win' },
  // Finals
  { date: '2025-08-02', opponent: 'Elimination Final', venue: 'TBD', result: 'Win' },
  { date: '2025-08-09', opponent: 'Preliminary Final', venue: 'TBD', result: 'Loss' },
];

// Generate realistic player stats based on match result
function generateStats(result, matchNumber) {
  const baseStats = {
    kicks: Math.floor(Math.random() * 8) + 5,      // 5-12
    handballs: Math.floor(Math.random() * 6) + 4,   // 4-9
    marks: Math.floor(Math.random() * 5) + 2,       // 2-6
    goals: Math.floor(Math.random() * 3),           // 0-2
    behinds: Math.floor(Math.random() * 3),         // 0-2
    tackles: Math.floor(Math.random() * 5) + 2,     // 2-6
    spoils: Math.floor(Math.random() * 3) + 1,      // 1-3
    smothers: Math.floor(Math.random() * 2),        // 0-1
    interceptions: Math.floor(Math.random() * 4) + 1, // 1-4
    freesFor: Math.floor(Math.random() * 3),        // 0-2
    freesAgainst: Math.floor(Math.random() * 2),    // 0-1
  };

  // Adjust stats based on result
  if (result === 'Win') {
    baseStats.kicks += Math.floor(Math.random() * 3);
    baseStats.marks += Math.floor(Math.random() * 2);
    baseStats.goals += Math.floor(Math.random() * 2);
  } else if (result === 'Loss') {
    baseStats.kicks = Math.max(3, baseStats.kicks - 2);
    baseStats.goals = Math.floor(baseStats.goals / 2);
  }

  // Add some improvement trend over the season
  const improvement = Math.floor(matchNumber / 5); // Gradual improvement
  baseStats.kicks += improvement;
  baseStats.handballs += improvement;

  return baseStats;
}

// Generate test matches from fixture
export function generateTestMatches(playerId) {
  return fixture2025.map((match, index) => ({
    playerId,
    date: match.date,
    opponent: match.opponent,
    venue: match.venue,
    position: ['Forward', 'Midfield', 'Defence'][Math.floor(Math.random() * 3)],
    quartersPlayed: 4,
    weather: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
    result: match.result,
    score: '',
    isTestData: true,
    stats: generateStats(match.result, index + 1),
    notes: 'Test data from 2025 fixture',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
