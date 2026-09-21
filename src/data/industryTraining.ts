import type { IndustryTrainingItem } from '../types/builder';

export const industryTrainingData: IndustryTrainingItem[] = [
  {
    id: 'iit-roorkee-agentic-systems-design',
    title: 'Certification Program, Agentic Systems and Design',
    provider: 'iHUB DivyaSampark, IIT Roorkee',
    collaboration: 'In collaboration with Masai School',
    duration: 'Mar 2026 – Oct 2026',
    status: 'Active Program',
    credentialId: 'iitr_as_2603353',
    verificationUrl: 'https://masaischool.com',
    certificateImage: '/certificates/masai-iit-roorkee-agentic-systems-certificate.png',
    coreFocus: 'Agentic AI architecture, LLM integration, memory, tool calling, RAG, single-agent and multi-agent orchestration, automation, deployment, monitoring, security, and guardrails.',
    highlights: [
      'Hands-on learning in Large Language Models, Prompt Engineering, RAG, embeddings, vector databases, AI agent memory, tool calling, API integration, and agent evaluation.',
      'Practical exposure to n8n workflows, CrewAI, AutoGen, Make.com, and ChatGPT Agent architectures.',
      'Developing practical expertise in agentic system architectures and transforming technical learning into real projects.',
    ],
    toolsAndFrameworks: [
      'LangChain',
      'Ollama',
      'CrewAI',
      'AutoGen',
      'n8n',
      'Make.com',
      'RAG',
      'Vector Databases',
      'Tool Calling',
      'API Integration',
    ],
    capstoneProject: {
      title: 'Agentic Systems & Design Learning Projects',
      description: 'Practical exploration of LLM-powered applications, RAG pipelines, tool-enabled agents, memory systems, and agentic workflows.',
      tags: ['Agentic AI', 'LLMs', 'RAG', 'LangChain', 'AI Agents'],
    },
  },
];
