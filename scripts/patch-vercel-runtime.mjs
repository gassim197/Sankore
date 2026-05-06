import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findConfigs(dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findConfigs(full));
    } else if (entry === '.vc-config.json') {
      results.push(full);
    }
  }
  return results;
}

const configs = findConfigs('.vercel/output/functions');
for (const file of configs) {
  const config = JSON.parse(readFileSync(file, 'utf8'));
  if (config.runtime === 'nodejs18.x') {
    config.runtime = 'nodejs20.x';
    writeFileSync(file, JSON.stringify(config, null, '\t'));
    console.log(`[patch-vercel-runtime] ${file}: nodejs18.x → nodejs20.x`);
  }
}
