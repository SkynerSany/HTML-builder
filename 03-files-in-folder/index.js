// const { stat } = require('fs');
const path = require('path');
const { readdir, stat } = require('node:fs/promises');

async function getFiles() {
  const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });

  for (const file of files) {
    const fileLink = path.join(__dirname, 'secret-folder', file.name);
    
    const fileLog = await stat(fileLink);
    const fileType = path.extname(fileLink);
    const fileName = path.basename(fileLink, fileType);

    if (fileLog.isFile()) {
      console.log(`${fileName} - ${fileType.slice(1)} - ${fileLog.size / 1024}kb`);
    }
  }
}

getFiles();