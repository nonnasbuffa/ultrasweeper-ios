// Renders resources-src/*.svg into the Android and iOS icon / splash slots.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'resources-src');
const res = path.join(root, 'android', 'app', 'src', 'main', 'res');
const iosAssets = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets');

const read = name => fs.readFileSync(path.join(src, name), 'utf8');
const inner = svg => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const background = read('icon-background.svg');
const foreground = read('icon-foreground.svg');
const combined = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${inner(background)}${inner(foreground)}</svg>`;
const round = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><clipPath id="c"><circle cx="512" cy="512" r="512"/></clipPath></defs><g clip-path="url(#c)">${inner(background)}${inner(foreground)}</g></svg>`;
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><clipPath id="c"><rect width="1024" height="1024" rx="180"/></clipPath></defs><g clip-path="url(#c)">${inner(background)}${inner(foreground)}</g></svg>`;
const splash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  <defs><radialGradient id="bg" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#16263a"/><stop offset="1" stop-color="#0b0e15"/></radialGradient></defs>
  <rect width="2732" height="2732" fill="url(#bg)"/>
  <g transform="translate(1066 1066) scale(0.586)">${inner(foreground)}</g>
</svg>`;

const png = (svg, width, height = width, fit = 'cover') => sharp(Buffer.from(svg), { density: 300 }).resize(width, height, { fit }).png();

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const splashPortrait = { mdpi: [320, 480], hdpi: [480, 800], xhdpi: [720, 1280], xxhdpi: [960, 1600], xxxhdpi: [1280, 1920] };

(async () => {
  for (const [density, factor] of Object.entries(densities)) {
    const dir = path.join(res, `mipmap-${density}`);
    fs.mkdirSync(dir, { recursive: true });
    await png(rounded, 48 * factor).toFile(path.join(dir, 'ic_launcher.png'));
    await png(round, 48 * factor).toFile(path.join(dir, 'ic_launcher_round.png'));
    await png(foreground, 108 * factor).toFile(path.join(dir, 'ic_launcher_foreground.png'));
    await png(background, 108 * factor).toFile(path.join(dir, 'ic_launcher_background.png'));
    const [w, h] = splashPortrait[density];
    await png(splash, w, h).toFile(path.join(res, `drawable-port-${density}`, 'splash.png'));
    await png(splash, h, w).toFile(path.join(res, `drawable-land-${density}`, 'splash.png'));
  }
  await png(splash, 480, 320).toFile(path.join(res, 'drawable', 'splash.png'));

  // Adaptive icon uses the gradient background image instead of a flat colour.
  for (const name of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
    const file = path.join(res, 'mipmap-anydpi-v26', name);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('@color/ic_launcher_background', '@mipmap/ic_launcher_background'));
  }

  // iOS: a single 1024px opaque icon (Xcode derives the other sizes) and the splash image.
  await png(combined, 1024).flatten({ background: '#0b0e15' }).toFile(path.join(iosAssets, 'AppIcon.appiconset', 'AppIcon-512@2x.png'));
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    await png(splash, 2732).toFile(path.join(iosAssets, 'Splash.imageset', name));
  }
  // Preview copy for checking the artwork.
  await png(rounded, 512).toFile(path.join(src, 'icon-preview.png'));
  console.log('Icons and splash screens written.');
})();
