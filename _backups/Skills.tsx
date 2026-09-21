import { useMemo, useState } from 'react';
import { skillsData } from '../data/skills';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/Primitives';
import { techIcon } from '../components/ui/TechIcons';
import { SkillsBlueprint } from '../components/blueprint/TechnicalBlueprint';
import {
  BarChart,
  Brain,
  Code,
  Cpu,
  Database,
  Grid,
  Sparkles,
  Wrench,
} from '../components/ui/Icons';

/**
 * Category icons mapped to existing category ids in skills.ts.
 */
const GROUP_ICONS: Record<string, (p: { size?: number }) => React.JSX.Element> = {
  'data-science': Database,
  'machine-learning': Brain,
  'generative-ai': Sparkles,
  'agentic-ai': Cpu,
  programming: Code,
  tools: Wrench,
  visualization: BarChart,
};

const ALL = 'all';

interface EnrichedSkill {
  name: string;
  isPrimary: boolean;
  proficiencyHint: string;
  categoryName: string;
  categoryId: string;
  usedFor?: string;
  context?: string;
  selfAssessedPct?: number;
}

/**
 * Self-assessed proficiency data for primary programming languages.
 * Explicitly labeled as self-assessed — not verified scores or certifications.
 */
const PROFICIENCY_LANGUAGES: { name: string; pct: number }[] = [
  { name: 'Python', pct: 82 },
  { name: 'SQL', pct: 73 },
  { name: 'Java', pct: 60 },
  { name: 'C++', pct: 58 },
  { name: 'C', pct: 55 },
];

/**
 * Ensures each row has enough technology markers so that when duplicated
 * for the -50% marquee loop, it spans wider than any viewport without gaps.
 * Seamlessly repeats the sequence cyclically to guarantee no adjacent duplicates.
 */
function padRailItems(items: EnrichedSkill[], minCount = 14): EnrichedSkill[] {
  if (items.length === 0) return [];
  const result: EnrichedSkill[] = [];
  while (result.length < minCount) {
    result.push(...items);
  }
  return result;
}

