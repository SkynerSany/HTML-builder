const { createWriteStream, rm } = require('fs');
const { mkdir, readdir, readFile, copyFile, stat } = require('node:fs/promises');
const path = require('path');

function removeAssets() {
  const folderCopy = path.join(__dirname, 'project-dist');
  return new Promise(resolve => {
    rm(folderCopy, { recursive: true }, () => resolve());
  }) 
}

async function copyFolder(copy, base) {
  const folderCopy = copy ? copy : path.join(__dirname, 'project-dist', 'assets');
  const baseFolderLink = base ? base : path.join(__dirname, 'assets');
  const files = await readdir(baseFolderLink);
  
  await mkdir(folderCopy, { recursive: true });
  
  for await(const file of files) {
    if ( (await stat(path.join(baseFolderLink, file))).isDirectory() ) {
      copyFolder(path.join(folderCopy, file), path.join(baseFolderLink, file));
    } else {
      await copyFile(path.join(baseFolderLink, file), path.join(folderCopy, file));
    }
  }
}

function bundleStyles() {
  bundle('styles', 'style.css', '.css')
}

function bundleHtml() {
  bundle('components', 'index.html', '.html')
}

async function bundle(base, dist, type) {
  let bundleData = type === '.html' ? {} : [];
  const fileDist = path.join(__dirname, 'project-dist', dist);
  const baseFolder = path.join(__dirname, base);
  const files = await readdir(baseFolder, { withFileTypes: true });

  for (const file of files) {
    const fileLink = path.join(baseFolder, file.name);

    if (path.extname(fileLink) !== type) continue;
    
    const fileData = await readFile(fileLink);
    const fileType = path.extname(fileLink);
    const fileName = path.basename(fileLink, fileType);

    if (type === '.html') {
      bundleData[fileName] = fileData.toString();
    } else {
      bundleData.push(fileData.toString());
    }
  }

  const distFile = createWriteStream(fileDist);
  distFile.write(type === '.html' ? await copyOriginalFile(bundleData) : bundleData.join('\n'));
}

async function copyOriginalFile(templates) {
  const originalFile = path.join(__dirname, 'template.html');

  let htmlData = (await readFile(originalFile)).toString();

  Object.keys(templates).forEach(key => {
    htmlData = htmlData.replace(`{{${ key }}}`, templates[key]);
  })

  return htmlData;
}

function start() {
  removeAssets().then(() => {
    copyFolder();
    bundleStyles();
    bundleHtml();
  })
}

start();