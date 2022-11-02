const { mkdir, copyFile, readdir, unlink } = require('node:fs/promises');
const path = require('path');

async function copyFolder() {
  const folderCopy = path.join(__dirname, 'files-copy');
  const baseFolderLink = path.join(__dirname, 'files');
  const files = await readdir(baseFolderLink);
  
  await mkdir(folderCopy, { recursive: true });
  const filesCopy = await readdir(folderCopy);

  for (const file of filesCopy) {
    await unlink(path.join(folderCopy, file));
  }

  for (const file of files) {
    await copyFile(path.join(baseFolderLink, file), path.join(folderCopy, file));
  }
}

copyFolder();