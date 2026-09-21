const fs = require('fs');

const dlFile = 'C:/Users/nilav/Downloads/SkillsAndCertifications_SMOOTH_CARD_DECK_CERTIFICATES_FLIP_ANIMATION_FINAL.tsx';
const targetFile = 'src/sections/Certifications.tsx';

const dlContent = fs.readFileSync(dlFile, 'utf8');

// Extract SUPPLIED_IHUB_CERTIFICATE and SUPPLIED_LPU_CERTIFICATE
const ihubMatch = dlContent.match(/const SUPPLIED_IHUB_CERTIFICATE = ("[^"]+");/);
const lpuMatch = dlContent.match(/const SUPPLIED_LPU_CERTIFICATE = ("[^"]+");/);

if (!ihubMatch || !lpuMatch) {
  console.error('Could not find base64 certificates in dlFile');
  process.exit(1);
}

// Extract Certifications code from line 699 (function certificateKey) to line 1698 (end of CERTIFICATION_STYLES)
const certKeyIndex = dlContent.indexOf('function certificateKey(cert: CertificationItem)');
const certStylesEndIndex = dlContent.indexOf('function useReducedMotionPreference()');

if (certKeyIndex === -1 || certStylesEndIndex === -1) {
  console.error('Indices not found:', { certKeyIndex, certStylesEndIndex });
  process.exit(1);
}

const certBody = dlContent.slice(certKeyIndex, certStylesEndIndex).trim();

// Construct the complete standalone src/sections/Certifications.tsx
const newCertFileContent = `import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import type {
  CSSProperties,
} from 'react';

import {
  Award,
  Calendar,
  Download,
  Eye,
  Rotate3D,
  X,
} from 'lucide-react';

import { certificationsData } from '../data/certifications';
import type { CertificationItem } from '../types/portfolio';

const SUPPLIED_IHUB_CERTIFICATE = ${ihubMatch[1]};
const SUPPLIED_LPU_CERTIFICATE = ${lpuMatch[1]};

type LocalCertificate = CertificationItem & {
  isSupplied?: boolean;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

${certBody}
`;

fs.writeFileSync(targetFile, newCertFileContent, 'utf8');
console.log('Successfully wrote standalone Certifications.tsx with flip animation and no duplicates!');
