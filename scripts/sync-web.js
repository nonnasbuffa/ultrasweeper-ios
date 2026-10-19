// Copies the shared game files from the desktop app into www/, so both apps run the same code.
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '..', '..', 'Offline Minesweeper', 'resources', 'app');
const target = path.resolve(__dirname, '..', 'www');
const skip = new Set(['electron-main.js', 'package.json']);

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true, filter: file => !skip.has(path.basename(file)) });
console.log(`Copied game from ${source} to ${target}`);
