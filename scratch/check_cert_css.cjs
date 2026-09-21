const fs = require('fs');
const content = fs.readFileSync('src/sections/Certifications.tsx', 'utf8');
const match = content.match(/const SMOOTH_CERT_STYLES = `([\s\S]*?)`;/);
if (!match) {
  console.log('Not found');
  process.exit(1);
}
const css = match[1];
const selectors = [];
const regex = /([^{}]+)\{/g;
let m;
while ((m = regex.exec(css)) !== null) {
  const sel = m[1].trim();
  if (!sel.startsWith('@keyframes')) {
    selectors.push(sel);
  }
}
console.log('Selectors count:', selectors.length);
selectors.forEach(s => console.log(s));
