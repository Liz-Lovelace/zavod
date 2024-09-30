import { shutdownCompute } from '../head/computeMaster.mjs';

async function shutdownAllServers() {
  console.log('Shutting down all servers...');
  await shutdownCompute();
  console.log('All servers shut down successfully.');
}

shutdownAllServers();