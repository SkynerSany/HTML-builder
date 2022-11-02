const fs = require('fs');
const path = require('path');

const file = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
file.on('data', (text) => console.log(text));