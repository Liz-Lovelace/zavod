import FS from 'fs';
const fs = {
  ...FS.promises,
  createWriteStream: FS.createWriteStream,
};
import axios from 'axios';
import chalk from 'chalk';

export async function memo(dir, filename, callback) {
  if (!(await fs.readdir(new URL('file:./', dir))).includes(filename)) {
    return callback();
  }
}

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