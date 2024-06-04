import express from 'express';
import { getPureItems, saveImageAnalysis, getImages, getAllImageIds } from '../database.mjs';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { createServer, shutdownCompute } from './computeMaster.mjs';
import moment from 'moment';
import { composeAnalytics } from './workerPerformanceAnalytics.mjs';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { composeTasks } from './composeTasks.mjs';

dotenv.config();

const saverLookup = {
  'analyzeImage': saveImageAnalysis,
};

let tasks = [];
let completedTasks = [];

const app = express();
app.use(express.json());

let startupScriptBody = `#!/bin/bash
touch /root/abc
apt install htop npm screen neovim -y &>> /root/errors.txt
npm install -g yarn n &>> /root/errors.txt
n latest &>> /root/errors.txt
hash -r &>> /root/errors.txt
node --version &>> /root/errors.txt
wget --header="Authorization:${process.env.WORKER_SECRET}" ${process.env.HEAD_IP}:${process.env.HEAD_PORT}/workerStuff.zip &>> /root/errors.txt
unzip workerStuff.zip &>> /root/errors.txt
npm run worker &>> /root/errors.txt`;

startup();
async function startup() {
  /*
  await shutdownCompute();
  for (let i = 0; i < config.serverCount; i++) {
    await createServer(startupScriptBody)
  }
  */

  console.log('composing tasks...');
  console.time('composed tasks');
  tasks = await composeTasks();
  console.log(chalk.green(`prepared ${tasks.length} tasks`));
  console.timeEnd('composed tasks');
}

app.get('/task', authenticateWorker, (req, res) => {
  if (tasks.length === 0) {
    return res.status(404).json({ message: 'No more tasks available' });
  }

  completedTasks.push({
    ip: req.ip,
    timestamp: moment().unix(),
  })
  const task = tasks.shift();
  console.log(chalk.blue('served task'));
  res.json(task);
});

app.post('/task', authenticateWorker, async(req, res) => {
  const result = req.body;
  console.log(chalk.green('Received result:'));

  try {
    await saverLookup[result.task](result);
  }
  catch (err) {
    console.log('unhandled error:');
    console.log(err);
  }

  res.json({ message: 'thanks' });
});

app.get('/workerStuff.zip', authenticateWorker, (req, res) => {
  const workerStuffPath = new URL('../workerStuff.zip', import.meta.url).pathname;
  console.log('served workerStuff')
  res.download(workerStuffPath, 'workerStuff.zip');
});

app.get('/analytics', (req, res) => {
  let analytics = composeAnalytics(completedTasks, tasks.length);
  res.json(analytics)
});

app.listen(process.env.HEAD_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.HEAD_PORT}/task`);
});

function authenticateWorker(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader === process.env.WORKER_SECRET) {
    next();
  }
  else {
    res.sendStatus(401);
  }
}
