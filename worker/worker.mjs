import dotenv from 'dotenv';
import imageAnalysisWorker from './imageAnalysisWorker.mjs';
import imageDownloadWorker from './imageDownloadWorker.mjs';

dotenv.config();

const workerLookup = {
  'analyzeImage': imageAnalysisWorker,
  'downloadImage': imageDownloadWorker,
};

workForever();

async function workForever() {
  while (true) {
    try {
      await work();
    }
    catch (err) {
      console.log('uncaught error in worker:');
      console.log(err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function work() {
  const { task, taskData } = await fetchHead('/task');

  if (!task) {
    console.log('No more tasks available. Waiting for a second...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  let res = {
    status: null,
    resultData: {},
    task,
    taskData,
  };

  try {
    console.time(task);
    res.resultData = await workerLookup[task](taskData);
    res.status = 'ok';
    res.resultData.error = null;
  }
  catch (err) {
    res.status = 'error';
    res.resultData.error = `${err}`;
  }
  finally {
    console.timeEnd(task);
  }

  if (task == 'downloadImage') {
    return;
  }

  await fetchHead('/task', {
    method: 'POST',
    body: JSON.stringify(res),
  });
}

async function fetchHead(path, options = {}) {
  const url = `${process.env.HEAD_IP}:${process.env.HEAD_PORT}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': process.env.WORKER_SECRET,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 404) {
    return null;
  }

  return response.json();
}