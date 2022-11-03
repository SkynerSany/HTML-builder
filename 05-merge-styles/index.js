const { createWriteStream } = require('fs');
const { readdir, readFile } = require('node:fs/promises');
const path = require('path');

async function copyFolder() {
  let styles = [];
  const fileDist = path.join(__dirname, 'project-dist', 'bundle.css');
  const baseFolder = path.join(__dirname, 'styles');
  const files = await readdir(baseFolder, { withFileTypes: true });

  for (const file of files) {
    const fileLink = path.join(baseFolder, file.name);

    if (path.extname(fileLink) !== '.css') break;
    
    const fileData = readFile(fileLink);
    const data = await fileData;
    styles.push(data.toString());
  }

  const distFile = createWriteStream(fileDist);
  distFile.write(styles.join('\n'));
}

copyFolder();