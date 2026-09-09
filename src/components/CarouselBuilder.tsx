/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Copy, 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  FileDown,
  RefreshCw,
  Sliders,
  Check,
  LayoutGrid,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Type,
  Palette,
  FileText,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Hash,
  Globe,
  Tag,
  ListOrdered,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FolderKanban
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { BrandSettings, ExportHistoryItem } from '../types';

interface CarouselBuilderProps {
  key?: string;
  brandSettings: BrandSettings;
  brandId: string;
  projectId: string;
  projectName: string;
  projectCampaignName: string;
  onProjectActivity: () => void;
  onAddExport: (item: ExportHistoryItem) => void;
}

// Universal Accent Pillars
interface PillarOption {
  id: string;
  name: string;
  accentColor: string;
  label: string;
  badge: string;
}

const PILLARS: PillarOption[] = [
  { id: 'philosophy', name: 'Enterprise Philosophy', accentColor: '#D4AF37', label: 'Gold Accent', badge: 'GOLD' },
  { id: 'blueprint', name: 'Enterprise Blueprint', accentColor: '#1E60FF', label: 'Electric Blue', badge: 'BLUE' },
  { id: 'building', name: 'Building Apex', accentColor: '#10B981', label: 'Emerald Green', badge: 'EMERALD' },
  { id: 'spotlight', name: 'Industry Spotlight', accentColor: '#F97316', label: 'Safety Orange', badge: 'ORANGE' },
  { id: 'vision', name: 'Enterprise Vision', accentColor: '#8B5CF6', label: 'Royal Purple', badge: 'PURPLE' }
];

// 8 Universal Layout Archetypes
interface LayoutType {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  recommendedFor: string;
}

const LAYOUTS: LayoutType[] = [
  {
    id: 'L01',
    number: '01',
    name: 'Hero Statement',
    subtitle: 'Display Headline + Subtitle',
    description: 'High-impact opener with bold display headline, subtitle, and micro tags.',
    recommendedFor: 'Slide 1 (Hooks, Philosophy, Vision)'
  },
  {
    id: 'L02',
    number: '02',
    name: 'Explanation',
    subtitle: 'Concept + Explanatory Text',
    description: 'One key idea paired with a concise paragraph and minimalist visual geometry.',
    recommendedFor: 'Slide 2 (Core Problem or Definition)'
  },
  {
    id: 'L03',
    number: '03',
    name: 'Quotation',
    subtitle: 'High-Contrast Quote + Attribution',
    description: 'Generous negative space, large quotation marks, and strong authoritative attribution.',
    recommendedFor: 'Slide 3 (Executive Maxim or Law)'
  },
  {
    id: 'L04',
    number: '04',
    name: 'Comparison',
    subtitle: 'Current State vs Future State',
    description: 'Two-column matrix contrasting legacy human friction against autonomous systems.',
    recommendedFor: 'Slide 4 or 5 (Paradigm Shifts)'
  },
  {
    id: 'L05',
    number: '05',
    name: 'Framework Flow',
    subtitle: 'Sequential Node Progression',
    description: 'Horizontal step-by-step schematic showing state transitions and workflow loops.',
    recommendedFor: 'Slide 4 or 5 (Operating Systems)'
  },
  {
    id: 'L06',
    number: '06',
    name: 'Statistic Callout',
    subtitle: 'Oversized Metric + Context',
    description: 'Giant typographic metric (e.g. 98%, 10x) paired with supportive proof statement.',
    recommendedFor: 'Slide 6 (Empirical Proof)'
  },
  {
    id: 'L07',
    number: '07',
    name: 'Blueprint Schematic',
    subtitle: 'System Architecture Drawing',
    description: 'Technical box diagram representing ingestion, kernel pipelines, and database stacks.',
    recommendedFor: 'Slide 5 or 6 (Architecture)'
  },
  {
    id: 'L08',
    number: '08',
    name: 'Closing CTA',
    subtitle: 'Brand Signature + Audience Prompt',
    description: 'Brand mark, memorable conclusion quote, and open audience reflection question.',
    recommendedFor: 'Final Slide (Call-to-Action & Engagement)'
  }
];

// Micro tags available
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

