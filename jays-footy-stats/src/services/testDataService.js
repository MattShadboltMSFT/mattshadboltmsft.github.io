import { db } from '../db/db';
import { generateTestMatches } from '../data/testFixture';

// Load test data into database
export async function loadTestData(playerId) {
  const testMatches = generateTestMatches(playerId);
  
  // Check if test data already exists
  const existingTestData = await db.matches.where('isTestData').equals(true).count();
  if (existingTestData > 0) {
    throw new Error('Test data already loaded. Please clear existing test data first.');
  }
  
  // Add all test matches
  await db.matches.bulkAdd(testMatches);
  
  return testMatches.length;
}

// Clear all test data
export async function clearAllTestData() {
  const testMatches = await db.matches.where('isTestData').equals(true).toArray();
  const ids = testMatches.map(m => m.id);
  
  if (ids.length > 0) {
    await db.matches.bulkDelete(ids);
  }
  
  return ids.length;
}

// Check if test data exists
export async function hasTestData() {
  const count = await db.matches.where('isTestData').equals(true).count();
  return count > 0;
}
