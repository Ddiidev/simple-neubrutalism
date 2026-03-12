import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'docs');
const docsTags = path.join(docsRoot, 'tags');
const sourceTags = path.join(repoRoot, 'tags');

await fs.mkdir(docsTags, { recursive: true });
await fs.copyFile(
  path.join(repoRoot, 'neubrutalism.css'),
  path.join(docsRoot, 'neubrutalism.css')
);
await fs.copyFile(
  path.join(repoRoot, 'neubrutalism.js'),
  path.join(docsRoot, 'neubrutalism.js')
);
await fs.cp(sourceTags, docsTags, { recursive: true, force: true });

console.log('GitHub Pages assets synced into docs/.');
