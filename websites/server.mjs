import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { listObjects, renderedImageURLfromFilename } from '../lib/storage.mjs';
import { shuffle } from '../lib/utils.mjs';
import chalk from 'chalk';


dotenv.config();

let renderedImages = [];

refreshRenderedImages();
setInterval(refreshRenderedImages, 5 * 60 * 1000);

async function refreshRenderedImages() {
  console.log('refreshing rendered images...')
  renderedImages = await listObjects(process.env.S3_IMAGERENDER_BUCKET_NAME);
  renderedImages = renderedImages.map(filename => renderedImageURLfromFilename(filename));
  console.log(chalk.green('refreshed rendered images...'))
}

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(express.static(new URL('public', import.meta.url).pathname));

app.post('/images', async(req, res) => {
  let options = req.body;
  console.log(options);
  // options = {};
  let images = await prisma.image.findMany(options);

  res.json(images);
});

app.post('/rendered-images', async(req, res) => {
  let options = req.body;
  console.log(options);
  // options = {};
  shuffle(renderedImages)

  res.json(renderedImages.slice(0, options.take));
});

app.use('/performance', createProxyMiddleware({
  target: `http://localhost:${process.env.HEAD_PORT}/performance`,
  changeOrigin: true,
}));

app.listen(process.env.WEBSITES_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.WEBSITES_PORT}`);
});