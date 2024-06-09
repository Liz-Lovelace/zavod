import FS from 'fs';
const fs = {
  ...FS.promises,
  createWriteStream: FS.createWriteStream,
};
import axios from 'axios';
import chalk from 'chalk';

export async function download(url, outputPath) {
  const filename = outputPath.href.split('/').pop();
  console.log(chalk.blue(`downloading ${url} -> ${filename}`));
  console.time(`downloaded ${url}`);
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.timeEnd(`downloaded ${url}`);
      resolve();
    });
    writer.on('error', reject);
  });
}

export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}