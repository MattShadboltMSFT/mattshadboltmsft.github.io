import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure dist directory exists
mkdirSync('dist', { recursive: true });

// Copy landing page to dist root
console.log('Building landing page...');
copyFileSync('index.html', 'dist/index.html');
console.log('✓ Landing page built successfully');