export function Skills() {
  const [active, setActive] = useState<string>(ALL);
  const [inspectedSkill, setInspectedSkill] = useState<EnrichedSkill | null>(null);
  const [showProficiency, setShowProficiency] = useState(false);

  // Aggregate all unique skills across categories
  const allSkills = useMemo<EnrichedSkill[]>(() => {
    const map = new Map<string, EnrichedSkill>();
    skillsData.forEach(cat => {
      cat.skills.forEach(s => {
        if (!map.has(s.name)) {
          map.set(s.name, {
            name: s.name,
            isPrimary: Boolean(s.isPrimary),
            proficiencyHint: s.proficiencyHint || 'Technical skill & verified practical exposure',
            categoryName: cat.name,
            categoryId: cat.id,
            usedFor: s.usedFor,
            context: s.context,
            selfAssessedPct: s.selfAssessedPct,
          });
        }
      });
    });
    return Array.from(map.values());
  }, []);

  // Filter skills for active category
  const currentSkills = useMemo<EnrichedSkill[]>(() => {
    if (active === ALL) return allSkills;
    const cat = skillsData.find(c => c.id === active);
    if (!cat) return [];
    return cat.skills.map(s => ({
      name: s.name,
      isPrimary: Boolean(s.isPrimary),
      proficiencyHint: s.proficiencyHint || 'Technical skill & verified practical exposure',
      categoryName: cat.name,
      categoryId: cat.id,
      usedFor: s.usedFor,
      context: s.context,
      selfAssessedPct: s.selfAssessedPct,
    }));
  }, [active, allSkills]);

  const activeCategory = useMemo(
    () => (active === ALL ? null : skillsData.find(c => c.id === active)),
    [active],
  );

  // Partition skills across Row 1 and Row 2
  // For small categories (< 8 items), include ALL category items in both rows
  // with an offset so rows don't mirror each other, completely avoiding identical item clumps.
  const { row1, row2 } = useMemo(() => {
    if (currentSkills.length < 8) {
      const r1Source = currentSkills;
      const r2Source =
        currentSkills.length > 1
          ? [...currentSkills.slice(1), currentSkills[0]]
          : currentSkills;

      return {
        row1: padRailItems(r1Source, 14),
        row2: padRailItems(r2Source, 14),
      };
    }

    const even = currentSkills.filter((_, i) => i % 2 === 0);
    const odd = currentSkills.filter((_, i) => i % 2 !== 0);

    return {
      row1: padRailItems(even, 14),
      row2: padRailItems(odd, 14),
    };
  }, [currentSkills]);

  // Render a single technology chip
  const renderChip = (skill: EnrichedSkill, key: string, isDuplicate: boolean) => {
    const Icon = techIcon(skill.name);
    const isSelected = inspectedSkill?.name === skill.name;
    return (
      <button
        key={key}
        type="button"
        className="skills__chip"
        data-primary={skill.isPrimary ? 'true' : 'false'}
        data-selected={isSelected ? 'true' : 'false'}
        tabIndex={isDuplicate ? -1 : 0}
        aria-hidden={isDuplicate ? 'true' : undefined}
        onMouseEnter={() => setInspectedSkill(skill)}
        onFocus={() => setInspectedSkill(skill)}
        onClick={() =>
          setInspectedSkill(prev => (prev?.name === skill.name ? null : skill))
        }
        title={skill.name}
      >
        <Icon size={24} className="skills__chip-icon" />
        <span className="skills__chip-name">{skill.name}</span>
        {skill.isPrimary && (
          <span className="skills__chip-dot" title="Core focus area" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHeader
          id="skills-title"
          index="02"
          kicker="Skills"
          title="Technical toolkit"
          subtitle="Grouped by the areas I work in, from coursework, certifications, projects and current training."
        />

        {/* Category Filter Pills */}
        <Reveal motion="rise">
          <div className="skills__tabs" role="group" aria-label="Filter skills by category">
            <button
              type="button"
              className="skills__tab"
              aria-pressed={active === ALL}
              onClick={() => setActive(ALL)}
            >
              <Grid size={15} />
              All
              <span className="skills__tab-count">{allSkills.length}</span>
            </button>

            {skillsData.map(group => {
              const Icon = GROUP_ICONS[group.id] ?? Code;
              return (
                <button
                  key={group.id}
                  type="button"
                  className="skills__tab"
                  aria-pressed={active === group.id}
                  onClick={() => setActive(group.id)}
                >
                  <Icon size={15} />
                  {group.name}
                  <span className="skills__tab-count">{group.skills.length}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Category Editorial Description when specific tab is active */}
        {activeCategory && (
          <div className="skills__category-note" aria-live="polite">
            <p>{activeCategory.description}</p>
          </div>
        )}

        {/* Living Technology Showcase — Two Continuous Looping Rails */}
        <div className="skills__showcase" key={active}>
          <SkillsBlueprint position="top" />
          <div className="skills__rails">
            {/* ROW 1: Right → Left Continuous Infinite Motion */}
            <div
              className="skills__rail"
              aria-label={`${active === ALL ? 'All skills' : activeCategory?.name} rail row one`}
            >
              <div className="skills__track skills__track--left">
                <div className="skills__track-group">
                  {row1.map((skill, idx) => renderChip(skill, `r1-a-${idx}`, false))}
                </div>
                <div className="skills__track-group" aria-hidden="true">
                  {row1.map((skill, idx) => renderChip(skill, `r1-b-${idx}`, true))}
                </div>
              </div>
            </div>

            {/* ROW 2: Left → Right Continuous Infinite Motion */}
            <div
              className="skills__rail"
              aria-label={`${active === ALL ? 'All skills' : activeCategory?.name} rail row two`}
            >
              <div className="skills__track skills__track--right">
                <div className="skills__track-group">
                  {row2.map((skill, idx) => renderChip(skill, `r2-a-${idx}`, false))}
                </div>
                <div className="skills__track-group" aria-hidden="true">
                  {row2.map((skill, idx) => renderChip(skill, `r2-b-${idx}`, true))}
                </div>
              </div>
            </div>
          </div>
          <SkillsBlueprint position="bottom" />
        </div>

        {/* Expanded Live Contextual Inspector */}
        <div className="skills__inspector" aria-live="polite">
          {inspectedSkill ? (
            <div className="skills__inspector-active">
              <div className="skills__inspector-meta">
                <span className="skills__inspector-tag mono">{inspectedSkill.categoryName}</span>
                {inspectedSkill.isPrimary && (
                  <span className="skills__inspector-primary mono">CORE FOCUS</span>
                )}
              </div>
              <div className="skills__inspector-body">
                <div className="skills__inspector-header">
                  {(() => {
                    const Icon = techIcon(inspectedSkill.name);
                    return <Icon size={16} className="skills__inspector-icon" />;
                  })()}
                  <strong className="skills__inspector-name">{inspectedSkill.name}</strong>
                </div>
                {inspectedSkill.usedFor && (
                  <div className="skills__inspector-detail-row">
                    <span className="skills__inspector-detail-label mono">USED FOR</span>
                    <span className="skills__inspector-detail-value">{inspectedSkill.usedFor}</span>
                  </div>
                )}
                {inspectedSkill.context && (
                  <div className="skills__inspector-detail-row">
                    <span className="skills__inspector-detail-label mono">CONTEXT</span>
                    <span className="skills__inspector-detail-value">{inspectedSkill.context}</span>
                  </div>
                )}
                {inspectedSkill.selfAssessedPct && (
                  <div className="skills__inspector-detail-row">
                    <span className="skills__inspector-detail-label mono">PROFICIENCY</span>
                    <span className="skills__inspector-detail-value">
                      <span className="mono" style={{ fontWeight: 650 }}>{inspectedSkill.selfAssessedPct}%</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--subtle-fg)', marginLeft: '0.45rem' }}>
                        (Self-assessed, ongoing practice)
                      </span>
                    </span>
                  </div>
                )}
                {!inspectedSkill.usedFor && (
                  <>
                    <span className="skills__inspector-sep" aria-hidden="true">&mdash;</span>
                    <p className="skills__inspector-text">{inspectedSkill.proficiencyHint}</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="skills__inspector-idle">
              <span className="skills__chip-dot" aria-hidden="true" />
              <span>Hover or tap any technology marker above to inspect its verified credentials &amp; practical context.</span>
            </div>
          )}
        </div>

        {/* Self-Assessed Proficiency Toggle */}
        <Reveal motion="rise">
          <div className="skills__proficiency-section">
            <button
              type="button"
              className="skills__proficiency-toggle"
              onClick={() => setShowProficiency(p => !p)}
              aria-expanded={showProficiency}
            >
              <span>SELF-ASSESSED PROFICIENCY</span>
              <span className="skills__proficiency-toggle-chevron" data-open={showProficiency}>▾</span>
            </button>
            {showProficiency && (
              <div className="skills__proficiency-panel" aria-label="Self-assessed proficiency visualization">
                <p className="skills__proficiency-disclaimer mono">
                  These are personal self-assessments, not verified benchmarks, certification scores, or employer ratings.
                </p>
                <div className="skills__proficiency-bars">
                  {PROFICIENCY_LANGUAGES.map(({ name, pct }) => (
                    <div key={name} className="skills__proficiency-item">
                      <div className="skills__proficiency-row">
                        <span className="skills__proficiency-lang">{name}</span>
                        <span className="skills__proficiency-pct mono">{pct}%</span>
                      </div>
                      <div className="skills__proficiency-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} self-assessed proficiency: ${pct}%`}>
                        <div
                          className="skills__proficiency-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Editorial Legend & Verification Context */}
        <Reveal motion="rise">
          <div className="skills__legend">
            <span>
              <span className="skills__chip-dot" aria-hidden="true" />
              Core focus area
            </span>
            <span className="skills__legend-divider" aria-hidden="true">•</span>
            <span>All technologies grounded in coursework, Oracle certifications &amp; production repositories.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
