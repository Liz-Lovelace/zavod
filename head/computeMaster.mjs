import dotenv from 'dotenv';
import chalk from 'chalk';
import config from '../config.mjs';

dotenv.config();

let startupScriptId = '43f155bd-1e24-4171-90e6-0e72f134dc08';

let startupScriptBody = `#!/bin/bash
touch /root/abc
apt install htop npm screen neovim -y &>> /root/errors.txt

# remotion dependencies
apt install -y \
  libnss3 \
  libdbus-1-3 \
  libatk1.0-0 \
  libgbm-dev \
  libasound2 \
  libxrandr2 \
  libxkbcommon-dev \
  libxfixes3 \
  libxcomposite1 \
  libxdamage1 \
  libatk-bridge2.0-0 \
  libpango1.0-dev \
  libcups2-dev


npm install -g yarn n &>> /root/errors.txt
n latest &>> /root/errors.txt
hash -r &>> /root/errors.txt
node --version &>> /root/errors.txt
wget --header="Authorization:${process.env.WORKER_SECRET}" ${process.env.HEAD_IP}:${process.env.HEAD_PORT}/workerStuff.zip &>> /root/errors.txt
unzip workerStuff.zip &>> /root/errors.txt
apt install /worker/imageRenderWorker/fonts-montserrat.deb &>> /root/errors.txt
while true
do
  npm run worker &>> /root/errors.txt
  rm -r /tmp/remotion-*
done`;

export async function createServer() {
  if (config.mockCompute) {
    console.log(chalk.yellow('mock created server'));
    return;
  }

  await vultrAPI('PATCH', `startup-scripts/${startupScriptId}`, {
    name: 'startupScript',
    script: btoa(startupScriptBody),
  });

  let res = await vultrAPI('POST', 'instances', {
    'region': 'ams',
    'plan': 'vc2-1c-1gb',
    'label': 'zavodWorker',
    'os_id': 2136,
    'attach_vpc2': ['a479b2db-e82e-44b9-8b95-7a2600551860'],
    'backups': 'disabled',
    'script_id': startupScriptId,
  });

  console.log(chalk.green('Created new server'));

  return res;
}

export async function shutdownCompute() {
  if (config.mockCompute) {
    console.log(chalk.yellow('mock deleted servers'));
    return;
  }

  let servers = await listServers();

  console.log('Deleting', servers.length, 'servers...');
  for (let server of servers) {
    deleteServer(server.id);
  }
}

async function listServers() {
  return (await vultrAPI('GET', 'instances?per_page=500&label=zavodWorker')).instances;
}

async function deleteServer(id) {
  let res = await vultrAPI('DELETE', `instances/${id}`);
  console.log(chalk.blue('Deleted server'));
  return res;
}

export async function vultrAPI(method, endpoint, body) {
  const url = `https://api.vultr.com/v2/${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.log(chalk.red(await res.text()));
    throw new Error(`Vultr API request failed with status ${res.status}`);
  }

  if (res.status == 204) {
    return '204 response';
  }

  return await res.json();
}
