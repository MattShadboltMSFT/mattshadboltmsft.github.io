import { renameSync } from 'fs';

// Rename jaysfooty.html to index.html after build
try {
  renameSync('dist/jaysfooty/jaysfooty.html', 'dist/jaysfooty/index.html');
  console.log('✓ Renamed jaysfooty.html to index.html');
} catch (error) {
  console.error('Error renaming file:', error.message);
  // eslint-disable-next-line no-undef
  process.exit(1);
}
