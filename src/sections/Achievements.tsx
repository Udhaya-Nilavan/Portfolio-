import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievementsData } from '../data/achievements';
import { certificationsData } from '../data/certifications';
import { SectionHeader } from '../components/ui/Primitives';
import { Award, ArrowUpRight, HackerRankIcon, LeetCodeIcon } from '../components/ui/Icons';
import './Achievements.css';

function AchievementCard({ ach, index }: { ach: typeof achievementsData[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const Icon = ach.platform === 'hackerrank' ? HackerRankIcon : LeetCodeIcon;
  const accentColor = ach.platform === 'hackerrank' ? '#2EC866' : '#FFA116';

  return (
    <motion.div
      ref={ref}
      className="achievement__card"
      data-platform={ach.platform}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="achievement__logo-wrap"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: index * 0.12 + 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ ['--achievement-accent' as string]: accentColor }}
      >
        <Icon size={40} className="achievement__logo" />
      </motion.div>

      <div className="achievement__content">
        <div className="achievement__header">
          <span className="achievement__platform-label mono">{ach.platformLabel}</span>
          <div className="achievement__title-wrap">
            <motion.h3
              className="achievement__title"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 0.55, delay: index * 0.12 + 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {ach.title}
            </motion.h3>
          </div>
        </div>

        <motion.p
          className="achievement__statement"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.45, delay: index * 0.12 + 0.28 }}
        >
          {ach.statement}
        </motion.p>

        <motion.div
          className="achievement__footer"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: index * 0.12 + 0.38 }}
        >
          <span className="achievement__meta mono">{ach.metadata}</span>
          <a
            href={ach.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="achievement__verify-link"
            aria-label={`View ${ach.platformLabel} profile`}
          >
            View profile <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CredentialBadgeCard({ cert, index }: { cert: (typeof certificationsData)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  if (!cert.badgeImage) return null;

  return (
    <motion.a
      ref={ref}
      href={cert.verificationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="achievement__badge-card"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`Verify ${cert.title} with ${cert.issuer}`}
    >
      <div className="achievement__badge-image-wrap">
        <img
          className="achievement__badge-image"
          src={cert.badgeImage}
          alt={`Digital badge for ${cert.title}`}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="achievement__badge-content">
        <span className="achievement__badge-issuer mono">{cert.issuer}</span>
        <h3 className="achievement__badge-card-title">{cert.title}</h3>
        <p className="achievement__badge-copy">
          Digital credential badge shown separately from the original certificate document.
        </p>
        <span className="achievement__verify-link">
          Verify credential <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

export function Achievements() {
  const badgeCredentials = certificationsData.filter(cert => Boolean(cert.badgeImage));

  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="shell">
        <SectionHeader
          id="achievements-title"
          index="03"
          kicker="Achievements"
          title="Achievements"
          subtitle="Digital credential badges and coding milestones from verified platforms and ongoing practice."
        />

        {badgeCredentials.length > 0 && (
          <div className="achievement__badge-section">
            <div className="achievement__badge-heading">
              <span className="achievement__platform-label mono">Credential badges</span>
              <h3>Oracle achievement badges</h3>
              <p>Badge artifacts live here; the original certificate documents remain in Certifications.</p>
            </div>

            <div className="achievement__badge-grid">
              {badgeCredentials.map((cert, index) => (
                <CredentialBadgeCard key={cert.id} cert={cert} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="achievement__milestone-section">
          <div className="achievement__badge-heading achievement__milestone-heading">
            <span className="achievement__platform-label mono">
              <Award size={13} aria-hidden="true" /> Practice milestones
            </span>
            <h3>Coding practice</h3>
          </div>

          <div className="achievement__grid">
            {achievementsData.map((ach, index) => (
              <AchievementCard key={ach.id} ach={ach} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
