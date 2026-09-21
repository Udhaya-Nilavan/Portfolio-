const fs = require('fs');

const dlFile = 'C:/Users/nilav/Downloads/SkillsAndCertifications_SMOOTH_CARD_DECK_CERTIFICATES_FLIP_ANIMATION_FINAL.tsx';
const dlContent = fs.readFileSync(dlFile, 'utf8');

const certIndex = dlContent.indexOf('export function Certifications');
const skillsPart = dlContent.slice(0, certIndex);
const certsPart = dlContent.slice(certIndex);

console.log('Skills part length:', skillsPart.length);
console.log('Certs part length:', certsPart.length);

// Compare skillsPart with current src/sections/Skills.tsx
const curSkills = fs.readFileSync('src/sections/Skills.tsx', 'utf8');
console.log('curSkills length:', curSkills.length);

// Check if skillsPart in dlFile is almost identical to current Skills.tsx
// Let's check imports in skillsPart
console.log('SkillsPart imports:\n', skillsPart.slice(0, 500));
