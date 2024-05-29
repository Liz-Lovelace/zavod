import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

main()
async function main() {
  // ams vc2-1c-1gb 2136 a479b2db-e82e-44b9-8b95-7a2600551860 zavodWorker
  // await createServer();
  shutdownCompute();
}

async function shutdownCompute(){
  let servers = await listServers()
  console.log('Deleting', servers.length, 'servers...')
  for (let server of servers) {
    deleteServer(server.id)
  }
}

export async function listServers() {
  return (await vultrAPI('GET', 'instances?per_page=500&label=zavodWorker')).instances;
}

export async function createServer() {
  let res = await vultrAPI('POST', 'instances', {
    "region": "ams",
    "plan": "vc2-1c-1gb",
    "label": "zavodWorker",
    "os_id": 2136,
    "attach_vpc2": ["a479b2db-e82e-44b9-8b95-7a2600551860"],
    "backups": "disabled",
  });

  console.log(chalk.green('Created new server'))

  return res;
}

export async function deleteServer(id) {
  let res = await vultrAPI('DELETE', `instances/${id}`);
  console.log(chalk.blue('Deleted server'))
  return res;
}

export async function vultrAPI(method, endpoint, body) {
  const url = `https://api.vultr.com/v2/${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${process.env.VULTR_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.log(chalk.red(await response.text()))
    throw new Error(`Vultr API request failed with status ${response.status}`);
  }

  if (response.status == 204) {
    return;
  }

  return await response.json();
}
