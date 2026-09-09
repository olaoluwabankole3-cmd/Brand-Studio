/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Define port & host
const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client:', err);
  }
} else {
  console.log('Gemini API key is not configured or is the default placeholder. Local backup generator will be used.');
}

// Local high-fidelity mock generators as a backup
const LOCAL_MOCKS: Record<string, Array<{ headline: string; subtitle: string; quote: string }>> = {
  'enterprise-philosophy': [
    {
      headline: "Systems Outlive Scale",
      subtitle: "Why the organizations that dominate the future won't simply hire more people.",
      quote: "The future belongs to the system builders. Scaling headcount is a linear response to an exponential challenge. Build intelligent leverage instead."
    },
    {
      headline: "The Speed of Alignment",
      subtitle: "Removing human consensus layers to achieve terminal operational velocity.",
      quote: "Friction isn't a training problem; it's an architectural flaw. When your standard operating procedures are automated, alignment becomes instantaneous."
    },
    {
      headline: "Leverage Over Labor",
      subtitle: "How elite enterprise engines run hundred-million-dollar structures on high agency nodes.",
      quote: "Headcount is a vanity metric. System output per headcount is the truth. The next decacorns will be built by fewer than thirty people."
    }
  ],
  'enterprise-blueprint': [
    {
      headline: "Designing Autonomous Flow",
      subtitle: "Architecting feedback loops that self-correct without executive oversight.",
      quote: "A true system doesn't require a hero. If your organization relies on individual heroics to ship, you don't have a business model—you have a crisis management club."
    },
    {
      headline: "The Enterprise Blueprint",
      subtitle: "Mapping resource routing protocols from marketing triggers down to customer lifetime metrics.",
      quote: "When you view your entire firm as a single integrated state machine, bottlenecks become mathematical certainties that can be solved systematically."
    }
  ],
  'industry-spotlight': [
    {
      headline: "AI is the Infrastructure",
      subtitle: "Transitioning from experimental copilots to fully authoritative automated agents.",
      quote: "The next wave is not AI assisting humans. It is humans managing intelligent engines that execute 99% of the cognitive labor."
    },
    {
      headline: "The Death of Legacy Middleware",
      subtitle: "How direct programmatic workflows are rendering enterprise SaaS suites completely obsolete.",
      quote: "The traditional software stack is too slow. Direct API orchestration layer is replacing the fragmented dashboard era."
    }
  ],
  'building-apex': [
    {
      headline: "Inside Apex Sync",
      subtitle: "How we constructed a zero-overhead corporate operation utilizing intelligent design protocols.",
      quote: "We don't build software to sell solutions. We build software to run our own company, then open-source the absolute state of the art to the world."
    },
    {
      headline: "The Relentless Pursuit of Craft",
      subtitle: "Why beautiful executive interfaces create cognitive clarity in high-pressure rooms.",
      quote: "If an enterprise tool is ugly, it signals a deeper decay in the company's discipline. Aesthetics and operational excellence are the exact same variable."
    }
  ],
  'enterprise-vision': [
    {
      headline: "The Autonomous Century",
      subtitle: "Looking ahead at the next fifty years of automated capital allocation and self-optimizing networks.",
      quote: "The supreme competitive advantage of this decade is system agency. The firms that automate their strategic pivot cycle will capture entire markets overnight."
    },
    {
      headline: "The Sovereign Enterprise",
      subtitle: "Navigating a world where code, supply chains, and legal frameworks auto-assemble on demand.",
      quote: "We are moving past the era of the company. We are entering the era of the protocol. Build your firm to be a protocol, or prepare to be automated away."
    }
  ]
};

// API: Generate premium copy using Gemini
app.post('/api/generate', async (req, res) => {
  const { templateId, series, episode, day, prompt: userPrompt } = req.body;

  const tId = templateId || 'enterprise-philosophy';
  const currentMockList = LOCAL_MOCKS[tId] || LOCAL_MOCKS['enterprise-philosophy'];
  const randomMock = currentMockList[Math.floor(Math.random() * currentMockList.length)];

  if (!aiClient) {
    // Return high-fidelity local mockup if Gemini is not configured
    return res.json({
      success: true,
      data: {
        headline: randomMock.headline,
        subtitle: randomMock.subtitle,
        quote: randomMock.quote,
        source: 'local-preset'
      }
    });
  }

  try {
    const promptInstructions = `
      You are an elite, world-class enterprise executive, copywriter, and philosopher.
      Your writing style is highly professional, minimalist, philosophical, and reminiscent of premium brands like Linear, Vercel, Apple, and Stripe.
      It must NOT sound like generic Canva, cheap marketing hype, or cheesy advertising. Avoid words like "supercharge", "empower", "revolutionary", or "synergy".

      Generate a custom social graphic copy suite for the category "${tId}" in the series "${series || 'Enterprise Intelligence Series'}", specifically for ${episode || 'Episode 01'}, ${day || 'Day 01'}.
      ${userPrompt ? `Incorporate this custom request: "${userPrompt}"` : ''}

      Provide your output in valid JSON matching this schema:
      - headline: A highly impactful, bold, short display statement (6-12 words max) that challenges the status quo. Example: "Companies Don't Scale Because They Hire More People" or "AI is the New Infrastructure, Not the Assistant".
      - subtitle: A clean, direct explanatory subtitle (8-15 words) supporting the headline. Example: "Building autonomous systems that optimize themselves under peak load."
      - quote: A deep, profound, memorable thought leadership quote (20-40 words) that sounds like it was written by an elite CEO or modern philosopher.

      Output must be strictly in JSON. Do not output anything other than the JSON object.
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptInstructions,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            quote: { type: Type.STRING }
          },
          required: ['headline', 'subtitle', 'quote']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedData = JSON.parse(responseText.trim());
    return res.json({
      success: true,
      data: {
        headline: parsedData.headline || randomMock.headline,
        subtitle: parsedData.subtitle || randomMock.subtitle,
        quote: parsedData.quote || randomMock.quote,
        source: 'gemini-api'
      }
    });

  } catch (error: any) {
    console.error('Gemini content generation failed, falling back to local presets:', error);
    return res.json({
      success: true,
      data: {
        headline: randomMock.headline,
        subtitle: randomMock.subtitle,
        quote: randomMock.quote,
        source: 'local-fallback',
        error: error.message
      }
    });
  }
});

// Setup Vite Dev Server / Static Files Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static files serving enabled.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex Sync Brand Studio server is listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
