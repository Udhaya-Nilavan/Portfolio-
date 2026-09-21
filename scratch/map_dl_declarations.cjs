const fs = require('fs');

const dlFile = 'C:/Users/nilav/Downloads/SkillsAndCertifications_SMOOTH_CARD_DECK_CERTIFICATES_FLIP_ANIMATION_FINAL.tsx';
const dlContent = fs.readFileSync(dlFile, 'utf8');

// Find all function declarations, interfaces, const definitions
const lines = dlContent.split('\n');
lines.forEach((l, idx) => {
  if (
    l.startsWith('export ') ||
    l.startsWith('function ') ||
    l.startsWith('const SUPPLIED_') ||
    l.startsWith('const SMOOTH_') ||
    l.startsWith('const CERTIFICATION_')
  ) {
    console.log(`Line ${idx + 1}: ${l.slice(0, 80)}`);
  }
});
