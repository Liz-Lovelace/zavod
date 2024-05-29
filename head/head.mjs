import express from 'express';
import { getPureItems, saveImageAnalysis, getImages, getAllImageIds } from './database.mjs';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const saverLookup = {
  'analyzeImage': saveImageAnalysis,
};

const app = express();
app.use(express.json());

let tasks = [];

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

app.listen(process.env.HEAD_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.HEAD_PORT}/task`);

  console.log('composing tasks...');
  console.time('composed tasks');
  await composeTasks();
  console.log(chalk.green(`prepared ${tasks.length} tasks`));
  console.timeEnd('composed tasks');
});