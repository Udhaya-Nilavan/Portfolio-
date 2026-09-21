export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, portfolioData } = req.body || {};
    const lastMessage = Array.isArray(messages) && messages.length > 0 
      ? messages[messages.length - 1].content 
      : '';

    // 1. Check if an external LLM API key is provided
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are the professional AI Assistant for Udhaya Nilavan's portfolio.
Answer questions factually, concisely, and warmly based on his verified background:
Personal: ${JSON.stringify(portfolioData?.personal || {})}
Certifications: ${JSON.stringify(portfolioData?.certifications?.map(c => c.title) || [])}
Skills: ${JSON.stringify(portfolioData?.skills?.map(s => s.name) || [])}
Projects: ${JSON.stringify(portfolioData?.projects?.map(p => p.title) || [])}

User message: ${lastMessage}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.status(200).json({ reply: replyText.trim() });
          }
        }
      } catch (e) {
        console.error('Gemini API call failed:', e);
      }
    } else if (openaiKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are the professional AI Assistant for Udhaya Nilavan's portfolio. Answer concisely based on: ${JSON.stringify(portfolioData || {})}`
              },
              { role: 'user', content: lastMessage }
            ],
            max_tokens: 350
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText = aiData?.choices?.[0]?.message?.content;
          if (replyText) {
            return res.status(200).json({ reply: replyText.trim() });
          }
        }
      } catch (e) {
        console.error('OpenAI API call failed:', e);
      }
    }

    // 2. Intelligent Grounded Fallback Response based on verified portfolio data
    const q = (lastMessage || '').toLowerCase();
    let reply = "Udhaya Nilavan is a Computer Science Engineering student at Lovely Professional University, specializing in Data Science, Machine Learning, and Agentic AI systems.";

    if (q.includes('skill') || q.includes('python') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework')) {
      reply = "Udhaya's core technical skills include Python, SQL, C++, PyTorch, Scikit-learn, LangChain, CrewAI, Docker, Git, and React. He specializes in Machine Learning and autonomous Agentic AI systems.";
    } else if (q.includes('cert') || q.includes('oracle') || q.includes('degree') || q.includes('qualification') || q.includes('credential')) {
      reply = "Udhaya holds three Oracle Cloud certifications: OCI 2025 Certified Data Science Professional, OCI 2025 Certified Generative AI Professional, and OCI 2025 Certified AI Foundations Associate. He also completed the Agentic Systems program with iHUB IIT Roorkee and earned a Python Programming certification from iHUB DivyaSampark.";
    } else if (q.includes('project') || q.includes('work') || q.includes('build') || q.includes('experience')) {
      reply = "Udhaya has built notable projects including MediVault (Clinical ML Diagnosis Assistant), FleetPulse (IoT Predictive Fleet Telematics), and MarketPulse (Real-Time Retail Demand Forecaster). You can explore full architectural details and links in the Projects section!";
    } else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('opportunity') || q.includes('intern') || q.includes('reach')) {
      reply = "Udhaya is open to internships and entry-level opportunities in Data Science, ML, and AI Engineering. You can reach out directly via the Contact section or email him at udhayanilavan13@gmail.com.";
    } else if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('lpu')) {
      reply = "Udhaya is pursuing his B.Tech in Computer Science and Engineering at Lovely Professional University (Punjab, India), focusing on intelligent systems and data science.";
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
