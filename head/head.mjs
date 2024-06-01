import express from 'express';
import { getPureItems, saveImageAnalysis, getImages, getAllImageIds } from '../database.mjs';
import dotenv, { config } from 'dotenv';
import chalk from 'chalk';
import { createServer, shutdownCompute } from './computeMaster.mjs';
import moment from 'moment';
import { composeAnalytics } from './workerPerformanceAnalytics.mjs';
import { shuffle } from '../utils.mjs';
import config from '../config.mjs';

dotenv.config();

const saverLookup = {
  'analyzeImage': saveImageAnalysis,
};

const app = express();
app.use(express.json());

let tasks = [];
let completedTasks = [];

async function composeTasks() {
  // todo: this whole thing would probably be done cleaner in database.mjs
  let pureItems1 = await getPureItems({
    where: { client: 'donplafon' },
  });
  let pureItems2 = await getPureItems({
    where: { client: 'meloman' },
  });
  let pureItems3 = await getPureItems({
    where: { client: 'vamsvet' },
  });
  let pureItems = pureItems1.concat(pureItems2).concat(pureItems3);
  let completedImages = await getAllImageIds();
  pureItems.forEach(({ remoteImages }) => {
    remoteImages.forEach((url, index) => {
      if (completedImages.has(url)) {
        return;
      }
  
      tasks.push({
        task: 'analyzeImage',
        taskData: {
          url,
          index,
        },
      });
    });
  });
  shuffle(tasks);
}

function authenticateWorker(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader === process.env.WORKER_SECRET) {
    next();
  }
  else {
    res.sendStatus(401);
  }
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
  console.log(chalk.blue('served task'), task);
  res.json(task);
});

app.post('/task', authenticateWorker, async(req, res) => {
  const result = req.body;
  console.log(chalk.green('Received result:'), result);

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

app.listen(process.env.HEAD_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.HEAD_PORT}/task`);
  await shutdownCompute();
  for (let i = 0; i < config.serverCount; i++) {
    await createServer(startupScriptBody)
  }

  console.log('composing tasks...');
  console.time('composed tasks');
  await composeTasks();
  console.log(chalk.green(`prepared ${tasks.length} tasks`));
  console.timeEnd('composed tasks');
});