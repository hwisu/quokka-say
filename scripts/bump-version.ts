#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Version bumper script for quokka-say
 *
 * Usage:
 *   deno run --allow-read --allow-write scripts/bump-version.ts [major|minor|patch]
 */

import { join } from '@std/path';

// Get version bump type from arguments
const bumpType = Deno.args[0] || 'patch';
if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.error('Error: Bump type must be one of: major, minor, patch');
  Deno.exit(1);
}

// Read the deno.json file
const denoJsonPath = join(Deno.cwd(), 'deno.json');
const denoJson = JSON.parse(await Deno.readTextFile(denoJsonPath));

// Parse current version
const currentVersion = denoJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update version in deno.json
denoJson.version = newVersion;
await Deno.writeTextFile(denoJsonPath, JSON.stringify(denoJson, null, 2) + '\n');

console.log(`Version bumped from v${currentVersion} to v${newVersion}`);
console.log('\nNext steps:');
console.log('1. git add deno.json');
console.log(`2. git commit -m "v${newVersion}"`);
console.log(`3. git tag v${newVersion}`);
console.log('4. git push && git push --tags');
