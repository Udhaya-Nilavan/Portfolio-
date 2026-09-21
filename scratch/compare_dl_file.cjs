const fs = require('fs');

const dlFile = 'C:/Users/nilav/Downloads/SkillsAndCertifications_SMOOTH_CARD_DECK_CERTIFICATES_FLIP_ANIMATION_FINAL.tsx';
const currentSkillsFile = 'src/sections/Skills.tsx';
const currentCertsFile = 'src/sections/Certifications.tsx';

const dlContent = fs.readFileSync(dlFile, 'utf8');
const curSkills = fs.readFileSync(currentSkillsFile, 'utf8');
const curCerts = fs.readFileSync(currentCertsFile, 'utf8');

console.log('Download file total length:', dlContent.length);
console.log('Current Skills length:', curSkills.length);
console.log('Current Certs length:', curCerts.length);

// Check if Skills in download file has the right panel fix (.smooth-deck-column relative, .smooth-details z-index 220)
const hasDeckZIndex = dlContent.includes('z-index: 1') || dlContent.includes('z-index:1');
const hasDetailsZIndex = dlContent.includes('z-index: 220') || dlContent.includes('z-index:220');
console.log('Download file has deck z-index: 1?', hasDeckZIndex);
console.log('Download file has details z-index: 220?', hasDetailsZIndex);

// Let's check Certifications in download file
const hasFlip = dlContent.includes('flip') || dlContent.includes('Flip') || dlContent.includes('is-flipped') || dlContent.includes('rotateY(180deg)');
console.log('Download file has flip in certs?', hasFlip);

// Let's see how Certifications is structured in the download file
const certIndex = dlContent.indexOf('export function Certifications');
console.log('Certifications starts at index:', certIndex);
if (certIndex !== -1) {
  const certSnippet = dlContent.slice(certIndex, certIndex + 2000);
  console.log('Certifications snippet:\n', certSnippet);
}