export default function CarouselBuilder({
  brandSettings,
  brandId,
  projectId,
  projectName,
  projectCampaignName,
  onProjectActivity,
  onAddExport
}: CarouselBuilderProps) {
  // Global slide system state
  const [activePillar, setActivePillar] = useState<string>('philosophy');
  const [dayCounter, setDayCounter] = useState<string>('DAY 01');
  const [episodeCounter, setEpisodeCounter] = useState<string>('EPISODE 01');
  const [seriesName, setSeriesName] = useState<string>(projectCampaignName || 'Enterprise Intelligence');
  
  // Footer settings
  const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const [footerOwner, setFooterOwner] = useState<string>(brandSettings.watermarkText || 'Apex Sync');
  const [footerProduction, setFooterProduction] = useState<string>('Enterprise Intelligence Series');
  const [footerMonth, setFooterMonth] = useState<string>(currentMonthLabel);
  const [footerWebsite, setFooterWebsite] = useState<string>(brandSettings.website || 'apexsync.io');

  // List of slides in the carousel deck
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // View modes: 'canvas' (Stage view) | 'grid' (All slides deck storyboard)
  const [viewMode, setViewMode] = useState<'canvas' | 'grid'>('canvas');
  
  // Right sidebar tab state: 'content' | 'tokens' | 'metadata'
  const [activeInspectorTab, setActiveInspectorTab] = useState<'content' | 'tokens' | 'metadata'>('content');

  // Editor panel & export states
  const [isExportingSingle, setIsExportingSingle] = useState<boolean>(false);
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);
  const [isCopyingImage, setIsCopyingImage] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Dynamic scale calculation
  const [autoScale, setAutoScale] = useState<number>(0.42);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // percentage 50 - 150

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageKeys = useMemo(() => ({
    slides: `apex_sync_project_${projectId}_carousel_slides_v1`,
    pillar: `apex_sync_project_${projectId}_carousel_pillar_v1`,
    day: `apex_sync_project_${projectId}_carousel_day_v1`,
    episode: `apex_sync_project_${projectId}_carousel_episode_v1`,
    series: `apex_sync_project_${projectId}_carousel_series_v1`,
    workspace: `apex_sync_project_${projectId}_carousel_workspace_v1`
  }), [projectId]);

  // Default slide initializer based on Layout archetype
  const createDefaultSlide = useCallback((layoutId: string, index: number): SlideData => {
    switch (layoutId) {
      case 'L01':
        return {
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L01',
          headline: "Companies Don't Scale Because They Hire More People.",
          subtitle: "They scale by building sovereign, automated machine operating systems.",
          quoteText: "The system is the leverage.",
          quoteAuthor: "Apex Philosophy",
          compareLeftTitle: "Current Company",
          compareLeftItems: ["Meetings & Status Synced", "Manual reporting cycles", "Email and chat approvals"],
          compareRightTitle: "Future Sovereign Org",
          compareRightItems: ["AI agents coordinate work", "Real-time state dashboards", "Autonomous automated workflows"],
          frameworkNodes: ["Raw Data", "AI Analysis", "Automation", "Real-time Insights", "Autonomous Execution"],
          metricVal: "98%",
          metricLabel: "Of corporate operations remain manual, un-automated, and error-prone.",
          blueprintTitle: "Autonomous State Machine",
          blueprintModules: ["Ingest API Gateway", "Kernel State Processor", "Durable Event Store", "AI Routing Core"],
          microTagLeft: "CONFIDENTIAL",
          microTagRight: "REVISION 1.0"
        };
      case 'L02':
        return {
          id: Math.random().toString(36).substring(2, 9),
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
          metricLabel: "Throughput improvement across back-office operations.",
          blueprintTitle: "Data Flow Architecture",
          blueprintModules: ["Ingest API", "Parser Engine", "Sync Sink"],
          microTagLeft: "SYSTEM NODE",
          microTagRight: "EXECUTIVE BRIEF"
        };
      case 'L03':
        return {
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L03',
          headline: "",
          subtitle: "",
          quoteText: "If your organization relies on individual heroics to ship standard value, you do not have a system—you have a recurring emergency.",
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
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L04',
          headline: "The Operational Leap",
          subtitle: "Shifting from legacy human-dependent cycles to systemic autonomous workflows.",
          quoteText: "",
          quoteAuthor: "",
          compareLeftTitle: "Current Company",
          compareLeftItems: [
            "Meetings and status syncs",
            "Manual reporting cycles",
            "Email & chat approvals",
            "Fragmented tribal knowledge"
          ],
          compareRightTitle: "Future Company",
          compareRightItems: [
            "AI agents coordinate work",
            "Real-time state dashboards",
            "Autonomous automated workflows",
            "Centralized system intelligence"
          ],
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
          id: Math.random().toString(36).substring(2, 9),
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
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L06',
          headline: "Extreme Metric Leverage",
          subtitle: "Autonomous operating loops deliver exponential leverage over linear human headcount expansion.",
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
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L07',
          headline: "Systemic Core Engine",
          subtitle: "High-level technical drawing detailing autonomous message ingestion, validation kernel, and execution loops.",
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
          blueprintModules: ["Ingest Broker", "Validation Kernel", "Durable Storage", "AI Routing Core", "Execution Dispatcher"],
          microTagLeft: "ENTERPRISE MODEL",
          microTagRight: "PROTOCOL"
        };
      case 'L08':
      default:
        return {
          id: Math.random().toString(36).substring(2, 9),
          layoutId: 'L08',
          headline: "",
          subtitle: "",
          quoteText: "Are you building tools, or are you building the system that builds them?",
          quoteAuthor: "Apex Core Philosophy",
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
  }, []);

  // Show auto-dismissing toast notifications
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Populate default 7-slide carousel flow on initial load
  useEffect(() => {
    try {
      const allowLegacyMigration = projectId === 'apex-enterprise-intelligence';

      const cachedSlides =
        localStorage.getItem(storageKeys.slides) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_slides_v1') : null);
      const cachedPillar =
        localStorage.getItem(storageKeys.pillar) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_pillar_v1') : null);
      const cachedDay =
        localStorage.getItem(storageKeys.day) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_day_v1') : null);
      const cachedEpisode =
        localStorage.getItem(storageKeys.episode) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_episode_v1') : null);
      const cachedSeries =
        localStorage.getItem(storageKeys.series) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_series_v1') : null);
      const cachedWorkspace =
        localStorage.getItem(storageKeys.workspace) ||
        (allowLegacyMigration ? localStorage.getItem('apex_carousel_workspace_v2') : null);

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

    // Default 7-Step Sequence:
    const initialDeck = [
      { ...createDefaultSlide('L01', 0), headline: "Companies Don't Scale Because They Hire More People.", subtitle: "They scale by building sovereign machine operating systems." },
      { ...createDefaultSlide('L02', 1), headline: "The Human Headcount Fallacy", subtitle: "Expanding human staff adds communication nodes, schedule bottlenecks, and operational variance. Software pipelines offer infinite replication without communication tax." },
      { ...createDefaultSlide('L03', 2), quoteText: "If your organization relies on individual heroics to ship standard value, you do not have a system—you have a recurring emergency." },
      { ...createDefaultSlide('L05', 3), headline: "The Autonomous Framework Stack", subtitle: "Modern organizations shift focus from human processes to modular automated loops." },
      { ...createDefaultSlide('L04', 4), headline: "The Paradigm Shift", subtitle: "Compare the structure of traditional companies with sovereign digital operations.", compareLeftTitle: "Current Org Status", compareRightTitle: "Future Sovereign Org" },
      { ...createDefaultSlide('L06', 5), metricVal: "98%", metricLabel: "Of corporate tasks are repetitive rules-based execution ripe for autonomic conversion." },
      { ...createDefaultSlide('L08', 6), quoteText: "How much of your day is spent performing actions that can be written down as a formal state machine?" }
    ];
    setSlides(initialDeck);
  }, [projectId, createDefaultSlide, storageKeys]);

  // Persist workspace-level settings
  useEffect(() => {
    try {
      localStorage.setItem(storageKeys.workspace, JSON.stringify({
        footerOwner,
        footerProduction,
        footerMonth,
        footerWebsite,
        activeSlideIndex
      }));
      onProjectActivity();
    } catch (e) {
      console.error('Failed to cache carousel workspace:', e);
    }
  }, [projectId, footerOwner, footerProduction, footerMonth, footerWebsite, activeSlideIndex, onProjectActivity, storageKeys.workspace]);

  // Save changes to localStorage on slide updates
  const persistState = (currentSlides: SlideData[], pillar: string, day: string, episode: string, series: string) => {
    try {
      localStorage.setItem(storageKeys.slides, JSON.stringify(currentSlides));
      localStorage.setItem(storageKeys.pillar, pillar);
      localStorage.setItem(storageKeys.day, day);
      localStorage.setItem(storageKeys.episode, episode);
      localStorage.setItem(storageKeys.series, series);
      onProjectActivity();
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
    showToast(`Added Slide ${updatedDeck.length} (${LAYOUTS.find(l => l.id === layoutId)?.name})`, 'success');
  };

  const handleDuplicateSlide = (index: number) => {
    const targetSlide = slides[index];
    if (!targetSlide) return;
    const duplicated: SlideData = {
      ...targetSlide,
      id: Math.random().toString(36).substring(2, 9)
    };
    const updatedDeck = [...slides];
    updatedDeck.splice(index + 1, 0, duplicated);
    setSlides(updatedDeck);
    setActiveSlideIndex(index + 1);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
    showToast(`Duplicated Slide ${index + 1}`, 'success');
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updatedDeck = slides.filter((_, i) => i !== index);
    setSlides(updatedDeck);
    const nextIdx = Math.max(0, Math.min(index, updatedDeck.length - 1));
    setActiveSlideIndex(nextIdx);
    persistState(updatedDeck, activePillar, dayCounter, episodeCounter, seriesName);
    showToast(`Removed Slide ${index + 1}`, 'info');
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

  const handleResetDeck = () => {
    if (!window.confirm("Reset entire carousel to the default 7-slide master sequence?")) return;
    const defaultDeck = [
      { ...createDefaultSlide('L01', 0), headline: "Companies Don't Scale Because They Hire More People.", subtitle: "They scale by building sovereign machine operating systems." },
      { ...createDefaultSlide('L02', 1), headline: "The Human Headcount Fallacy", subtitle: "Expanding human staff adds communication nodes, schedule bottlenecks, and operational variance." },
      { ...createDefaultSlide('L03', 2), quoteText: "If your organization relies on individual heroics to ship standard value, you do not have a system—you have a recurring emergency." },
      { ...createDefaultSlide('L05', 3), headline: "The Autonomous Framework Stack", subtitle: "Modern organizations shift focus from human processes to modular automated loops." },
      { ...createDefaultSlide('L04', 4), headline: "The Paradigm Shift", subtitle: "Compare the structure of traditional companies with sovereign digital operations.", compareLeftTitle: "Current Org Status", compareRightTitle: "Future Sovereign Org" },
      { ...createDefaultSlide('L06', 5), metricVal: "98%", metricLabel: "Of corporate tasks are repetitive rules-based execution ripe for autonomic conversion." },
      { ...createDefaultSlide('L08', 6), quoteText: "How much of your day is spent performing actions that can be written down as a formal state machine?" }
    ];
    setSlides(defaultDeck);
    setActiveSlideIndex(0);
    persistState(defaultDeck, activePillar, dayCounter, episodeCounter, seriesName);
    showToast("Reset carousel to 7-slide master standard", "info");
  };

  // Dynamic canvas viewport scaling observer
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      // Subtract margins, headers, bottom thumbnails bar
      const availableWidth = width - 48;
      const availableHeight = height - 120;
      const fitted = Math.min(availableWidth / 1200, availableHeight / 1200);
      const clamped = Math.max(0.2, Math.min(0.85, fitted));
      setAutoScale(clamped);
    };

    calculateScale();
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [slides, activeSlideIndex, viewMode]);

  const effectiveScale = autoScale * (zoomLevel / 100);

  // Export mechanisms
  const handleExportSinglePNG = async () => {
    if (!canvasRef.current || isExportingSingle || isExportingAll) return;
    setIsExportingSingle(true);

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

      showToast(`Slide ${activeSlideIndex + 1} PNG exported at 1200×1200px`, 'success');
      
      onAddExport({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        brandId,
        brandSnapshot: { ...brandSettings },
        projectId,
        projectName,
        templateId: 'enterprise-philosophy',
        templateName: `Apex Slide ${activeSlideIndex + 1} (${slides[activeSlideIndex]?.layoutId})`,
        headline: slides[activeSlideIndex]?.headline || slides[activeSlideIndex]?.quoteText || 'Carousel Slide',
        format: 'png',
        resolution: '1200x1200px'
      });
    } catch (err) {
      console.error('Error during image capture:', err);
      showToast('Export failed. Please check browser permissions.', 'error');
    } finally {
      setIsExportingSingle(false);
    }
  };

  const handleCopySlideImage = async () => {
    if (!canvasRef.current || isCopyingImage) return;
    setIsCopyingImage(true);

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

      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      showToast(`Slide ${activeSlideIndex + 1} image copied to clipboard!`, 'success');
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      showToast('Direct clipboard copy locked. Export PNG directly instead.', 'error');
    } finally {
      setIsCopyingImage(false);
    }
  };

  const handleExportAllPDF = async () => {
    if (isExportingAll || isExportingSingle || slides.length === 0) return;
    setIsExportingAll(true);

    try {
      const pdf = new jsPDF('p', 'px', [1200, 1200]);
      const currentIdx = activeSlideIndex;

      for (let i = 0; i < slides.length; i++) {
        setActiveSlideIndex(i);
        await new Promise(r => setTimeout(r, 120));

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

      setActiveSlideIndex(currentIdx);
      pdf.save(`apex-slide-deck-${seriesName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      showToast(`Master PDF Deck (${slides.length} slides) downloaded!`, 'success');

      onAddExport({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        brandId,
        brandSnapshot: { ...brandSettings },
        projectId,
        projectName,
        templateId: 'enterprise-philosophy',
        templateName: `Master Carousel (${slides.length} slides)`,
        headline: seriesName,
        format: 'pdf',
        resolution: '1200x1200px (Multi-page PDF)'
      });
    } catch (err) {
      console.error('Error during master PDF deck generation:', err);
      showToast('PDF compile failed. Please try exporting slides individually.', 'error');
    } finally {
      setIsExportingAll(false);
    }
  };

  const activePillarObj = PILLARS.find(p => p.id === activePillar) || PILLARS[0];
  const accentColor = activePillarObj.accentColor;
  const currentSlide = slides[activeSlideIndex] || createDefaultSlide('L01', 0);
  const currentLayoutObj = LAYOUTS.find(l => l.id === currentSlide.layoutId) || LAYOUTS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden select-none bg-[#080808]" id="carousel-builder-panel">
      
      {/* TOP CONTROL & TOOLBAR HEADER */}
      <div className="h-14 border-b border-[#1F1F1F] bg-[#0C0C0C] px-5 flex items-center justify-between shrink-0 z-20">
        
        {/* Left Side: System Metadata & Pillar Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pr-4 border-r border-[#1F1F1F]">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px]" style={{ backgroundColor: accentColor, color: accentColor }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Space_Grotesk'] tracking-tight">
                  {seriesName || 'Apex Sync Slide System'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider" style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}35` }}>
                  {activePillarObj.badge}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                {dayCounter} &bull; {episodeCounter} &bull; {slides.length} Slides
              </p>
            </div>
          </div>

          {/* View Mode Switcher: Stage View vs Grid Storyboard */}
          <div className="flex items-center bg-black border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'canvas' ? 'bg-[#181818] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Stage View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-[#181818] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Deck Grid ({slides.length})</span>
            </button>
          </div>
        </div>

        {/* Right Side: Zoom Controls & High-Fidelity Export Actions */}
        <div className="flex items-center gap-3">
          
          {/* Zoom Toggles in Stage View */}
          {viewMode === 'canvas' && (
            <div className="flex items-center gap-1 bg-black border border-neutral-800 rounded-lg p-1 text-neutral-400">
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                disabled={zoomLevel <= 50}
                className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-semibold px-1.5 text-neutral-300 min-w-[36px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
                disabled={zoomLevel >= 160}
                className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-1.5 py-0.5 text-[9px] font-mono text-neutral-500 hover:text-neutral-300 border-l border-neutral-800 ml-0.5"
                title="Reset Zoom to 100%"
              >
                1:1
              </button>
            </div>
          )}

          {/* Quick Copy Image Button */}
          <button
            onClick={handleCopySlideImage}
            disabled={isCopyingImage || isExportingSingle || isExportingAll}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-neutral-800 disabled:opacity-40"
            title="Copy current slide image to clipboard"
          >
            {isCopyingImage ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C7A248]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Copy Slide</span>
          </button>

          {/* Export Single Slide PNG */}
          <button
            onClick={handleExportSinglePNG}
            disabled={isExportingSingle || isExportingAll}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-neutral-800 disabled:opacity-40"
          >
            {isExportingSingle ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C7A248]" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export PNG</span>
          </button>

          {/* Export Master Multi-page PDF */}
          <button
            onClick={handleExportAllPDF}
            disabled={isExportingSingle || isExportingAll}
            className="px-4 py-1.5 bg-[#C7A248] hover:bg-[#b5913a] text-black rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(199,162,72,0.2)] disabled:opacity-50"
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

      {/* TOAST ALERT NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-18 right-8 z-50 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 shadow-2xl border ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-neutral-900/95 border-[#C7A248]/40 text-neutral-100 shadow-[0_0_20px_rgba(199,162,72,0.15)]'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#C7A248] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN WORKSPACE BODY */}
      {viewMode === 'grid' ? (
        /* ================= GRID STORYBOARD VIEW ================= */
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Deck Storyboard & Overview
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Visualizing all {slides.length} slides in sequence. Re-order, duplicate, or jump into any slide.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDeck}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Sequence</span>
              </button>
            </div>
          </div>

          {/* Grid of slide cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {slides.map((s, index) => {
              const layoutObj = LAYOUTS.find(l => l.id === s.layoutId) || LAYOUTS[0];
              const isSelected = index === activeSlideIndex;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSlideIndex(index);
                    setViewMode('canvas');
                  }}
                  className={`bg-[#0E0E0E] border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-[#C7A248]/50 group relative ${
                    isSelected ? 'border-[#C7A248] ring-1 ring-[#C7A248]/30 shadow-[0_0_20px_rgba(199,162,72,0.1)]' : 'border-[#1F1F1F]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#C7A248] tracking-wider uppercase">
                        SLIDE {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-400 uppercase font-semibold">
                        {s.layoutId}
                      </span>
                    </div>

                    {/* Miniature representation box */}
                    <div className="h-36 bg-black border border-neutral-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-neutral-700 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }} />
                      
                      <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500">
                        <span>{dayCounter}</span>
                        <span>{s.microTagLeft}</span>
                      </div>

                      <div className="space-y-1 my-auto">
                        <p className="text-xs font-bold text-white font-['Space_Grotesk'] line-clamp-2 leading-snug">
                          {s.layoutId === 'L03' || s.layoutId === 'L08' ? s.quoteText : s.headline || layoutObj.name}
                        </p>
                        <p className="text-[9px] text-neutral-400 line-clamp-1">
                          {s.subtitle || s.quoteAuthor || layoutObj.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[8px] font-mono text-neutral-600 border-t border-neutral-900 pt-1">
                        <span>{footerOwner}</span>
                        <span className="text-neutral-400">{index + 1}/{slides.length}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-white font-['Space_Grotesk'] truncate">{layoutObj.name}</h4>
                      <p className="text-[10px] text-neutral-500 line-clamp-1">{layoutObj.description}</p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-900" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Left/Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Right/Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateSlide(index)}
                        className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                        title="Duplicate Slide"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {slides.length > 1 && (
                      <button
                        onClick={() => handleDeleteSlide(index)}
                        className="p-1.5 hover:bg-rose-950/60 rounded text-neutral-600 hover:text-rose-400 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Slide Tile */}
            <div className="border border-dashed border-neutral-800 bg-[#0A0A0A] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
              <span className="text-xs font-semibold text-neutral-400">Append New Slide Layout</span>
              <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs">
                {LAYOUTS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleAddSlide(l.id)}
                    className="py-2 bg-neutral-900 hover:bg-[#C7A248] hover:text-black border border-neutral-800 rounded text-xs font-mono font-bold text-neutral-300 transition-all"
                    title={l.name}
                  >
                    {l.id}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-600">Choose an archetype code to append to deck.</p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= STAGE VIEW (3-COLUMN STUDIO) ================= */
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT COLUMN: SLIDE DECK SEQUENCE LIST */}
          <div className="w-72 border-r border-[#1F1F1F] bg-[#0C0C0C] flex flex-col h-full shrink-0">
            <div className="p-3.5 border-b border-[#1F1F1F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#C7A248]" />
                <span className="font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider text-neutral-300">
                  Deck Slides ({slides.length})
                </span>
              </div>
              <button
                onClick={handleResetDeck}
                className="text-neutral-500 hover:text-neutral-300 p-1 rounded transition-colors"
                title="Reset sequence"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slides vertical sequence stack */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <AnimatePresence initial={false}>
                {slides.map((s, index) => {
                  const isActive = index === activeSlideIndex;
                  const layoutObj = LAYOUTS.find(l => l.id === s.layoutId) || LAYOUTS[0];

                  return (
                    <motion.div
                      key={s.id}
                      layoutId={`slide-card-${s.id}`}
                      className={`border rounded-xl p-3 relative cursor-pointer group transition-all ${
                        isActive 
                          ? 'bg-black border-[#C7A248]/50 shadow-[0_0_15px_rgba(199,162,72,0.08)]' 
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                      }`}
                      onClick={() => setActiveSlideIndex(index)}
                    >
                      {/* Top slide identifier */}
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#C7A248]' : 'bg-neutral-700'}`} />
                          <span className="font-mono text-[10px] text-[#C7A248] font-bold tracking-wider uppercase">
                            {String(index + 1).padStart(2, '0')} &bull; {s.layoutId}
                          </span>
                        </div>
                        
                        {/* Hover Action Buttons */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          {index > 0 && (
                            <button 
                              onClick={() => handleMoveSlide(index, 'up')}
                              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                              title="Move Slide Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                          )}
                          {index < slides.length - 1 && (
                            <button 
                              onClick={() => handleMoveSlide(index, 'down')}
                              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                              title="Move Slide Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDuplicateSlide(index)}
                            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {slides.length > 1 && (
                            <button 
                              onClick={() => handleDeleteSlide(index)}
                              className="p-1 hover:bg-rose-950/60 rounded text-neutral-500 hover:text-rose-400"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Title summary */}
                      <h4 className="text-white text-xs font-semibold truncate font-['Space_Grotesk']">
                        {s.layoutId === 'L03' || s.layoutId === 'L08' ? s.quoteText : s.headline || layoutObj.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 truncate leading-tight mt-0.5">
                        {layoutObj.subtitle}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Add Slide Quick Bar */}
            <div className="p-3 border-t border-[#1F1F1F] bg-[#080808] space-y-2">
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">
                Add Slide Layout
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => handleAddSlide(layout.id)}
                    className="py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#C7A248]/40 rounded text-[10px] font-mono text-neutral-300 font-bold transition-all hover:bg-black hover:text-white text-center"
                    title={`${layout.id} — ${layout.name}`}
                  >
                    {layout.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER STAGE CANVAS VIEW */}
          <div 
            ref={containerRef} 
            className="flex-1 bg-[#050505] flex flex-col items-center justify-between p-6 overflow-y-auto relative select-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(199,162,72,0.03),transparent_50%)] pointer-events-none" />

            {/* Slide Navigation Pagination Floating Controls */}
            <div className="flex items-center justify-between w-full max-w-[680px] mb-3 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeSlideIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0E0E0E] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span className="text-xs font-mono text-neutral-400 font-bold px-2">
                  Slide {activeSlideIndex + 1} of {slides.length}
                </span>
                <button
                  onClick={() => setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                  disabled={activeSlideIndex === slides.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0E0E0E] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  {currentLayoutObj.name}
                </span>
              </div>
            </div>

            {/* Scaled Canvas Stage */}
            <div 
              className="flex items-center justify-center overflow-hidden shrink-0 my-auto"
              style={{
                width: `${1200 * effectiveScale}px`,
                height: `${1200 * effectiveScale}px`,
              }}
            >
              {/* 1200x1200px HIGH-RESOLUTION MASTER CANVAS */}
              <div 
                ref={canvasRef} 
                className="w-[1200px] h-[1200px] p-24 flex flex-col justify-between relative overflow-hidden select-none text-white bg-[#000000] border border-[#222222]/90 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                style={{ fontFamily: brandSettings.fontFamily || 'Space Grotesk' }}
              >
                {/* Classifier Grid background texture overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                {/* Dynamic Radial Accent Glow corresponding to the active Pillar */}
                <div 
                  className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full blur-[190px] pointer-events-none opacity-30 transition-all duration-500"
                  style={{ backgroundColor: accentColor }}
                />

                {/* ================= UNIVERSAL SLIDE HEADER ================= */}
                <div className="w-full flex justify-between items-start border-b border-[#222222]/80 pb-6 shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    {/* Brand Logo or Fallback */}
                    {brandSettings.logoUrl ? (
                      <img 
                        src={brandSettings.logoUrl} 
                        alt="Brand Logo" 
                        referrerPolicy="no-referrer"
                        className="h-8 object-contain opacity-95" 
                      />
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black font-mono" style={{ backgroundColor: accentColor }}>
                          A
                        </div>
                        <span className="font-bold text-sm tracking-wider font-['Space_Grotesk'] text-white">
                          {footerOwner || 'APEX SYNC'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Day / Episode / Series metadata stack */}
                  <div className="text-right flex items-center gap-3 font-mono">
                    <span 
                      className="text-[11px] px-3 py-1 text-black font-extrabold uppercase rounded tracking-wider transition-colors duration-500"
                      style={{ backgroundColor: accentColor }}
                    >
                      {dayCounter}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest pl-3 border-l border-[#222222]">
                      {episodeCounter}
                    </span>
                    <span className="text-[11px] text-neutral-200 font-bold uppercase tracking-widest pl-3 border-l border-[#222222]">
                      {seriesName}
                    </span>
                  </div>
                </div>

                {/* ================= CENTRAL MASTER LAYOUT RENDERING ================= */}
                <div className="flex-1 w-full flex flex-col justify-center py-10 z-10">
                  
                  {/* LAYOUT 01: HERO STATEMENT */}
                  {currentSlide.layoutId === 'L01' && (
                    <div className="space-y-8 animate-fadeIn text-left">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                            {currentSlide.microTagLeft}
                          </span>
                        </div>
                        <h1 
                          className="text-[52px] font-black tracking-tight leading-[1.12] text-[#F7F7F7] max-w-[980px] font-['Space_Grotesk'] whitespace-pre-wrap"
                          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                          {currentSlide.headline}
                        </h1>
                      </div>

                      <div className="h-[2px] w-24" style={{ backgroundColor: accentColor }} />

                      <p className="text-xl text-neutral-400 font-sans tracking-wide leading-relaxed max-w-[760px] whitespace-pre-wrap">
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
                          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                            {currentSlide.microTagLeft || 'EXECUTIVE BRIEF'}
                          </span>
                        </div>
                        <h2 className="text-[44px] font-black tracking-tight leading-tight text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                          {currentSlide.headline}
                        </h2>
                        <p className="text-xl text-neutral-400 leading-relaxed font-sans max-w-[640px] whitespace-pre-wrap">
                          {currentSlide.subtitle}
                        </p>
                      </div>

                      {/* Minimalist geometric illustration block */}
                      <div className="col-span-4 flex justify-end">
                        <div className="border border-[#222222] p-8 rounded-2xl bg-neutral-950/80 w-[240px] h-[240px] flex flex-col justify-between relative shadow-2xl">
                          <div className="absolute top-4 right-4 text-[10px] font-mono text-neutral-500">
                            001 // SYSTEM
                          </div>
                          <div className="w-11 h-11 rounded-lg border flex items-center justify-center" style={{ borderColor: `${accentColor}60`, backgroundColor: `${accentColor}12` }}>
                            <Sliders className="w-5 h-5" style={{ color: accentColor }} />
                          </div>
                          <div className="space-y-1.5">
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
                    <div className="text-center space-y-10 py-4 max-w-[940px] mx-auto animate-fadeIn">
                      <div 
                        className="font-serif text-[120px] leading-none select-none h-14"
                        style={{ color: accentColor }}
                      >
                        “
                      </div>
                      
                      <blockquote 
                        className="text-[36px] font-medium leading-[1.35] tracking-wide text-[#F7F7F7] font-['Space_Grotesk'] italic whitespace-pre-wrap"
                      >
                        {currentSlide.quoteText}
                      </blockquote>

                      <div className="flex items-center justify-center gap-3 font-mono">
                        <div className="w-12 h-[1px] bg-[#222222]" />
                        <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                          {currentSlide.quoteAuthor || 'Sovereign Intelligence'}
                        </span>
                        <div className="w-12 h-[1px] bg-[#222222]" />
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 04: COMPARISON MATRIX */}
                  {currentSlide.layoutId === 'L04' && (
                    <div className="space-y-10 animate-fadeIn text-left">
                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
                          {currentSlide.microTagLeft || 'DECISION MATRIX'}
                        </span>
                        <h2 className="text-[38px] font-black tracking-tight text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                          {currentSlide.headline}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-12">
                        {/* Left Column: Legacy State */}
                        <div className="border border-[#222222] bg-neutral-950/50 p-8 rounded-2xl space-y-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-600/40" />
                          <h4 className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            {currentSlide.compareLeftTitle || 'Current Company'}
                          </h4>
                          <div className="space-y-4">
                            {currentSlide.compareLeftItems?.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-start text-base text-neutral-400 font-sans">
                                <span className="text-neutral-600 select-none font-mono text-sm">&darr;</span>
                                <span className="whitespace-pre-wrap">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Column: Sovereign Future State */}
                        <div className="border border-[#222222] bg-neutral-950/80 p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: accentColor }} />
                          <h4 className="text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2" style={{ color: accentColor }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
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

                  {/* LAYOUT 05: FRAMEWORK PROGRESSION */}
                  {currentSlide.layoutId === 'L05' && (
                    <div className="space-y-12 text-center animate-fadeIn">
                      <div className="space-y-2 text-left max-w-2xl">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                          {currentSlide.microTagLeft || 'AUTONOMOUS FRAMEWORK'}
                        </span>
                        <h3 className="text-[34px] font-black tracking-tight text-white font-['Space_Grotesk'] whitespace-pre-wrap">
                          {currentSlide.headline}
                        </h3>
                      </div>

                      {/* Horizontal progress schematic */}
                      <div className="flex justify-between items-center bg-[#050505] border border-[#222222] p-10 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-2 right-4 text-[9px] font-mono text-neutral-600">
                          SERIES FLOW SCHEMATIC
                        </div>
                        {currentSlide.frameworkNodes?.map((node, idx) => (
                          <div key={idx} className="flex items-center flex-1 last:flex-none">
                            {/* Circle Node */}
                            <div className="flex flex-col items-center space-y-3 z-10">
                              <div 
                                className="w-14 h-14 rounded-full border flex items-center justify-center font-mono text-sm font-bold bg-[#000000] relative transition-all"
                                style={{ 
                                  borderColor: idx === 0 ? accentColor : '#222222',
                                  boxShadow: idx === 0 ? `0 0 20px ${accentColor}30` : 'none'
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

                            {/* Connecting Vector Arrow */}
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

                      <p className="text-neutral-400 font-sans text-base text-left max-w-2xl leading-relaxed whitespace-pre-wrap">
                        {currentSlide.subtitle}
                      </p>
                    </div>
                  )}

                  {/* LAYOUT 06: METRIC STATISTIC */}
                  {currentSlide.layoutId === 'L06' && (
                    <div className="grid grid-cols-12 gap-12 items-center text-left animate-fadeIn">
                      <div className="col-span-5 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
                          {currentSlide.microTagLeft || 'METRIC PROOF'}
                        </span>
                        <span 
                          className="text-[145px] font-black tracking-tighter leading-none block font-['Space_Grotesk']"
                          style={{ color: accentColor }}
                        >
                          {currentSlide.metricVal}
                        </span>
                      </div>

                      <div className="col-span-7 space-y-6">
                        <div className="h-1 w-20" style={{ backgroundColor: accentColor }} />
                        <h3 className="text-[34px] font-black tracking-tight text-white leading-relaxed font-['Space_Grotesk'] whitespace-pre-wrap">
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

                  {/* LAYOUT 07: TECHNICAL BLUEPRINT */}
                  {currentSlide.layoutId === 'L07' && (
                    <div className="space-y-8 animate-fadeIn text-left">
                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                          {currentSlide.microTagLeft || 'TECHNICAL SCHEMATIC'}
                        </span>
                        <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] uppercase tracking-wider whitespace-pre-wrap">
                          {currentSlide.blueprintTitle || 'APEX ARCHITECTURE BLUEPRINT'}
                        </h3>
                      </div>

                      <div className="border border-[#222222] bg-neutral-950/50 p-10 rounded-2xl relative overflow-hidden font-mono text-[11px] grid grid-cols-12 gap-6 items-center">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

                        <div className="col-span-4 space-y-4 z-10">
                          <div className="p-4 border border-[#222222] bg-black rounded-xl flex flex-col justify-between h-24">
                            <span className="text-neutral-500">01 // INGESTION</span>
                            <span className="font-bold text-[#F7F7F7]">{currentSlide.blueprintModules[0] || 'API Broker'}</span>
                          </div>
                          <div className="p-4 border border-[#222222] bg-black rounded-xl flex flex-col justify-between h-24">
                            <span className="text-neutral-500">02 // PIPELINE</span>
                            <span className="font-bold text-[#F7F7F7]">{currentSlide.blueprintModules[1] || 'Validation Kernel'}</span>
                          </div>
                        </div>

                        <div className="col-span-2 flex flex-col items-center justify-center space-y-8 z-10">
                          <span className="text-neutral-600 font-bold text-lg animate-pulse">&rarr;</span>
                          <span className="text-neutral-600 font-bold text-lg animate-pulse">&rarr;</span>
                        </div>

                        <div className="col-span-6 border-2 border-dashed border-neutral-800 p-6 bg-[#030303] rounded-xl z-10 space-y-4">
                          <div className="flex justify-between items-center text-neutral-400">
                            <span>CORE ENGINE STACK</span>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                          </div>

                          <div className="p-4 border bg-black rounded-lg flex items-center justify-between" style={{ borderColor: accentColor }}>
                            <span className="text-[#F7F7F7] font-bold">
                              {currentSlide.blueprintModules[2] || 'Durable Database'}
                            </span>
                            <span className="text-[10px] uppercase font-bold" style={{ color: accentColor }}>
                              SECURE NODE
                            </span>
                          </div>

                          {currentSlide.blueprintModules[3] && (
                            <div className="p-3 border border-[#222222] bg-black rounded-lg text-neutral-400">
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

                  {/* LAYOUT 08: CLOSING CTA */}
                  {currentSlide.layoutId === 'L08' && (
                    <div className="text-center space-y-12 animate-fadeIn max-w-[880px] mx-auto py-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-xl border flex items-center justify-center shadow-lg" style={{ borderColor: accentColor, backgroundColor: `${accentColor}12` }}>
                          <span className="text-base font-bold font-mono" style={{ color: accentColor }}>A</span>
                        </div>
                        <span className="font-['Space_Grotesk'] text-xl font-black tracking-widest text-[#F7F7F7]">
                          {footerOwner || 'APEX SYNC'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <p className="text-2xl text-neutral-300 leading-relaxed font-sans italic max-w-2xl mx-auto whitespace-pre-wrap">
                          "{currentSlide.quoteText}"
                        </p>
                        {currentSlide.quoteAuthor && (
                          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                            &mdash; {currentSlide.quoteAuthor}
                          </span>
                        )}
                      </div>

                      <div className="h-[1px] w-32 bg-neutral-800 mx-auto" />

                      <h3 
                        className="text-4xl font-black tracking-tight text-[#F7F7F7] leading-tight font-['Space_Grotesk']"
                        style={{ textShadow: `0 0 20px ${accentColor}20` }}
                      >
                        What system are you building today?
                      </h3>
                    </div>
                  )}

                </div>

                {/* ================= UNIVERSAL SLIDE FOOTER ================= */}
                <div className="w-full flex justify-between items-end border-t border-[#222222]/80 pt-6 font-mono text-[11px] text-neutral-500 uppercase tracking-wider shrink-0 z-10">
                  <div className="flex gap-6">
                    <span>OWNER: <strong className="text-neutral-300">{footerOwner}</strong></span>
                    <span>PRODUCTION: <strong className="text-neutral-300">{footerProduction}</strong></span>
                  </div>

                  <div className="flex gap-6 items-center">
                    <span>MONTH: <strong className="text-neutral-300">{footerMonth}</strong></span>
                    <span>WEB: <strong className="text-neutral-300" style={{ color: accentColor }}>{footerWebsite}</strong></span>
                    <span className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-bold text-[#F7F7F7]">
                      {String(activeSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom info bar */}
            <div className="text-[10px] text-neutral-500 font-mono mt-2">
              Resolution: 1200 × 1200 px &bull; Native 1:1 Aspect Ratio
            </div>
          </div>

          {/* RIGHT COLUMN: REFINED INSPECTOR & CONTENT CONTROLS */}
          <div className="w-96 border-l border-[#1F1F1F] bg-[#0C0C0C] flex flex-col h-full shrink-0 overflow-y-auto">
            
            {/* Inspector Tab Bar */}
            <div className="flex border-b border-[#1F1F1F] bg-[#080808] p-1.5 shrink-0">
              <button
                onClick={() => setActiveInspectorTab('content')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeInspectorTab === 'content' ? 'bg-[#181818] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Content</span>
              </button>
              <button
                onClick={() => setActiveInspectorTab('tokens')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeInspectorTab === 'tokens' ? 'bg-[#181818] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Pillar & Tags</span>
              </button>
              <button
                onClick={() => setActiveInspectorTab('metadata')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeInspectorTab === 'metadata' ? 'bg-[#181818] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global Footer</span>
              </button>
            </div>

            {/* Form Panels */}
            <div className="p-5 space-y-6">
              
              {/* TAB 1: SLIDE CONTENT */}
              {activeInspectorTab === 'content' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Layout Archetype Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Slide Layout Archetype
                    </label>
                    <select
                      value={currentSlide.layoutId}
                      onChange={(e) => {
                        const newLayout = e.target.value;
                        const defaults = createDefaultSlide(newLayout, activeSlideIndex);
                        handleUpdateActiveSlide({
                          ...currentSlide,
                          layoutId: newLayout,
                          headline: defaults.headline,
                          subtitle: defaults.subtitle,
                          quoteText: defaults.quoteText,
                          quoteAuthor: defaults.quoteAuthor,
                          compareLeftTitle: defaults.compareLeftTitle,
                          compareLeftItems: defaults.compareLeftItems,
                          compareRightTitle: defaults.compareRightTitle,
                          compareRightItems: defaults.compareRightItems,
                          frameworkNodes: defaults.frameworkNodes,
                          metricVal: defaults.metricVal,
                          metricLabel: defaults.metricLabel,
                          blueprintTitle: defaults.blueprintTitle,
                          blueprintModules: defaults.blueprintModules
                        });
                      }}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                    >
                      {LAYOUTS.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.id} — {l.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      {currentLayoutObj.description}
                    </p>
                  </div>

                  {/* Dynamic Inputs based on active layout */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                    
                    {/* Headline & Subtitle fields */}
                    {(currentSlide.layoutId === 'L01' || currentSlide.layoutId === 'L02' || currentSlide.layoutId === 'L04' || currentSlide.layoutId === 'L05' || currentSlide.layoutId === 'L06' || currentSlide.layoutId === 'L07') && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Headline / Title
                        </label>
                        <textarea
                          rows={2}
                          value={currentSlide.headline}
                          onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, headline: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                        />
                      </div>
                    )}

                    {(currentSlide.layoutId === 'L01' || currentSlide.layoutId === 'L02' || currentSlide.layoutId === 'L05' || currentSlide.layoutId === 'L06' || currentSlide.layoutId === 'L07') && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Subtext / Description
                        </label>
                        <textarea
                          rows={3}
                          value={currentSlide.subtitle}
                          onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, subtitle: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                        />
                      </div>
                    )}

                    {/* Quotation fields */}
                    {(currentSlide.layoutId === 'L03' || currentSlide.layoutId === 'L08') && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Quotation Passage
                          </label>
                          <textarea
                            rows={4}
                            value={currentSlide.quoteText}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, quoteText: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248] leading-normal"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Author / Attribution
                          </label>
                          <input
                            type="text"
                            value={currentSlide.quoteAuthor}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, quoteAuthor: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Comparison columns */}
                    {currentSlide.layoutId === 'L04' && (
                      <div className="space-y-4 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                            Left Column (Current State)
                          </label>
                          <input
                            type="text"
                            placeholder="Left Title"
                            value={currentSlide.compareLeftTitle}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, compareLeftTitle: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                          />
                          <textarea
                            rows={4}
                            placeholder="Bullet items (one per line)"
                            value={currentSlide.compareLeftItems?.join('\n')}
                            onChange={(e) => handleUpdateActiveSlide({
                              ...currentSlide,
                              compareLeftItems: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-neutral-300 font-mono leading-normal"
                          />
                        </div>

                        <div className="space-y-2 pt-3 border-t border-neutral-800">
                          <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: accentColor }}>
                            Right Column (Future State)
                          </label>
                          <input
                            type="text"
                            placeholder="Right Title"
                            value={currentSlide.compareRightTitle}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, compareRightTitle: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                          />
                          <textarea
                            rows={4}
                            placeholder="Bullet items (one per line)"
                            value={currentSlide.compareRightItems?.join('\n')}
                            onChange={(e) => handleUpdateActiveSlide({
                              ...currentSlide,
                              compareRightItems: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-neutral-300 font-mono leading-normal"
                          />
                        </div>
                      </div>
                    )}

                    {/* Framework Progression Nodes */}
                    {currentSlide.layoutId === 'L05' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Progression Nodes (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={currentSlide.frameworkNodes?.join('\n')}
                          onChange={(e) => handleUpdateActiveSlide({
                            ...currentSlide,
                            frameworkNodes: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                          })}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none leading-normal"
                        />
                      </div>
                    )}

                    {/* Metric statistics */}
                    {currentSlide.layoutId === 'L06' && (
                      <div className="space-y-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Metric Value (e.g. 98%, 10x, $4.2B)
                          </label>
                          <input
                            type="text"
                            value={currentSlide.metricVal}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, metricVal: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-base text-white font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Statement / Label
                          </label>
                          <textarea
                            rows={3}
                            value={currentSlide.metricLabel}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, metricLabel: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white leading-normal"
                          />
                        </div>
                      </div>
                    )}

                    {/* Blueprint Schematics */}
                    {currentSlide.layoutId === 'L07' && (
                      <div className="space-y-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Blueprint Header
                          </label>
                          <input
                            type="text"
                            value={currentSlide.blueprintTitle}
                            onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, blueprintTitle: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Box Nodes (One per line)
                          </label>
                          <textarea
                            rows={4}
                            value={currentSlide.blueprintModules?.join('\n')}
                            onChange={(e) => handleUpdateActiveSlide({
                              ...currentSlide,
                              blueprintModules: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full bg-black border border-neutral-800 rounded p-2 text-[11px] text-white font-mono leading-normal"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* TAB 2: PILLAR TOKENS & MICRO TAGS */}
              {activeInspectorTab === 'tokens' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Pillar Selection */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Enterprise Pillar Accent
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
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                              isSelected 
                                ? 'bg-black text-white' 
                                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:bg-neutral-900 hover:text-white'
                            }`}
                            style={{ borderColor: isSelected ? p.accentColor : 'transparent' }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
                              <span className="font-['Space_Grotesk']">{p.name}</span>
                            </div>
                            <span 
                              className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase"
                              style={{ 
                                backgroundColor: isSelected ? `${p.accentColor}20` : '#181818', 
                                color: isSelected ? p.accentColor : '#707070' 
                              }}
                            >
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Header Variables */}
                  <div className="border-t border-neutral-800/60 pt-5 space-y-3">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Sequence Counters
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-400 font-bold uppercase">Day Label</label>
                        <input
                          type="text"
                          value={dayCounter}
                          onChange={(e) => {
                            setDayCounter(e.target.value);
                            persistState(slides, activePillar, e.target.value, episodeCounter, seriesName);
                          }}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-400 font-bold uppercase">Episode Label</label>
                        <input
                          type="text"
                          value={episodeCounter}
                          onChange={(e) => {
                            setEpisodeCounter(e.target.value);
                            persistState(slides, activePillar, dayCounter, e.target.value, seriesName);
                          }}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Micro Tags */}
                  <div className="border-t border-neutral-800/60 pt-5 space-y-3">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Slide Micro Badges
                    </label>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-400 font-bold uppercase">Primary Top Badge</label>
                        <select
                          value={currentSlide.microTagLeft}
                          onChange={(e) => handleUpdateActiveSlide({ ...currentSlide, microTagLeft: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white"
                        >
                          {TINY_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: GLOBAL FOOTER & SERIES METADATA */}
              {activeInspectorTab === 'metadata' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Campaign Series Name
                    </label>
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

                  <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      Universal Footer Metadata
                    </span>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-400 font-bold uppercase">Owner Brand</label>
                        <input
                          type="text"
                          value={footerOwner}
                          onChange={(e) => setFooterOwner(e.target.value)}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-400 font-bold uppercase">Production Series</label>
                        <input
                          type="text"
                          value={footerProduction}
                          onChange={(e) => setFooterProduction(e.target.value)}
                          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Month Stamp</label>
                          <input
                            type="text"
                            value={footerMonth}
                            onChange={(e) => setFooterMonth(e.target.value)}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Website</label>
                          <input
                            type="text"
                            value={footerWebsite}
                            onChange={(e) => setFooterWebsite(e.target.value)}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C7A248]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
