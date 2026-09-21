import { personalData } from '../../data/personal';
import { socialsData } from '../../data/socials';
import { SECTIONS } from '../../data/sections';
import { Github, Linkedin, Mail, WhatsApp } from '../ui/Icons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__inner">
          <div>
            <p className="footer__name">{personalData.name}</p>
            <p className="footer__role">{personalData.shortStatement}</p>

            <div className="footer__socials">
              <a
                className="hero__social"
                href={socialsData.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <Github size={18} />
              </a>
              <a
                className="hero__social"
                href={socialsData.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                <Linkedin size={18} />
              </a>
              <a className="hero__social" href={socialsData.email} aria-label="Send an email">
                <Mail size={18} />
              </a>
              {socialsData.whatsapp && (
                <a
                  className="hero__social"
                  href={socialsData.whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Message on WhatsApp (opens in a new tab)"
                >
                  <WhatsApp size={18} />
                </a>
              )}
            </div>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {SECTIONS.map(section => (
              <a key={section.id} className="footer__link" href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bar">
          <span>
            © {year} {personalData.name}
          </span>
          <span>{personalData.location}</span>
        </div>
      </div>
    </footer>
  );
}
