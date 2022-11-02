const fs = require('fs');
const path = require('path');
const process = require('process');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

process.stdout.write('Enter text\n');
process.stdin.on('data', data => {
  if (data == 'exit\r\n') process.exit();
  
  output.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => process.stdout.write('Thanks for checking!'));
