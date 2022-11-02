const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

async function getFiles() {
  const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const dirent of files) {
      const fileLink = path.join(__dirname, 'secret-folder', dirent.name);
      const fileLog = fs.statSync(fileLink);
      const fileType = path.extname(fileLink);
      const fileName = path.basename(fileLink, fileType);
      if (fileLog.isFile()) {
        console.log(`${fileName} - ${fileType.slice(1)} - ${fileLog.size / 1024}kb`);
      }
    }
}

getFiles();