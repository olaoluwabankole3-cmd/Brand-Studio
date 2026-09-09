/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Template, BackgroundOption, BrandSettings } from './types';

export const TEMPLATE_PRESETS: Template[] = [
  {
    id: 'enterprise-philosophy',
    name: 'Enterprise Philosophy',
    description: 'Black background, gold quote marks, bold display typography, and premium gold details.',
    defaultHeadline: "Companies Don't Scale Because They Hire More People",
    defaultSubtitle: "Building Intelligent Systems Instead",
    defaultQuote: "The organizations that dominate the future won't simply hire more people. They'll build better systems.",
    defaultFooter: "Enterprise Philosophy Series"
  },
  {
    id: 'enterprise-blueprint',
    name: 'Enterprise Blueprint',
    description: 'Left structural matrix diagram, right contextual copy, digital grid overlays, and clean technical lines.',
    defaultHeadline: "Architecting the Autonomous State Machine",
    defaultSubtitle: "Decoupling business logic from human process layers.",
    defaultQuote: "If your organization relies on individual heroics to ship standard value, you don't have a system—you have a recurring emergency.",
    defaultFooter: "Systemic Blueprints"
  },
  {
    id: 'industry-spotlight',
    name: 'Industry Spotlight',
    description: 'Minimalist high-contrast layout emphasizing structural metrics, premium badge styling, and sector impact.',
    defaultHeadline: "Autonomous Workflows are the New Standard Suite",
    defaultSubtitle: "Transitioning legacy middleware into pure execution agents.",
    defaultQuote: "We are moving past the era of the human-in-the-loop dashboard. Intelligent engines will represent 98% of corporate operational nodes by 2030.",
    defaultFooter: "Industry Intelligence Report"
  },
  {
    id: 'building-apex',
    name: 'Building Apex',
    description: 'Personal founder story showcase featuring premium card outlines, gold accent dividers, and social signatures.',
    defaultHeadline: "A Culture of Execution, Not Consensus",
    defaultSubtitle: "Building systems with high-agency individual nodes.",
    defaultQuote: "We don't hold status meetings. We write code, build automated status logs, and allow the system to coordinate our actions asynchronously.",
    defaultFooter: "Apex Founders Dispatch"
  },
  {
    id: 'enterprise-vision',
    name: 'Enterprise Vision',
    description: 'Futuristic, high-end, dark luxurious theme featuring soft gold glows, large typography tracking, and ambient light.',
    defaultHeadline: "The Sovereign Protocol Era is Arriving",
    defaultSubtitle: "Navigating self-assembling corporate structures and networks.",
    defaultQuote: "The ultimate competitive advantage of the next twenty years is operational autonomy. The firm that can adapt its strategic model programmatically wins.",
    defaultFooter: "The Terminal Century"
  }
];

export const BACKGROUND_PRESETS: BackgroundOption[] = [
  {
    id: 'matte-black',
    name: 'Matte Black',
    description: 'Pure #0A0A0A deep matte luxury background',
    class: 'bg-[#0A0A0A]'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Charcoal graphite with subtle linear vignette gradients',
    class: 'bg-gradient-to-tr from-[#050505] via-[#0E0E0E] to-[#161616]'
  },
  {
    id: 'gold-mesh',
    name: 'Gold Mesh',
    description: 'Ambient radial warm gold glow with fine grid overlay',
    class: 'bg-[#0A0A0A] bg-[radial-gradient(circle_at_top_right,rgba(199,162,72,0.12),transparent_60%)]'
  },
  {
    id: 'digital-grid',
    name: 'Digital Grid',
    description: 'Sleek dark technical grid lines mapping executive nodes',
    class: 'bg-[#0A0A0A] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean slate grey accent lines with extremely subtle texture',
    class: 'bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-[#222222]/30'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Premium dark sweep transitioning from deep bronze to deep slate',
    class: 'bg-gradient-to-br from-[#0D0A06] via-[#0D0D0E] to-[#090D14]'
  },
  {
    id: 'abstract-ai',
    name: 'Abstract AI',
    description: 'Futuristic high-end warm glow with abstract radial coordinates',
    class: 'bg-[#090909] bg-[radial-gradient(circle_at_50%_120%,rgba(199,162,72,0.18),transparent_70%)]'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Super sleek vertical alignment shadows and executive precision',
    class: 'bg-gradient-to-r from-[#070708] to-[#121214]'
  },
  {
    id: 'enterprise-lines',
    name: 'Enterprise Lines',
    description: 'Intersecting geometry of mathematical corporate vectors',
    class: 'bg-[#0A0A0A] bg-[radial-gradient(circle_at_bottom_left,rgba(199,162,72,0.08),transparent_50%)]'
  }
];

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: 'https://lh3.googleusercontent.com/d/1IDBwdJa-WOG5uKA-WTJsKTrau1dzkgnb', // Direct Google Drive CDN link for the brand original logo
  fontFamily: 'Space Grotesk',
  primaryColor: '#0A0A0A',
  accentColor: '#C7A248',
  watermarkText: 'INTELLIGENT SYSTEM',
  socialHandle: '@ApexSyncCorp',
  website: 'apexsync.io/brand',
  email: 'studio@apexsync.io'
};

export const SERIES_OPTIONS = [
  'Enterprise Intelligence Series',
  'Future Founders Program',
  'AI Weekly Briefings',
  'Company Strategic Insights',
  'Sovereign Protocols'
];

export const EPISODE_OPTIONS = [
  'Episode 01',
  'Episode 02',
  'Episode 03',
  'Episode 04',
  'Episode 05'
];

export const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => `Day ${String(i + 1).padStart(2, '0')}`);
