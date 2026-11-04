// Copies the shared game files from the desktop app into www/, so both apps run the same code.
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '..', '..', 'Offline Minesweeper', 'resources', 'app');
const target = path.resolve(__dirname, '..', 'www');
const skip = new Set(['electron-main.js', 'package.json']);

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true, filter: file => !skip.has(path.basename(file)) });
console.log(`Copied game from ${source} to ${target}`);

// UltraSweeper Lite: only index.html differs. Android's "lite" flavor uses it in place of the main one,
// and the iPhone build swaps it in for its second app (see .github/workflows).
const { liteIndex } = require(path.resolve(source, '..', '..', 'make-lite.js'));
const lite = liteIndex(source);
for (const dir of [path.resolve(__dirname, '..', 'android', 'app', 'src', 'lite', 'assets', 'public'), path.resolve(__dirname, '..', 'www-lite')]) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), lite);
}
console.log('Made the UltraSweeper Lite index.html');
