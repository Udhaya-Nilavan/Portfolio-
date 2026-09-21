import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { personalData } from '../../data/personal';
import { certificationsData } from '../../data/certifications';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { educationData } from '../../data/education';
import { industryTrainingData } from '../../data/industryTraining';
import FloatingAIAssistant from './FloatingAIAssistant';
import './AIChatbotDrawer.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; href?: string; actionType?: string }[];
}

const QUICK_PROMPTS = [
  'Verified Certifications',
  'Agentic AI Program (IIT Roorkee)',
  'Top ML Projects',
  'LPU Degree & CGPA',
  'Contact & Resume',
];

function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={keyIdx++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={keyIdx++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={keyIdx++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
}

function renderMessageText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {formatInlineMarkdown(line)}
      {idx < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export const AIChatbotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am **Udhaya's Portfolio AI Assistant**, grounded strictly in his verified academic credentials at LPU, official Oracle certifications, IIT Roorkee × Masai Agentic AI specialization, and engineering projects.\n\nHow can I help you explore his technical work?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Oracle Credentials', href: '#certifications' },
        { label: 'Agentic AI Program', href: '#training' },
        { label: 'Featured Projects', href: '#projects' },
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const generateGroundedAnswer = (userQuery: string): ChatMessage => {
    const q = userQuery.toLowerCase();
    const p = personalData;
    const certs = certificationsData;
    const training = industryTrainingData[0];
    const projs = projectsData;
    const edu = educationData[0];

    // 1. Certifications & Badges (OCI Data Science & GenAI)
    if (
      q.includes('certif') ||
      q.includes('oci') ||
      q.includes('oracle') ||
      q.includes('badge') ||
      q.includes('credential')
    ) {
      const oracleCertifications = certs.filter(c => c.kind === 'certification');
      const certificates = certs.filter(c => c.kind === 'certificate');
      const formatCredential = (items: typeof certs) =>
        items
          .map(
            c =>
              `• **${c.title}** (${c.issuer})\n  *Issued:* ${c.date}${c.credentialId ? ` · *Credential ID:* \`${c.credentialId}\`` : ''}`
          )
          .join('\n\n');

      const oracleDetails = formatCredential(oracleCertifications);
      const certificateDetails = formatCredential(certificates);

      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `**Professional certifications**\n\n${oracleDetails}\n\n**Certificates and completion records**\n\n${certificateDetails}\n\nThe **Certifications** section shows the original certificate documents first. Matching digital badges are surfaced separately in **Achievements**.`,
        timestamp: 'Just now',
        actions: [
          { label: 'View Certifications', href: '#certifications' },
          { label: 'OCI Data Science PDF', href: certs[0]?.certificateFile ?? '#certifications' },
        ],
      };
    }

    // 2. Agentic AI & IIT Roorkee / Masai School
    if (
      q.includes('agentic') ||
      q.includes('iit') ||
      q.includes('roorkee') ||
      q.includes('masai') ||
      q.includes('langgraph') ||
      q.includes('multi-agent') ||
      q.includes('rag') ||
      q.includes('crewai') ||
      q.includes('autogen')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Udhaya is actively completing a specialized industry program in **Agentic Systems and Design** offered by **iHUB DivyaSampark, IIT Roorkee** in collaboration with **Masai School** (Student Code: \`${training?.credentialId ?? 'iitr_as_2603353'}\`, Mar 2026 – Oct 2026).\n\n**Core Competencies Covered:**\n• Multi-agent orchestration with LangChain, CrewAI & AutoGen\n• Deterministic tool calling loops, JSON schema generation & API integration\n• Memory persistence & Vector search (ChromaDB / Vector databases)\n• RAG pipelines & autonomous agent architectures`,
        timestamp: 'Just now',
        actions: [
          { label: 'View Industry Program', href: '#training' },
          { label: 'IIT Roorkee Capstone', href: '#training' },
        ],
      };
    }

    // 3. Academic Standing / LPU Education
    if (
      q.includes('lpu') ||
      q.includes('degree') ||
      q.includes('college') ||
      q.includes('university') ||
      q.includes('cgpa') ||
      q.includes('education') ||
      q.includes('study') ||
      q.includes('semester') ||
      q.includes('year')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Udhaya is pursuing a **Bachelor of Technology (B.Tech) in Computer Engineering** at **Lovely Professional University (LPU)**, Punjab, India (${edu?.duration ?? '2024 – 2028'}).\n\n• **Academic Standing:** ${edu?.standing ?? 'CGPA: 7.4'}\n• **Specialization Focus:** Data Science, Machine Learning & Agentic AI\n• **Core Coursework:** Data Science & Statistical Modeling, ML, DBMS & SQL, DSA, OOP`,
        timestamp: 'Just now',
        actions: [{ label: 'View Education Section', href: '#education' }],
      };
    }

    // 4. Featured Projects
    if (
      q.includes('project') ||
      q.includes('built') ||
      q.includes('work') ||
      q.includes('portfolio') ||
      q.includes('github') ||
      q.includes('drowsiness') ||
      q.includes('healthcare')
    ) {
      const projList = projs
        .map(
          pj =>
            `• **${pj.title}** (${pj.categoryLabel})\n  *Focus:* ${pj.shortDescription}`
        )
        .join('\n\n');

      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Here are Udhaya's primary featured projects:\n\n${projList}\n\nEach project includes architectural flowcharts, technology stacks, and direct GitHub links!`,
        timestamp: 'Just now',
        actions: [
          { label: 'Explore Projects Section', href: '#projects' },
          { label: 'GitHub Profile', href: 'https://github.com/Udhaya-Nilavan' },
        ],
      };
    }

    // 5. Skills & Tech Stack
    if (
      q.includes('skill') ||
      q.includes('stack') ||
      q.includes('tech') ||
      q.includes('python') ||
      q.includes('machine learning') ||
      q.includes('data science') ||
      q.includes('sql') ||
      q.includes('tableau') ||
      q.includes('power bi')
    ) {
      const categoriesSummary = skillsData
        .map(cat => `• **${cat.name}:** ${cat.skills.map(s => s.name).join(', ')}`)
        .join('\n');

      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Udhaya's technical stack is focused on modern Data Science, ML, and Agentic AI:\n\n${categoriesSummary}\n\nYou can interact with the live skill inspector in the **Skills** section to inspect proficiencies!`,
        timestamp: 'Just now',
        actions: [{ label: 'Inspect Skills Matrix', href: '#skills' }],
      };
    }

    // 6. Contact / Resume / Hire
    if (
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('hire') ||
      q.includes('resume') ||
      q.includes('cv') ||
      q.includes('whatsapp') ||
      q.includes('phone') ||
      q.includes('intern') ||
      q.includes('job')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Udhaya is currently **${p.statusBadge.label}**:\n\n• **Email:** ${p.email}\n• **Phone / WhatsApp:** ${p.phone}\n• **Location:** ${p.location}\n• **Resume:** Official CV 3 is available for viewing and PDF download.`,
        timestamp: 'Just now',
        actions: [
          { label: 'Download Resume (CV 3)', href: p.resumeUrl },
          { label: 'Send Email', href: `mailto:${p.email}` },
          { label: 'Go to Contact Section', href: '#contact' },
        ],
      };
    }

    // Default Guardrailed Response
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `I am specifically trained on **Udhaya Nilavan's** verified portfolio, academic standing at LPU (${edu?.degree}, ${edu?.standing}), OCI Data Science & Generative AI certifications, IIT Roorkee/Masai Agentic AI training, and ML projects.\n\nWhat aspect of his work would you like to explore?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Verified Certifications', href: '#certifications' },
        { label: 'Agentic AI Program', href: '#training' },
        { label: 'Explore Projects', href: '#projects' },
        { label: 'Get in Touch', href: '#contact' },
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      // Try backend endpoint if present
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
      historyPayload.push({ role: 'user', content: text });

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          portfolioData: {
            personal: personalData,
            education: educationData,
            skills: skillsData,
            projects: projectsData,
            certifications: certificationsData,
            industryTraining: industryTrainingData,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages(prev => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'assistant',
              text: data.reply,
              timestamp: 'Just now',
            },
          ]);
          setIsTyping(false);
          return;
        }
      }

      // Offline / client-side grounded fallback
      const fallbackMsg = generateGroundedAnswer(text);
      setMessages(prev => [...prev, fallbackMsg]);
    } catch {
      // Network error or local build: fallback immediately
      const fallbackMsg = generateGroundedAnswer(text);
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'assistant',
        text: `Chat reset. I am ready to answer any questions about Udhaya Nilavan's verified data, credentials, and projects.`,
        timestamp: 'Just now',
        actions: [
          { label: 'Oracle Credentials', href: '#certifications' },
          { label: 'Agentic AI Program', href: '#training' },
          { label: 'Featured Projects', href: '#projects' },
        ],
      },
    ]);
  };

  const handleActionClick = (href?: string) => {
    if (!href) return;
    if (href.startsWith('#')) {
      setIsOpen(false);
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Floating 3D AI Assistant Launcher */}
      <FloatingAIAssistant isOpen={isOpen} onOpen={() => setIsOpen(true)} />

      {/* Chat Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="chatbot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              className="chatbot-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              role="dialog"
              aria-label="Portfolio AI Assistant"
            >
              {/* Header */}
              <div className="chatbot-header">
                <div className="chatbot-header__identity">
                  <div className="chatbot-header__avatar">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="chatbot-header__title">
                      Portfolio AI
                      <span className="chatbot-header__badge">Grounded</span>
                    </div>
                    <div className="chatbot-header__subtitle">
                      Udhaya Nilavan • LPU CSE Data Science & ML
                    </div>
                  </div>
                </div>

                <div className="chatbot-header__actions">
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="chatbot-header__btn"
                    title="Reset conversation"
                    aria-label="Reset conversation"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="chatbot-header__btn"
                    title="Close AI assistant"
                    aria-label="Close AI assistant"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Suggestions Chips Bar */}
              <div className="chatbot-suggestions">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="chatbot-suggestion-pill"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div className="chatbot-messages">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`chatbot-msg-row ${
                      msg.sender === 'user'
                        ? 'chatbot-msg-row--user'
                        : 'chatbot-msg-row--assistant'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="chatbot-avatar chatbot-avatar--bot">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`chatbot-bubble ${
                        msg.sender === 'user'
                          ? 'chatbot-bubble--user'
                          : 'chatbot-bubble--assistant'
                      }`}
                    >
                      <div className="chatbot-bubble__content">
                        {renderMessageText(msg.text)}
                      </div>

                      {msg.actions && msg.actions.length > 0 && (
                        <div className="chatbot-bubble__actions">
                          {msg.actions.map((act, idx) => (
                            <a
                              key={idx}
                              href={act.href}
                              onClick={() => handleActionClick(act.href)}
                              className="chatbot-action-chip"
                              {...(act.href?.startsWith('http')
                                ? { target: '_blank', rel: 'noreferrer noopener' }
                                : {})}
                            >
                              <span>{act.label}</span>
                              <ExternalLink size={11} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="chatbot-avatar chatbot-avatar--user">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="chatbot-msg-row chatbot-msg-row--assistant">
                    <div className="chatbot-avatar chatbot-avatar--bot">
                      <Bot size={15} />
                    </div>
                    <div className="chatbot-typing">
                      <span className="chatbot-typing__dot" />
                      <span className="chatbot-typing__dot" />
                      <span className="chatbot-typing__dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="chatbot-input-box">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="chatbot-input-form"
                >
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Ask about credentials, ML projects, or LPU..."
                    className="chatbot-input"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isTyping}
                    className="chatbot-send-btn"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="chatbot-input-footer">
                  <span className="chatbot-input-footer__guard">
                    <ShieldCheck size={13} color="#d89e5a" />
                    Grounded in verified portfolio records
                  </span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
