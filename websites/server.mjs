import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createProxyMiddleware } from 'http-proxy-middleware';

const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.static(new URL('public', import.meta.url).pathname));

app.post('/images', async(req, res) => {
  console.time('db');
  const options = req.body;
  let images = await prisma.image.findMany(options);
  console.timeEnd('db');

  res.json(images);
});

app.use('/performance', createProxyMiddleware({
  target: `http://localhost:${process.env.HEAD_PORT}/performance`,
  changeOrigin: true,
}));

app.listen(process.env.WEBSITES_PORT, async() => {
  console.log(`Server is running on http://localhost:${process.env.WEBSITES_PORT}`);
});