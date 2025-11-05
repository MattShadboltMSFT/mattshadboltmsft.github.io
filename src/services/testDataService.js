import { db } from '../db/db';
import { generateTestMatches } from '../data/testFixture';

// Load test data into database
export async function loadTestData(playerId) {
  const testMatches = generateTestMatches(playerId);
  
  // Check if test data already exists
  const allMatches = await db.matches.toArray();
  const existingTestData = allMatches.filter(m => m.isTestData).length;
  if (existingTestData > 0) {
    throw new Error('Test data already loaded. Please clear existing test data first.');
  }
  
  // Add all test matches
  await db.matches.bulkAdd(testMatches);
  
  return testMatches.length;
}

// Clear all test data
export async function clearAllTestData() {
  const allMatches = await db.matches.toArray();
  const testMatches = allMatches.filter(m => m.isTestData);
  const ids = testMatches.map(m => m.id);
  
  if (ids.length > 0) {
    await db.matches.bulkDelete(ids);
  }
  
  return ids.length;
}

// Check if test data exists
export async function hasTestData() {
  const allMatches = await db.matches.toArray();
  const count = allMatches.filter(m => m.isTestData).length;
  return count > 0;
}
