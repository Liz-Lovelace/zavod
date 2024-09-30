import { createServer } from '../head/computeMaster.mjs';
import config from '../config.mjs';

async function addAllServers() {
  console.log(`Creating ${config.serverCount} servers...`);
  for (let i = 0; i < config.serverCount; i++) {
    await createServer();
  }
  console.log('All servers created successfully.');
}

addAllServers();