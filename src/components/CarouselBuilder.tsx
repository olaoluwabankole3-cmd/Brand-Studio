/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  FileDown,
  RefreshCw,
  TrendingUp,
  Binary,
  Quote,
  Layout,
  Layers,
  Sliders,
  Check,
  Eye,
  Settings,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { BrandSettings, ExportHistoryItem } from '../types';

interface CarouselBuilderProps {
  brandSettings: BrandSettings;
  onAddExport: (item: ExportHistoryItem) => void;
}

// Universal Accent Pillars
interface PillarOption {
  id: string;
  name: string;
  accentColor: string;
  label: string;
}

const PILLARS: PillarOption[] = [
  { id: 'philosophy', name: 'Enterprise Philosophy', accentColor: '#D4AF37', label: 'Gold' },
  { id: 'blueprint', name: 'Enterprise Blueprint', accentColor: '#1E60FF', label: 'Electric Blue' },
  { id: 'building', name: 'Building Apex', accentColor: '#10B981', label: 'Emerald' },
  { id: 'spotlight', name: 'Industry Spotlight', accentColor: '#F97316', label: 'Orange' },
  { id: 'vision', name: 'Enterprise Vision', accentColor: '#8B5CF6', label: 'Purple' }
];

// 8 Universal Layout options
interface LayoutType {
  id: string;
  name: string;
  description: string;
}

const LAYOUTS: LayoutType[] = [
  { id: 'L01', name: 'Layout 01 — Hero Statement', description: 'Large bold display headline with brief subtitle and micro-labels.' },
  { id: 'L02', name: 'Layout 02 — Explanation', description: 'One clear idea: Title, minimal paragraph, and aesthetic alignment.' },
  { id: 'L03', name: 'Layout 03 — Quote', description: 'Huge custom quotation marks, centered block sentence, and author label.' },
  { id: 'L04', name: 'Layout 04 — Comparison', description: 'Left (Current State / Problems) vs Right (Future State / Solution).' },
  { id: 'L05', name: 'Layout 05 — Framework', description: 'Linear structural diagram mapping system state transitions.' },
  { id: 'L06', name: 'Layout 06 — Statistics', description: 'Oversized bold metric callout paired with supportive proof statement.' },
  { id: 'L07', name: 'Layout 07 — Blueprint', description: 'Technical box blueprint schematics mapping system architecture.' },
  { id: 'L08', name: 'Layout 08 — Closing Slide', description: 'Apex Sync logo callout, final quote, and high-impact audience question.' }
];

// Pre-defined micro-tag configurations
const TINY_TAGS = [
  'EXECUTIVE BRIEF',
  'CONFIDENTIAL',
  'REVISION 1.0',
  'LIVE ENGINE',
  'INTELLIGENCE SERIES',
  'ARCHIVE PROTOCOL',
  'SYSTEM NODE',
  'DECISION MATRIX',
  'AUTONOMOUS FRAMEWORK',
  'ENTERPRISE MODEL'
];

interface SlideData {
  id: string;
  layoutId: string;
  headline: string;
  subtitle: string;
  quoteText: string;
  quoteAuthor: string;
  
  // Layout 04: Comparison
  compareLeftTitle: string;
  compareLeftItems: string[];
  compareRightTitle: string;
  compareRightItems: string[];

  // Layout 05: Framework nodes
  frameworkNodes: string[];

  // Layout 06: Metric
  metricVal: string;
  metricLabel: string;

  // Layout 07: Blueprint blocks
  blueprintTitle: string;
  blueprintModules: string[];
  
  // Custom micro labels
  microTagLeft: string;
  microTagRight: string;
}

