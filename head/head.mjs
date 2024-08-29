import express from 'express';
import { saveImageAnalysis, dumpImages } from '../lib/database.mjs';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { createServer, shutdownCompute } from './computeMaster.mjs';
import moment from 'moment';
import config from '../config.mjs';
import { composeTasks } from './composeTasks.mjs';
import { composeAnalytics } from './workerPerformanceAnalytics.mjs';

let tasks = [];
let completedTasks = [];
let busy = true;

const saverLookup = {
  'analyzeImage': saveImageAnalysis,
};

dotenv.config();
const app = express();
app.use(express.json());

startup();
async function startup() {
  busy = true;
  if (config.dumpDB) {
    await dumpImages();
  }
  /*
  await shutdownCompute();
  */
  for (let i = 0; i < config.serverCount; i++) {
    await createServer();
  }

  console.log('composing tasks...');
  tasks = await composeTasks('donplafon');
  console.log(chalk.green(`prepared ${tasks.length} tasks`));
  busy = false;
}

app.get('/task', authenticateWorker, async(req, res) => {
  if (tasks.length === 0) {
    res.status(404).json({ message: 'No more tasks available' });
    if (!busy) {
      // await shutdownCompute();
      busy = true;
    }
    return;
  }

  completedTasks.push({
    ip: req.ip,
    timestamp: moment().unix(),
  });

  const task = tasks.shift();
  res.json(task);

  console.log(chalk.blue('served task'));
});

app.post('/task', authenticateWorker, async(req, res) => {
  const result = req.body;
  console.log(chalk.green('Received result'));

  if (!saverLookup[result.task]) {
    return res.json({ message: 'thanks' });
  }

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
  console.log('served workerStuff');
  res.download(workerStuffPath, 'workerStuff.zip');
});

app.get('/performance', (req, res) => {
  let analytics = composeAnalytics(completedTasks, tasks.length);
  res.json(analytics);
});

app.listen(process.env.HEAD_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.HEAD_PORT}`);
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
