const fs = require('fs');

const file = 'src/sections/Certifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const newStyles = `const SMOOTH_CERT_STYLES = \`
.smooth-certifications {
  position: relative;
  background: transparent;
  color: #111824;
}

.smooth-certifications__shell {
  width: min(1080px, calc(100% - 40px));
  margin-inline: auto;
  padding: clamp(60px, 8vw, 110px) 0;
}

.smooth-certifications__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 40px;
  align-items: end;
  margin-bottom: 32px;
}

.smooth-certifications__header > div > span {
  display: block;
  color: #8a775d;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: .67rem;
  font-weight: 700;
  letter-spacing: .17em;
  text-transform: uppercase;
}

.smooth-certifications__header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  line-height: .92;
  letter-spacing: -.05em;
  color: #111824;
}

.smooth-certifications__header p {
  margin: 0 0 4px;
  color: #5d6674;
  line-height: 1.6;
  font-size: .92rem;
}

.smooth-certifications__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  justify-items: center;
}

.smooth-certificate-card {
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  border: 1px solid rgba(184, 154, 104, .34);
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 10px 28px rgba(184, 154, 104, .08),
    0 3px 10px rgba(15, 23, 42, .035);
  display: flex;
  flex-direction: column;
  transition: transform .25s ease, box-shadow .25s ease;
}

.smooth-certificate-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 36px rgba(184, 154, 104, .14),
    0 5px 14px rgba(15, 23, 42, .05);
}

.smooth-certificate-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 210px;
  padding: 10px 14px;
  border: 0;
  border-bottom: 1px solid rgba(184, 154, 104, .2);
  overflow: hidden;
  background: #f8f7f4;
  cursor: pointer;
}

.smooth-certificate-image img {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  border-radius: 6px;
  transition: transform .35s cubic-bezier(.22, 1, .36, 1);
}

.smooth-certificate-image:hover img {
  transform: scale(1.02);
}

.smooth-certificate-image__overlay {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(184, 154, 104, .45);
  border-radius: 999px;
  color: #4d4130;
  background: rgba(255, 255, 255, .94);
  backdrop-filter: blur(8px);
  font: 700 .58rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: .12em;
}

.smooth-certificate-content {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.smooth-certificate-label {
  color: #8f7857;
  font-size: .56rem;
  font-weight: 700;
  letter-spacing: .17em;
  font-family: var(--font-mono, ui-monospace, monospace);
}

.smooth-certificate-content h3 {
  margin: 8px 0 10px;
  color: #111824;
  font-size: 1.2rem;
  line-height: 1.32;
  letter-spacing: -.02em;
  font-weight: 700;
}

.smooth-certificate-issuer,
.smooth-certificate-date {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 5px 0 0;
  color: #4e5867;
  font-size: .85rem;
  line-height: 1.42;
}

.smooth-certificate-issuer svg,
.smooth-certificate-date svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #8f7857;
}

.smooth-certificate-actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding-top: 16px;
  margin-top: auto;
  border-top: 1px solid rgba(17, 24, 39, .07);
}

.smooth-certificate-actions button {
  height: 42px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(184, 154, 104, .34);
  border-radius: 999px;
  background: #fff;
  color: #222c39;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .03em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all .2s ease;
}

.smooth-certificate-actions button:hover,
.smooth-certificate-actions button:focus-visible {
  outline: none;
  border-color: rgba(184, 154, 104, .65);
  box-shadow: 0 6px 16px rgba(184, 154, 104, .14);
}

.smooth-certificate-actions button.primary {
  color: #fff;
  background: #101722;
  border-color: #101722;
}

.smooth-certificate-actions button.primary:hover {
  background: #1f2937;
  border-color: #1f2937;
}

.smooth-certificate-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  color: #8f7857;
  background: #f6f5f0;
  font: 700 .65rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: .12em;
  text-transform: uppercase;
}

.certificate-modal {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: grid;
  place-items: center;
  padding: 20px;
}

.certificate-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(10, 14, 21, .62);
  backdrop-filter: blur(8px);
}

.certificate-modal__panel {
  position: relative;
  z-index: 1;
  width: min(1120px, 100%);
  max-height: min(90vh, 900px);
  overflow: auto;
  border: 1px solid rgba(184, 154, 104, .52);
  border-radius: 24px;
  background: #fff;
  box-shadow:
    0 35px 90px rgba(8, 12, 18, .30),
    0 10px 30px rgba(184, 154, 104, .16);
}

.certificate-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(17, 24, 39, .14);
  border-radius: 50%;
  background: rgba(255, 255, 255, .95);
  color: #111824;
  cursor: pointer;
}

.certificate-modal__image-wrap {
  display: grid;
  place-items: center;
  padding: 34px;
  background: #f4f4f0;
}

.certificate-modal__image-wrap img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 9px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, .14);
}

.certificate-modal__details {
  padding: 54px;
}

.certificate-modal__details > span {
  color: #8f7857;
  font: 700 .59rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: .17em;
}

.certificate-modal__details h3 {
  margin: 14px 0 14px;
  color: #111824;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.certificate-modal__details > p {
  max-width: 70ch;
  color: #556070;
  line-height: 1.62;
}

.certificate-modal__details dl {
  display: grid;
  gap: 0;
  margin: 30px 0 0;
  border-top: 1px solid rgba(17, 24, 39, .09);
}

.certificate-modal__details dl > div {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(17, 24, 39, .09);
}

.certificate-modal__details dt {
  color: #8f7857;
  font: 700 .57rem/1.25 var(--font-mono, ui-monospace, monospace);
  letter-spacing: .14em;
}

.certificate-modal__details dd {
  margin: 0;
  color: #3f4b5b;
  line-height: 1.55;
}

@media (max-width: 820px) {
  .smooth-certifications__shell {
    width: min(100% - 32px, 680px);
  }

  .smooth-certifications__header {
    display: block;
  }

  .smooth-certifications__header p {
    margin-top: 14px;
  }

  .smooth-certifications__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .smooth-certificate-card {
    max-width: 520px;
    margin-inline: auto;
  }

  .smooth-certificate-image {
    height: 210px;
  }
}

@media (max-width: 520px) {
  .smooth-certifications__header h2 {
    font-size: 2.3rem;
  }

  .smooth-certifications__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .smooth-certificate-card {
    max-width: 100%;
  }

  .smooth-certificate-image {
    height: 195px;
    padding: 8px 10px;
  }

  .smooth-certificate-content {
    padding: 16px 18px 18px;
  }

  .smooth-certificate-content h3 {
    font-size: 1.1rem;
    line-height: 1.3;
  }

  .smooth-certificate-actions {
    grid-template-columns: auto 1fr;
    gap: 8px;
  }

  .smooth-certificate-actions button {
    height: 40px;
    min-height: 40px;
    padding: 0 12px;
    font-size: .74rem;
  }

  .certificate-modal__details {
    padding: 45px 23px 28px;
  }

  .certificate-modal__details dl > div {
    grid-template-columns: 1fr;
    gap: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .smooth-certificate-card,
  .smooth-certificate-image img {
    transition: none !important;
  }
}
\`;`;

const targetRegex = /const SMOOTH_CERT_STYLES = `[\s\S]*?`;/;
if (!targetRegex.test(content)) {
  console.error('Target regex not found');
  process.exit(1);
}

content = content.replace(targetRegex, newStyles);
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated SMOOTH_CERT_STYLES in', file);