export default function CarouselBuilder({ brandSettings, onAddExport }: CarouselBuilderProps) {
  // Global slide system state
  const [activePillar, setActivePillar] = useState<string>('philosophy');
  const [dayCounter, setDayCounter] = useState<string>('DAY 01');
  const [episodeCounter, setEpisodeCounter] = useState<string>('EPISODE 01');
  const [seriesName, setSeriesName] = useState<string>('Enterprise Intelligence');
  
  // Footer settings
  const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const [footerOwner, setFooterOwner] = useState<string>('Apex Sync');
  const [footerProduction, setFooterProduction] = useState<string>('Enterprise Intelligence Series');
  const [footerMonth, setFooterMonth] = useState<string>(currentMonthLabel);
  const [footerWebsite, setFooterWebsite] = useState<string>('apexsync.io');

  // List of slides in the carousel deck
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Editor panel state
  const [isExportingSingle, setIsExportingSingle] = useState<boolean>(false);
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [canvasScale, setCanvasScale] = useState<number>(0.4);

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default slide initializer
  const createDefaultSlide = (layoutId: string, index: number): SlideData => {
    switch (layoutId) {
      case 'L01':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L01',
          headline: "Companies Don't Scale Because They Hire More People.",
          subtitle: "Building Intelligent Systems Instead.",
          quoteText: "The system is the leverage.",
          quoteAuthor: "Apex Philosophy",
          compareLeftTitle: "Current Company",
          compareLeftItems: ["Meetings", "Manual reports", "Email approvals"],
          compareRightTitle: "Future Company",
          compareRightItems: ["AI agents", "Live dashboards", "Autonomous workflows"],
          frameworkNodes: ["Data", "AI", "Automation", "Insights", "Execution"],
          metricVal: "98%",
          metricLabel: "Of corporate operations remain un-automated and error-prone.",
          blueprintTitle: "Autonomous State Machine",
          blueprintModules: ["Gateway", "Kernel Processor", "Telemetry Queue"],
          microTagLeft: "CONFIDENTIAL",
          microTagRight: "REVISION 1.0"
        };
      case 'L02':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L02',
          headline: "Decouple Human Process Layers",
          subtitle: "To scale without exponential headcount overhead, abstract core workflows into autonomous machine states. Humans handle exception routing, never standard execution pipelines.",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "Current State",
          compareLeftItems: ["Email threads", "PDF reports", "Excel exports"],
          compareRightTitle: "Target State",
          compareRightItems: ["Kafka queue", "Live dashboard", "State databases"],
          frameworkNodes: ["Input", "Parse", "Process", "Approve", "Commit"],
          metricVal: "10x",
          metricLabel: "Throughput improvement across back-office nodes.",
          blueprintTitle: "Data Flow Architecture",
          blueprintModules: ["Ingest API", "Parser Engine", "Sync Sink"],
          microTagLeft: "SYSTEM NODE",
          microTagRight: "EXECUTIVE BRIEF"
        };
      case 'L03':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L03',
          headline: "",
          subtitle: "",
          quoteText: "If your organization relies on individual heroics to ship standard value, you don't have a system—you have a recurring emergency.",
          quoteAuthor: "Executive Director",
          compareLeftTitle: "",
          compareLeftItems: [],
          compareRightTitle: "",
          compareRightItems: [],
          frameworkNodes: [],
          metricVal: "",
          metricLabel: "",
          blueprintTitle: "",
          blueprintModules: [],
          microTagLeft: "INTELLIGENCE SERIES",
          microTagRight: "ARCHIVE"
        };
      case 'L04':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L04',
          headline: "The Operational Leap",
          subtitle: "Shifting from legacy human-dependent cycles to systemic autonomous workflows.",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "Current Company",
          compareLeftItems: ["Meetings & Status Synced", "Manual reporting cycles", "Email and chat approvals"],
          compareRightTitle: "Future Company",
          compareRightItems: ["AI agents coordinate work", "Real-time state dashboards", "Autonomous automated workflows"],
          frameworkNodes: [],
          metricVal: "",
          metricLabel: "",
          blueprintTitle: "",
          blueprintModules: [],
          microTagLeft: "DECISION MATRIX",
          microTagRight: "SYSTEM"
        };
      case 'L05':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L05',
          headline: "Enterprise OS Stack",
          subtitle: "Visualizing the vertical integration of the intelligent corporate architecture.",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "",
          compareLeftItems: [],
          compareRightTitle: "",
          compareRightItems: [],
          frameworkNodes: ["Raw Data", "AI Analysis", "Automation", "Real-time Insights", "Autonomous Execution"],
          metricVal: "",
          metricLabel: "",
          blueprintTitle: "",
          blueprintModules: [],
          microTagLeft: "AUTONOMOUS FRAMEWORK",
          microTagRight: "MODEL"
        };
      case 'L06':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L06',
          headline: "Extreme Metric Leverage",
          subtitle: "",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "",
          compareLeftItems: [],
          compareRightTitle: "",
          compareRightItems: [],
          frameworkNodes: [],
          metricVal: "98%",
          metricLabel: "Of Fortune 500 operations rely on fragile manual reporting and spreadsheets.",
          blueprintTitle: "",
          blueprintModules: [],
          microTagLeft: "LIVE ENGINE",
          microTagRight: "INTELLIGENCE"
        };
      case 'L07':
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L07',
          headline: "Systemic Core Engine",
          subtitle: "High-level technical drawing detailing autonomous message ingestion and validation.",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "",
          compareLeftItems: [],
          compareRightTitle: "",
          compareRightItems: [],
          frameworkNodes: [],
          metricVal: "",
          metricLabel: "",
          blueprintTitle: "APEX SYSTEM SCHEMATIC",
          blueprintModules: ["Ingest Broker", "Validation Hub", "Durable Storage", "AI Routing Core", "Execution Dispatcher"],
          microTagLeft: "ENTERPRISE MODEL",
          microTagRight: "PROTOCOL"
        };
      case 'L08':
        default:
        return {
          id: Math.random().toString(36).substr(2, 9),
          layoutId: 'L08',
          headline: "",
          subtitle: "",
          quoteText: "Are you building tools, or are you building the system that builds them?",
          quoteAuthor: "Apex Core",
          compareLeftTitle: "",
          compareLeftItems: [],
          compareRightTitle: "",
          compareRightItems: [],
          frameworkNodes: [],
          metricVal: "",
          metricLabel: "",
          blueprintTitle: "",
          blueprintModules: [],
          microTagLeft: "CONFIDENTIAL",
          microTagRight: "REVISION 1.0"
        };
    }
  };

  // Populate default 7-slide carousel flow on initial load
  useEffect(() => {
    try {
      const cachedSlides = localStorage.getItem('apex_carousel_slides_v1');
      const cachedPillar = localStorage.getItem('apex_carousel_pillar_v1');
      const cachedDay = localStorage.getItem('apex_carousel_day_v1');
      const cachedEpisode = localStorage.getItem('apex_carousel_episode_v1');
      const cachedSeries = localStorage.getItem('apex_carousel_series_v1');
      const cachedWorkspace = localStorage.getItem('apex_carousel_workspace_v2');

      if (cachedPillar) setActivePillar(cachedPillar);
      if (cachedDay) setDayCounter(cachedDay);
      if (cachedEpisode) setEpisodeCounter(cachedEpisode);
      if (cachedSeries) setSeriesName(cachedSeries);

      if (cachedWorkspace) {
        const workspace = JSON.parse(cachedWorkspace);
        if (typeof workspace.footerOwner === 'string') setFooterOwner(workspace.footerOwner);
        if (typeof workspace.footerProduction === 'string') setFooterProduction(workspace.footerProduction);
        if (typeof workspace.footerMonth === 'string') setFooterMonth(workspace.footerMonth);
        if (typeof workspace.footerWebsite === 'string') setFooterWebsite(workspace.footerWebsite);
        if (typeof workspace.activeSlideIndex === 'number') setActiveSlideIndex(Math.max(0, workspace.activeSlideIndex));
      }

      if (cachedSlides) {
        const parsed = JSON.parse(cachedSlides);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load slides cache:", e);
    }

    // Default 7-Step Sequence as recommended:
    // Slide 1: Hero -> Slide 2: Problem (Explanation) -> Slide 3: Quote -> Slide 4: Framework -> Slide 5: Comparison -> Slide 6: Statistics -> Slide 7: Closing
    const initialDeck = [
      { ...createDefaultSlide('L01', 0), headline: "Companies Don't Scale Because They Hire More People.", subtitle: "They scale by building sovereign machine operating systems." },
      { ...createDefaultSlide('L02', 1), headline: "The Human Headcount Fallacy", subtitle: "Expanding human staff adds communication nodes, schedule alignment bottlenecks, and operational variance. Software pipelines offer infinite replication without communication tax." },
      { ...createDefaultSlide('L03', 2), quoteText: "If your organization relies on individual heroics to ship standard value, you do not have a system—you have a recurring emergency." },
      { ...createDefaultSlide('L05', 3), headline: "The Autonomous Framework Stack", subtitle: "Modern organizations shift focus from human processes to modular automated loops." },
      { ...createDefaultSlide('L04', 4), headline: "The Paradigm Shift", subtitle: "Compare the structure of traditional companies with sovereign digital operations.", compareLeftTitle: "Current Org Status", compareRightTitle: "Future Sovereign Org" },
      { ...createDefaultSlide('L06', 5), metricVal: "98%", metricLabel: "Of corporate tasks are repetitive rules-based execution ripe for autonomic conversion." },
      { ...createDefaultSlide('L08', 6), quoteText: "How much of your day is spent performing actions that can be written down as a formal state machine?" }
    ];
    setSlides(initialDeck);
  }, []);

  // Persist workspace-level settings separately from the deck content.
  useEffect(() => {
    try {
      localStorage.setItem('apex_carousel_workspace_v2', JSON.stringify({
        footerOwner,
        footerProduction,
        footerMonth,
        footerWebsite,
        activeSlideIndex
      }));
    } catch (e) {
      console.error('Failed to cache carousel workspace:', e);
    }
  }, [footerOwner, footerProduction, footerMonth, footerWebsite, activeSlideIndex]);

  // Save changes to localStorage on slide updates
  const persistState = (currentSlides: SlideData[], pillar: string, day: string, episode: string, series: string) => {
    try {
      localStorage.setItem('apex_carousel_slides_v1', JSON.stringify(currentSlides));
      localStorage.setItem('apex_carousel_pillar_v1', pillar);
      localStorage.setItem('apex_carousel_day_v1', day);
      localStorage.setItem('apex_carousel_episode_v1', episode);
      localStorage.setItem('apex_carousel_series_v1', series);
    } catch (e) {
      console.error("Failed to cache slides:", e);
    }
  };

  const handleUpdateActiveSlide = (updated: SlideData) => {
    const updatedDeck = [...slides];
    updatedDeck[activeSlideIndex] = updated;
    setSlides(updatedDeck);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
  };

  const handleAddSlide = (layoutId: string) => {
    const newSlide = createDefaultSlide(layoutId, slides.length);
    const updatedDeck = [...slides, newSlide];
    setSlides(updatedDeck);
    setActiveSlideIndex(updatedDeck.length - 1);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updatedDeck = slides.filter((_, i) => i !== index);
    setSlides(updatedDeck);
    const nextIdx = Math.max(0, index - 1);
    setActiveSlideIndex(nextIdx);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
  };

  const handleMoveSlide = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= slides.length) return;
    const updatedDeck = [...slides];
    const [moved] = updatedDeck.splice(fromIndex, 1);
    updatedDeck.splice(toIndex, 0, moved);
    setSlides(updatedDeck);
    setActiveSlideIndex(toIndex);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
  };

  // Adjust scale of the canvas display
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const spaceForCanvas = Math.min(width - 64, height - 200);
      const newScale = Math.max(0.2, Math.min(0.9, spaceForCanvas / 1200));
      setCanvasScale(newScale);
    };

    calculateScale();
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [slides, activeSlideIndex]);

  // Export mechanisms
  const handleExportSinglePNG = async () => {
    if (!canvasRef.current) return;
    setIsExportingSingle(true);
    setExportSuccess(null);

    try {
      const dataUrl = await toPng(canvasRef.current, {
        width: 1200,
        height: 1200,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1200px',
          height: '1200px'
        }
      });

      const link = document.createElement('a');
      link.download = `apex-slide-${activeSlideIndex + 1}-layout-${slides[activeSlideIndex]?.layoutId || 'L01'}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess('Single PNG exported successfully!');
      
      // Log export action in App context
      onAddExport({
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        brandSnapshot: { ...brandSettings },
        templateId: 'enterprise-philosophy',
        templateName: `Apex Slide ${activeSlideIndex + 1} (${slides[activeSlideIndex]?.layoutId})`,
        headline: slides[activeSlideIndex]?.headline || slides[activeSlideIndex]?.quoteText || 'Carousel Slide',
        format: 'png',
        resolution: '1200x1200px'
      });

      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Error during image capture:', err);
      setExportSuccess('Clipboard/Download locked. Please retry or open in new tab.');
    } finally {
      setIsExportingSingle(false);
    }
  };

  const handleExportAllPDF = async () => {
    setIsExportingAll(true);
    setExportSuccess(null);

    try {
      // Create PDF: 1200x1200px is standard.
      const pdf = new jsPDF('p', 'px', [1200, 1200]);

      const currentIdx = activeSlideIndex;

      for (let i = 0; i < slides.length; i++) {
        // Temporarily change index to render the canvas for slide i
        setActiveSlideIndex(i);
        // Wait minor tick for state to bind
        await new Promise(r => setTimeout(r, 150));

        if (canvasRef.current) {
          const dataUrl = await toPng(canvasRef.current, {
            width: 1200,
            height: 1200,
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left',
              width: '1200px',
              height: '1200px'
            }
          });

          if (i > 0) {
            pdf.addPage([1200, 1200], 'p');
          }
          pdf.addImage(dataUrl, 'PNG', 0, 0, 1200, 1200);
        }
      }

      // Restore active slide index
      setActiveSlideIndex(currentIdx);

      pdf.save(`apex-slide-deck-${seriesName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      setExportSuccess('Master PDF Slide Deck downloaded!');

      onAddExport({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        templateId: 'enterprise-philosophy',
        templateName: `Master Carousel (${slides.length} slides)`,
        headline: seriesName,
        format: 'pdf',
        resolution: '1200x1200px (Multi-page)'
      });

      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Error during master PDF deck generation:', err);
      setExportSuccess('PDF compile failed. Please try exporting slides individually.');
    } finally {
      setIsExportingAll(false);
    }
  };

  const activePillarObj = PILLARS.find(p => p.id === activePillar) || PILLARS[0];
  const accentColor = activePillarObj.accentColor;
  const currentSlide = slides[activeSlideIndex] || {
    layoutId: 'L01',
    headline: '',
    subtitle: '',
    quoteText: '',
    quoteAuthor: '',
    compareLeftTitle: 'Current State',
    compareLeftItems: [],
    compareRightTitle: 'Future State',
    compareRightItems: [],
    frameworkNodes: [],
    metricVal: '',
    metricLabel: '',
    blueprintTitle: '',
    blueprintModules: [],
    microTagLeft: 'CONFIDENTIAL',
    microTagRight: 'REVISION 1.0'
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden select-none" id="carousel-builder-panel">
      {/* LEFT COLUMN: CAROUSEL SLIDE MANAGEMENT DECK (Linear & Figma precision list) */}
      <div className="w-80 border-r border-[#1F1F1F] bg-[#0E0E0E] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C7A248]" />
            <span className="font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider text-neutral-300">
              Carousel Slides ({slides.length})
            </span>
          </div>
          <div className="text-[10px] bg-[#C7A248]/10 border border-[#C7A248]/20 px-1.5 py-0.5 rounded text-[#C7A248] font-mono">
            FLOW
          </div>
        </div>

        {/* Master slides navigation stack */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {slides.map((s, index) => {
              const isActive = index === activeSlideIndex;
              const accentColorThisPillar = accentColor;
              return (
                <motion.div
                  key={s.id}
                  layoutId={`slide-card-${s.id}`}
                  className={`border rounded-lg p-3 relative cursor-pointer group transition-all duration-200 ${
                    isActive 
                      ? 'bg-black border-[#C7A248]/30 shadow-[0_0_15px_rgba(199,162,72,0.06)]' 
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700/80'
                  }`}
                  onClick={() => setActiveSlideIndex(index)}
                >
                  {/* Top slide identifier */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[9px] text-[#C7A248] font-semibold tracking-widest uppercase">
                      SLIDE {String(index + 1).padStart(2, '0')} &bull; {s.layoutId}
                    </span>
                    
                    {/* Action buttons on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveSlide(index, 'up'); }}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                          title="Move Slide Up"
                        >
                          <ChevronLeft className="w-3 h-3 rotate-90" />
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveSlide(index, 'down'); }}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                          title="Move Slide Down"
                        >
                          <ChevronLeft className="w-3 h-3 -rotate-90" />
                        </button>
                      )}
                      {slides.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteSlide(index); }}
                          className="p-1 hover:bg-red-950 rounded text-neutral-500 hover:text-red-400 transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail description mapping */}
                  <div className="space-y-1">
                    <h4 className="text-white text-xs font-semibold truncate">
                      {s.layoutId === 'L03' || s.layoutId === 'L08' ? s.quoteText : s.headline || 'Untitled Slide'}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate leading-tight">
                      {LAYOUTS.find(l => l.id === s.layoutId)?.name.split(' — ')[1] || 'Simple text layout'}
                    </p>
                  </div>

                  {/* Progressive flow dot */}
                  <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-1.5">
                    <span>PROGRESS STEP {index + 1}</span>
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isActive ? accentColorThisPillar : '#707070' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick add panel */}
        <div className="p-4 border-t border-[#1F1F1F] bg-[#0A0A0A] space-y-2">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">
            Add Master Slide Layout
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleAddSlide(layout.id)}
                className="py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#C7A248]/30 rounded text-[10px] font-mono text-neutral-300 font-bold transition-all hover:bg-black hover:text-white"
                title={layout.name}
              >
                {layout.id}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-neutral-600 leading-tight">
            Select a standard layout code above to append a new slide to your design deck.
          </p>
        </div>
      </div>

      {/* CENTER WORKSPACE: REAL-TIME canvas VIEW & SCALE CONSTRAINTS */}
      <div 
        ref={containerRef} 
        className="flex-1 bg-[#050505] flex flex-col items-center justify-start lg:justify-center p-6 overflow-y-auto relative select-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(199,162,72,0.02),transparent_40%)] pointer-events-none" />

        {/* Action Panel / Master Download Toolbar */}
        <div className="w-full max-w-[620px] mb-4 bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-4 flex flex-col gap-3 z-10 shrink-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-[#C7A248] tracking-widest uppercase font-mono block">
                SYSTEM DESIGN DECK CONTROL
              </span>
              <h2 className="text-white font-bold text-sm font-['Space_Grotesk'] flex items-center gap-2">
                <span>The Apex Sync Slide System</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#C7A248]/10 text-[#C7A248] rounded border border-[#C7A248]/20 uppercase">
                  Layout {currentSlide.layoutId}
                </span>
              </h2>
            </div>

            {/* Downloader controls */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleExportSinglePNG}
                disabled={isExportingSingle || isExportingAll}
                className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border border-neutral-800 disabled:opacity-50"
              >
                {isExportingSingle ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C7A248]" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Single PNG</span>
              </button>

              <button
                onClick={handleExportAllPDF}
                disabled={isExportingSingle || isExportingAll}
                className="px-4 py-2.5 bg-[#C7A248] hover:bg-[#b08e3d] text-black rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(199,162,72,0.3)] disabled:opacity-50"
              >
                {isExportingAll ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                <span>Master PDF Deck ({slides.length})</span>
              </button>
            </div>
          </div>

          {/* Success messages */}
          <AnimatePresence>
            {exportSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{exportSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scaled Canvas Wrapper */}
        <div 
          className="flex items-center justify-center overflow-hidden shrink-0"
          style={{
            width: `${1200 * canvasScale}px`,
            height: `${1200 * canvasScale}px`,
          }}
        >
          {/* 1200x1200px MASTER DESIGN CANVAS CONTAINER */}
          <div 
            ref={canvasRef} 
            className="w-[1200px] h-[1200px] p-24 flex flex-col justify-between relative overflow-hidden select-none text-white bg-[#000000] border border-[#222222]/80 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            {/* Fine design elements (Technical drawings overlay - classifier grid) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Subtle radial accent illumination glow corresponding to the pillar color */}
            <div 
              className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[180px] pointer-events-none opacity-30 transition-all duration-500"
              style={{ backgroundColor: accentColor }}
            />

            {/* UNIVERSAL REUSABLE SLIDE HEADER */}
            <div className="w-full flex justify-between items-start border-b border-[#222222]/80 pb-6 shrink-0 z-10">
              <div className="flex items-center gap-3">
                {/* Master Brand Logo */}
                {brandSettings.logoUrl ? (
                  <img 
                    src={brandSettings.logoUrl} 
                    alt="Brand Logo" 
                    referrerPolicy="no-referrer"
                    className="h-7 object-contain opacity-95" 
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-tr from-[#D4AF37] to-neutral-700 rounded flex items-center justify-center">
                      <span className="text-[13px] font-bold text-black font-mono">A</span>
                    </div>
                    <span className="font-bold text-xs tracking-wider font-sans">APEX SYNC</span>
                  </div>
                )}
              </div>

              {/* Day / Episode / Series indicator stack */}
              <div className="text-right flex items-center gap-3 font-mono">
                <span 
                  className="text-[11px] px-2.5 py-1 text-black font-extrabold uppercase rounded tracking-wider transition-colors duration-500"
                  style={{ backgroundColor: accentColor }}
                >
                  {dayCounter}
                </span>
                <span className="text-[11px] text-[#707070] font-bold uppercase tracking-widest pl-3 border-l border-[#222222]">
                  {episodeCounter}
                </span>
                <span className="text-[11px] text-neutral-200 font-bold uppercase tracking-widest pl-3 border-l border-[#222222]">
                  {seriesName}
                </span>
              </div>
            </div>

            {/* CENTRAL WORKSPACE STAGE: DYNAMIC MASTER LAYOUTS */}
            <div className="flex-1 w-full flex flex-col justify-center py-10 z-10">
              
              {/* LAYOUT 01: HERO STATEMENT */}
              {currentSlide.layoutId === 'L01' && (
                <div className="space-y-8 animate-fadeIn text-left">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                        {currentSlide.microTagLeft}
                      </span>
                    </div>
                    <h1 
                      className="text-[52px] font-black tracking-tight leading-[1.12] text-[#F7F7F7] max-w-[960px] font-['Space_Grotesk'] whitespace-pre-wrap"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                      {currentSlide.headline}
                    </h1>
                  </div>

                  <div className="h-[2px] w-24" style={{ backgroundColor: accentColor }} />

                  <p className="text-xl text-neutral-400 font-sans tracking-wide leading-relaxed max-w-[720px] whitespace-pre-wrap">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* LAYOUT 02: EXPLANATION */}
              {currentSlide.layoutId === 'L02' && (
                <div className="grid grid-cols-12 gap-8 items-center animate-fadeIn">
                  <div className="col-span-8 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: accentColor }} />
                      <span className="text-xs font-mono uppercase tracking-widest text-[#707070]">
                        {currentSlide.microTagLeft || 'EXECUTIVE BRIEF'}
                      </span>
                    </div>
                    <h2 className="text-[42px] font-black tracking-tight leading-none text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                      {currentSlide.headline}
                    </h2>
                    <p className="text-xl text-[#707070] leading-relaxed font-sans max-w-[620px] whitespace-pre-wrap">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Decorative minimalist geometric representation block */}
                  <div className="col-span-4 flex justify-end">
                    <div className="border border-[#222222] p-8 rounded-lg bg-neutral-950/80 w-[240px] h-[240px] flex flex-col justify-between relative">
                      <div className="absolute top-4 right-4 text-[10px] font-mono text-neutral-500">
                        001 // S
                      </div>
                      <div className="w-10 h-10 rounded border flex items-center justify-center" style={{ borderColor: accentColor }}>
                        <Sliders className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 bg-neutral-800 rounded w-full" />
                        <div className="h-1 bg-neutral-800 rounded w-5/6" />
                        <div className="h-1 rounded w-2/3" style={{ backgroundColor: accentColor }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 03: QUOTE */}
              {currentSlide.layoutId === 'L03' && (
                <div className="text-center space-y-10 py-4 max-w-[900px] mx-auto animate-fadeIn">
                  {/* Elegant gold or custom accent quotation marks */}
                  <div 
                    className="font-serif text-[110px] leading-none select-none h-12"
                    style={{ color: accentColor }}
                  >
                    “
                  </div>
                  
                  <blockquote 
                    className="text-[34px] font-medium leading-[1.35] tracking-wide text-[#F7F7F7] font-['Space_Grotesk'] italic whitespace-pre-wrap"
                  >
                    {currentSlide.quoteText}
                  </blockquote>

                  <div className="flex items-center justify-center gap-3 font-mono">
                    <div className="w-8 h-[1px] bg-[#222222]" />
                    <span className="text-xs text-[#707070] uppercase tracking-widest font-bold">
                      {currentSlide.quoteAuthor || 'Sovereign Intelligence'}
                    </span>
                    <div className="w-8 h-[1px] bg-[#222222]" />
                  </div>
                </div>
              )}

              {/* LAYOUT 04: COMPARISON */}
              {currentSlide.layoutId === 'L04' && (
                <div className="space-y-12 animate-fadeIn text-left">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
                      {currentSlide.microTagLeft || 'DECISION MATRIX'}
                    </span>
                    <h2 className="text-[36px] font-black tracking-tight text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                      {currentSlide.headline}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-16">
                    {/* Left side: Current State (Fragile) */}
                    <div className="border border-[#222222] bg-neutral-950/40 p-8 rounded-xl space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600/30" />
                      <h4 className="text-xs font-mono tracking-widest text-[#707070] uppercase font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {currentSlide.compareLeftTitle || 'Current Company'}
                      </h4>
                      <div className="space-y-4">
                        {currentSlide.compareLeftItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-start text-base text-neutral-400 font-sans">
                            <span className="text-neutral-500 select-none font-mono text-sm">&darr;</span>
                            <span className="whitespace-pre-wrap">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: Future State (Sovereign) */}
                    <div className="border border-[#222222] bg-neutral-950/80 p-8 rounded-xl space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: accentColor }} />
                      <h4 className="text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                        {currentSlide.compareRightTitle || 'Future Company'}
                      </h4>
                      <div className="space-y-4">
                        {currentSlide.compareRightItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-start text-base text-white font-sans">
                            <span className="select-none font-mono text-sm" style={{ color: accentColor }}>&rarr;</span>
                            <span className="whitespace-pre-wrap">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 05: FRAMEWORK DIAGRAM */}
              {currentSlide.layoutId === 'L05' && (
                <div className="space-y-12 text-center animate-fadeIn">
                  <div className="space-y-2 text-left max-w-xl">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                      {currentSlide.microTagLeft || 'AUTONOMOUS FRAMEWORK'}
                    </span>
                    <h3 className="text-3xl font-black tracking-tight text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                      {currentSlide.headline}
                    </h3>
                  </div>

                  {/* Gorgeous high-fidelity horizontal workflow diagram */}
                  <div className="flex justify-between items-center bg-[#050505] border border-[#222222] p-10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-[9px] font-mono text-[#707070]">
                      SERIES FLOW SCHEMATIC
                    </div>
                    {currentSlide.frameworkNodes?.map((node, idx) => (
                      <div key={idx} className="flex items-center flex-1 last:flex-none">
                        {/* Circle Node */}
                        <div className="flex flex-col items-center space-y-3 z-10">
                          <div 
                            className="w-14 h-14 rounded-full border flex items-center justify-center font-mono text-sm font-bold bg-[#000000] relative transition-all duration-500 hover:scale-105"
                            style={{ 
                              borderColor: idx === 0 ? accentColor : '#222222',
                              boxShadow: idx === 0 ? `0 0 15px ${accentColor}22` : 'none'
                            }}
                          >
                            <span style={{ color: idx === 0 ? accentColor : '#F7F7F7' }}>
                              0{idx + 1}
                            </span>
                            {idx === 0 && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          <span className="text-xs font-mono uppercase font-bold text-neutral-300 tracking-wider">
                            {node}
                          </span>
                        </div>

                        {/* Connection Line */}
                        {idx < currentSlide.frameworkNodes.length - 1 && (
                          <div className="flex-1 h-[1px] bg-neutral-800 mx-4 relative">
                            <div 
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-r border-t border-neutral-700"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-neutral-500 font-sans text-sm text-left max-w-2xl leading-relaxed whitespace-pre-wrap">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* LAYOUT 06: STATISTICS */}
              {currentSlide.layoutId === 'L06' && (
                <div className="grid grid-cols-12 gap-12 items-center text-left animate-fadeIn">
                  <div className="col-span-5 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#707070] block">
                      {currentSlide.microTagLeft || 'METRIC PROOF'}
                    </span>
                    {/* Gigantic oversized bold number */}
                    <span 
                      className="text-[145px] font-black tracking-tighter leading-none block font-['Space_Grotesk']"
                      style={{ color: accentColor }}
                    >
                      {currentSlide.metricVal}
                    </span>
                  </div>

                  <div className="col-span-7 space-y-6">
                    <div className="h-1 w-20" style={{ backgroundColor: accentColor }} />
                    <h3 className="text-3xl font-black tracking-tight text-white leading-relaxed font-['Space_Grotesk'] whitespace-pre-wrap">
                      {currentSlide.metricLabel}
                    </h3>
                    {currentSlide.subtitle && (
                      <p className="text-neutral-400 font-sans text-base leading-relaxed whitespace-pre-wrap">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 07: BLUEPRINT SCHEMATIC */}
              {currentSlide.layoutId === 'L07' && (
                <div className="space-y-8 animate-fadeIn text-left">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#707070]">
                      {currentSlide.microTagLeft || 'TECHNICAL LAYOUT'}
                    </span>
                    <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] uppercase tracking-wider whitespace-pre-wrap">
                      {currentSlide.blueprintTitle || 'APEX ARCHITECTURE BLUEPRINT'}
                    </h3>
                  </div>

                  {/* Schematic technical blueprint container */}
                  <div className="border border-[#222222] bg-neutral-950/40 p-10 rounded-xl relative overflow-hidden font-mono text-[11px] grid grid-cols-12 gap-6 items-center">
                    {/* Schematic grid matrix */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

                    <div className="col-span-4 space-y-4 z-10">
                      <div className="p-4 border border-[#222222] bg-black rounded flex flex-col justify-between h-24">
                        <span className="text-neutral-500">01 // INGESTION</span>
                        <span className="font-bold text-[#F7F7F7]">{currentSlide.blueprintModules[0] || 'API Broker'}</span>
                      </div>
                      <div className="p-4 border border-[#222222] bg-black rounded flex flex-col justify-between h-24">
                        <span className="text-neutral-500">02 // PIPELINE</span>
                        <span className="font-bold text-[#F7F7F7]">{currentSlide.blueprintModules[1] || 'Validation Kernel'}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col items-center justify-center space-y-8 z-10">
                      {/* Technical arrows */}
                      <span className="text-neutral-600 font-bold text-lg animate-pulse">&rarr;</span>
                      <span className="text-neutral-600 font-bold text-lg animate-pulse">&rarr;</span>
                    </div>

                    <div className="col-span-6 border-2 border-dashed border-neutral-800 p-6 bg-[#030303] rounded-lg z-10 space-y-4">
                      <div className="flex justify-between items-center text-[#707070]">
                        <span>CORE ENGINE STACK</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      </div>

                      <div className="p-4 border bg-black rounded flex items-center justify-between" style={{ borderColor: accentColor }}>
                        <span className="text-[#F7F7F7] font-bold">
                          {currentSlide.blueprintModules[2] || 'Durable DB'}
                        </span>
                        <span className="text-[10px] uppercase font-bold" style={{ color: accentColor }}>
                          SECURE NODE
                        </span>
                      </div>

                      {currentSlide.blueprintModules[3] && (
                        <div className="p-3 border border-[#222222] bg-black rounded text-neutral-400">
                          {currentSlide.blueprintModules[3]}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-2xl whitespace-pre-wrap">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* LAYOUT 08: CLOSING SLIDE */}
              {currentSlide.layoutId === 'L08' && (
                <div className="text-center space-y-12 animate-fadeIn max-w-[850px] mx-auto py-6">
                  {/* Small clean brand logo centered */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded border flex items-center justify-center" style={{ borderColor: accentColor }}>
                      <span className="text-base font-bold font-mono" style={{ color: accentColor }}>A</span>
                    </div>
                    <span className="font-['Space_Grotesk'] text-lg font-black tracking-widest text-[#F7F7F7]">
                      APEX SYNC
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-2xl text-neutral-400 leading-relaxed font-sans italic max-w-2xl mx-auto whitespace-pre-wrap">
                      "{currentSlide.quoteText}"
                    </p>
                    {currentSlide.quoteAuthor && (
                      <span className="text-xs font-mono uppercase tracking-widest text-[#707070] font-bold">
                        &mdash; {currentSlide.quoteAuthor}
                      </span>
                    )}
                  </div>

                  <div className="h-[1px] w-32 bg-neutral-800 mx-auto" />

                  {/* Dynamic Audience Question callout */}
                  <h3 
                    className="text-4xl font-black tracking-tight text-[#F7F7F7] leading-tight font-['Space_Grotesk']"
                    style={{ textShadow: `0 0 15px ${accentColor}11` }}
                  >
                    What system are you building today?
                  </h3>
                </div>
              )}

            </div>

            {/* UNIVERSAL REUSABLE SLIDE FOOTER */}
            <div className="w-full flex justify-between items-end border-t border-[#222222]/80 pt-6 font-mono text-[11px] text-[#707070] uppercase tracking-wider shrink-0 z-10">
              <div className="flex gap-6">
                <span>OWNER: <strong className="text-neutral-300">{footerOwner}</strong></span>
                <span>PRODUCTION: <strong className="text-neutral-300">{footerProduction}</strong></span>
              </div>

              <div className="flex gap-6 items-center">
                <span>MONTH: <strong className="text-neutral-300">{footerMonth}</strong></span>
                <span>WEB: <strong className="text-neutral-300" style={{ color: accentColor }}>{footerWebsite}</strong></span>
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-bold text-[#F7F7F7]">
                  {String(activeSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Scaled display status indicator */}
        <div className="text-[10px] text-neutral-500 font-mono mt-4">
          Display Scale: {Math.round(canvasScale * 100)}% &bull; Landscape Square Output (1200 x 1200)
        </div>
      </div>

      {/* RIGHT COLUMN: REUSABLE MASTER COMPONENT CONTROLS (Palantir and Stripe precision UI) */}
      <div className="w-96 border-l border-[#1F1F1F] bg-[#0E0E0E] flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C7A248]" />
            <span className="font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider text-neutral-300">
              Design Master tokens
            </span>
          </div>
          <span className="text-[9px] uppercase px-2 py-0.5 bg-[#C7A248]/10 text-[#C7A248] rounded border border-[#C7A248]/20 font-mono">
            V1.2
          </span>
        </div>

        {/* Tokens configuration and forms */}
        <div className="p-6 space-y-6">
          
          {/* TOKENS PANEL 1: PILLAR CORE SELECTORS */}
          <div className="space-y-3">
            <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">
              Enterprise Series Pillar
            </label>
            <div className="space-y-2">
              {PILLARS.map((p) => {
                const isSelected = p.id === activePillar;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePillar(p.id);
                      persistState(slides, p.id, dayCounter, episodeCounter, seriesName);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
                      isSelected 
                        ? 'bg-black text-white' 
                        : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                    style={{ borderColor: isSelected ? p.accentColor : 'transparent' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
                      <span className="font-['Space_Grotesk']">{p.name}</span>
                    </div>
                    <span 
                      className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono"
                      style={{ color: isSelected ? p.accentColor : '#707070' }}
                    >
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOKENS PANEL 2: HEADER IDENTIFIER METRICS */}
          <div className="border-t border-neutral-800/60 pt-5 space-y-4">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">
              Master Header Variables
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Day Label</label>
                <input
                  type="text"
                  value={dayCounter}
                  onChange={(e) => {
                    setDayCounter(e.target.value);
                    persistState(slides, activePillar, e.target.value, episodeCounter, seriesName);
                  }}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Episode Label</label>
                <input
                  type="text"
                  value={episodeCounter}
                  onChange={(e) => {
                    setEpisodeCounter(e.target.value);
                    persistState(slides, activePillar, dayCounter, e.target.value, seriesName);
                  }}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400">Series Name</label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => {
                  setSeriesName(e.target.value);
                  persistState(slides, activePillar, dayCounter, episodeCounter, e.target.value);
                }}
                className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
              />
            </div>
          </div>

          {/* TOKENS PANEL 3: MASTER LAYOUT SELECTOR & DYNAMIC PLACEHOLDERS */}
          <div className="border-t border-neutral-800/60 pt-5 space-y-4">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">
              Active Slide Settings
            </span>

            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400">Layout Format</label>
              <select
                value={currentSlide.layoutId}
                onChange={(e) => {
                  const updated = { ...currentSlide, layoutId: e.target.value };
                  // Hydrate defaults based on selected template to avoid blank states
                  const initializedDefault = createDefaultSlide(e.target.value, activeSlideIndex);
                  handleUpdateActiveSlide({
                    ...updated,
                    headline: initializedDefault.headline,
                    subtitle: initializedDefault.subtitle,
                    quoteText: initializedDefault.quoteText,
                    quoteAuthor: initializedDefault.quoteAuthor,
                    compareLeftTitle: initializedDefault.compareLeftTitle,
                    compareLeftItems: initializedDefault.compareLeftItems,
                    compareRightTitle: initializedDefault.compareRightTitle,
                    compareRightItems: initializedDefault.compareRightItems,
                    frameworkNodes: initializedDefault.frameworkNodes,
                    metricVal: initializedDefault.metricVal,
                    metricLabel: initializedDefault.metricLabel,
                    blueprintTitle: initializedDefault.blueprintTitle,
                    blueprintModules: initializedDefault.blueprintModules,
                  });
                }}
                className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
              >
                {LAYOUTS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic input blocks based on layout selected */}
            <div className="space-y-4 pt-2 border-t border-neutral-900">
              
              {/* Headline & Subtitle fields */}
              {(currentSlide.layoutId === 'L01' || currentSlide.layoutId === 'L02' || currentSlide.layoutId === 'L04' || currentSlide.layoutId === 'L05' || currentSlide.layoutId === 'L06' || currentSlide.layoutId === 'L07') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400">Headline / Title</label>
                  <textarea
                    rows={2}
                    value={currentSlide.headline}
                    onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, headline: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                  />
                </div>
              )}

              {(currentSlide.layoutId === 'L01' || currentSlide.layoutId === 'L02' || currentSlide.layoutId === 'L04' || currentSlide.layoutId === 'L05' || currentSlide.layoutId === 'L06' || currentSlide.layoutId === 'L07') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400">Subtext Description</label>
                  <textarea
                    rows={3}
                    value={currentSlide.subtitle}
                    onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, subtitle: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                  />
                </div>
              )}

              {/* Layout 03 & 08: Quote Fields */}
              {(currentSlide.layoutId === 'L03' || currentSlide.layoutId === 'L08') && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400">Quote Text</label>
                    <textarea
                      rows={3}
                      value={currentSlide.quoteText}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, quoteText: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400">Author / Attribution</label>
                    <input
                      type="text"
                      value={currentSlide.quoteAuthor}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, quoteAuthor: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                    />
                  </div>
                </>
              )}

              {/* Layout 04: Comparison List Fields */}
              {currentSlide.layoutId === 'L04' && (
                <div className="space-y-3 p-3 bg-neutral-900/30 rounded-lg border border-neutral-800/80">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#707070] font-bold block">
                    Left vs Right Matrix
                  </span>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Left Column Title"
                      value={currentSlide.compareLeftTitle}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, compareLeftTitle: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                    />
                    <textarea
                      rows={4}
                      placeholder="Left Bullet Items (One per line or comma separated)"
                      value={currentSlide.compareLeftItems?.join('\n')}
                      onChange={(e) => handleUpdateActiveSlide({ 
                        ...currentSlide, 
                        compareLeftItems: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean) 
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-neutral-300 font-mono leading-normal resize-y"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <input
                      type="text"
                      placeholder="Right Column Title"
                      value={currentSlide.compareRightTitle}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, compareRightTitle: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                    />
                    <textarea
                      rows={4}
                      placeholder="Right Bullet Items (One per line or comma separated)"
                      value={currentSlide.compareRightItems?.join('\n')}
                      onChange={(e) => handleUpdateActiveSlide({ 
                        ...currentSlide, 
                        compareRightItems: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean) 
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-neutral-300 font-mono leading-normal resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Layout 05: Framework Node Fields */}
              {currentSlide.layoutId === 'L05' && (
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 block">Framework Progress Nodes (One per line or comma separated)</label>
                  <textarea
                    rows={3}
                    placeholder="Progress nodes..."
                    value={currentSlide.frameworkNodes?.join('\n')}
                    onChange={(e) => handleUpdateActiveSlide({ 
                      ...currentSlide, 
                      frameworkNodes: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean) 
                    })}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none leading-normal resize-y"
                  />
                  <p className="text-[9px] text-neutral-600">
                    Separate elements with commas. Max 5 steps recommended for balanced visual proportions.
                  </p>
                </div>
              )}

              {/* Layout 06: Statistics Callout Fields */}
              {currentSlide.layoutId === 'L06' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[10px] text-neutral-400">Stat Value</label>
                    <input
                      type="text"
                      value={currentSlide.metricVal}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, metricVal: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold text-center"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] text-neutral-400">Stat Statement</label>
                    <input
                      type="text"
                      value={currentSlide.metricLabel}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, metricLabel: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Layout 07: Technical Drawing/Blueprint Fields */}
              {currentSlide.layoutId === 'L07' && (
                <div className="space-y-3 p-3 bg-neutral-900/30 rounded-lg border border-neutral-800/80">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#707070] font-bold block">
                    Schematic Components
                  </span>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500">Blueprint Box Header</label>
                    <input
                      type="text"
                      value={currentSlide.blueprintTitle}
                      onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, blueprintTitle: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500 block">Box Nodes (One per line or comma separated)</label>
                    <textarea
                      rows={3}
                      placeholder="Blueprint nodes..."
                      value={currentSlide.blueprintModules?.join('\n')}
                      onChange={(e) => handleUpdateActiveSlide({ 
                        ...currentSlide, 
                        blueprintModules: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean) 
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-white font-mono leading-normal resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Micro labels controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400">Micro UI Tag (Left)</label>
                  <select
                    value={currentSlide.microTagLeft}
                    onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, microTagLeft: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                  >
                    {TINY_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400">Micro UI Tag (Right)</label>
                  <select
                    value={currentSlide.microTagRight}
                    onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, microTagRight: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                  >
                    {TINY_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* TOKENS PANEL 4: UNIVERSAL FOOTER PARAMETERS */}
          <div className="border-t border-neutral-800/60 pt-5 space-y-4">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">
              Master Footer Variables
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Owner Brand</label>
                <input
                  type="text"
                  value={footerOwner}
                  onChange={(e) => setFooterOwner(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Production Name</label>
                <input
                  type="text"
                  value={footerProduction}
                  onChange={(e) => setFooterProduction(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Month / Stamp</label>
                <input
                  type="text"
                  value={footerMonth}
                  onChange={(e) => setFooterMonth(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400">Website Address</label>
                <input
                  type="text"
                  value={footerWebsite}
                  onChange={(e) => setFooterWebsite(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
