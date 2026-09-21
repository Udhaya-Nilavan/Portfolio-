import { useCallback, useState } from 'react';
import { personalData } from '../data/personal';
import { socialsData } from '../data/socials';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/Primitives';
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  WhatsApp,
} from '../components/ui/Icons';
import { ContactBlueprint } from '../components/blueprint/TechnicalBlueprint';

interface Row {
  key: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  icon: (p: { size?: number }) => React.JSX.Element;
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const emailAddress = personalData.email;

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked; the mailto link below still works.
      setCopied(false);
    }
  }, [emailAddress]);

  const rows: Row[] = [
    {
      key: 'email',
      label: 'Email',
      value: personalData.email,
      href: socialsData.email,
      icon: Mail,
    },
    ...(personalData.phone
      ? [
          {
            key: 'phone',
            label: 'Phone',
            value: personalData.phone,
            href: `tel:${socialsData.phone ?? personalData.phone.replace(/\s/g, '')}`,
            icon: Phone,
          } as Row,
        ]
      : []),
    ...(socialsData.whatsapp && personalData.whatsapp
      ? [
          {
            key: 'whatsapp',
            label: 'WhatsApp',
            value: personalData.whatsapp,
            href: socialsData.whatsapp,
            external: true,
            icon: WhatsApp,
          } as Row,
        ]
      : []),
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: 'in/udhaya-nilavan',
      href: socialsData.linkedin,
      external: true,
      icon: Linkedin,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: 'Udhaya-Nilavan',
      href: socialsData.github,
      external: true,
      icon: Github,
    },
    {
      key: 'location',
      label: 'Based in',
      value: personalData.location,
      href: `https://www.google.com/maps/search/${encodeURIComponent(personalData.location)}`,
      external: true,
      icon: MapPin,
    },
  ];

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="shell">
        <SectionHeader
          id="contact-title"
          index="08"
          kicker="Contact"
          title="Let's talk"
          subtitle={personalData.statusBadge.label}
        />

        <div className="contact__grid">
          <Reveal motion="slide-left">
            <div className="contact__links">
              {rows.map(row => {
                const Icon = row.icon;
                return (
                  <a
                    key={row.key}
                    className="contact-row"
                    href={row.href}
                    {...(row.external
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                  >
                    <span className="contact-row__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="contact-row__label">{row.label}</span>
                      <br />
                      <span className="contact-row__value">{row.value}</span>
                    </span>
                    <ArrowUpRight size={16} className="contact-row__go" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={90} motion="scale">
            <div className="contact__panel">
              <h3>Start a conversation</h3>
              <p>
                The quickest way to reach me is email or WhatsApp. My full CV covers my
                education, technical skills, projects, certifications and current AI training.
              </p>

              <div className="contact__panel-actions">
                <a className="btn btn--primary" href={socialsData.email}>
                  <Mail size={16} className="btn__icon" />
                  Email me
                </a>

                <button className="btn btn--secondary" onClick={copyEmail}>
                  {copied ? <Check size={16} className="btn__icon" /> : <Copy size={16} className="btn__icon" />}
                  {copied ? 'Address copied' : 'Copy address'}
                </button>
              </div>

              <div className="contact__panel-actions">
                <a
                  className="btn btn--secondary"
                  href={personalData.resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Eye size={16} className="btn__icon" />
                  View CV
                </a>

                <a className="btn btn--ghost" href={personalData.resumeUrl} download>
                  <Download size={16} className="btn__icon btn__icon--lift" />
                  Download CV
                </a>
              </div>

              <p className="contact__note">
                <FileText size={15} aria-hidden="true" />
                Resume: Udhaya Nilavan — CV 3 (PDF)
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <ContactBlueprint />
    </section>
  );
}
