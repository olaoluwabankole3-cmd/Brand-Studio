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
  QrCode, 
  ToggleLeft, 
  ToggleRight, 
  Image as ImageIcon,
  Check,
  RefreshCw,
  Binary,
  TrendingUp,
  User,
  Compass,
  AlertCircle,
  Loader2,
  FileDown
} from 'lucide-react';
import { TemplateId, BackgroundId, BrandSettings, ExportHistoryItem } from '../types';
import { 
  TEMPLATE_PRESETS, 
  BACKGROUND_PRESETS, 
  SERIES_OPTIONS, 
  EPISODE_OPTIONS, 
  DAY_OPTIONS 
} from '../data';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface EditorProps {
  key?: string;
  initialTemplateId: TemplateId;
  autoGenerateOnLoad: boolean;
  brandSettings: BrandSettings;
  projectId: string;
  projectName: string;
  onProjectActivity: () => void;
  onAddExport: (item: ExportHistoryItem) => void;
}

export default function Editor({ 
  initialTemplateId, 
  autoGenerateOnLoad,
  brandSettings,
  projectId,
  projectName,
  onProjectActivity,
  onAddExport
}: EditorProps) {
  // Canvas settings state
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplateId);
  const [series, setSeries] = useState(SERIES_OPTIONS[0]);
  const [episode, setEpisode] = useState(EPISODE_OPTIONS[0]);
  const [day, setDay] = useState(DAY_OPTIONS[0]);
  const [headline, setHeadline] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [quote, setQuote] = useState('');
  const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const [footerLeft, setFooterLeft] = useState('Apex Sync');
  const [footerCenter, setFooterCenter] = useState('Enterprise Intelligence');
  const [footerRight, setFooterRight] = useState(currentMonthLabel);
  const [backgroundId, setBackgroundId] = useState<BackgroundId>('matte-black');
  
  // Brand toggle states
  const [showLogo, setShowLogo] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showDayCounter, setShowDayCounter] = useState(true);
  const [showEpisode, setShowEpisode] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showWebsite, setShowWebsite] = useState(true);

  // Typography custom sizing & position offsets
  const [headlineSize, setHeadlineSize] = useState<number>(54);
  const [headlineOffset, setHeadlineOffset] = useState<number>(0);
  const [headlineAlign, setHeadlineAlign] = useState<'left' | 'center' | 'right' | 'default'>('default');

  const [subtitleSize, setSubtitleSize] = useState<number>(24);
  const [subtitleOffset, setSubtitleOffset] = useState<number>(0);
  const [subtitleAlign, setSubtitleAlign] = useState<'left' | 'center' | 'right' | 'default'>('default');

  const [quoteSize, setQuoteSize] = useState<number>(18);
  const [quoteOffset, setQuoteOffset] = useState<number>(0);
  const [quoteAlign, setQuoteAlign] = useState<'left' | 'center' | 'right' | 'default'>('default');

  const [metaSize, setMetaSize] = useState<number>(11);
  const [metaOffset, setMetaOffset] = useState<number>(0);

  const [footerSize, setFooterSize] = useState<number>(14);
  const [footerOffset, setFooterOffset] = useState<number>(0);

  const [logoSize, setLogoSize] = useState<number>(280);
  const [logoOffset, setLogoOffset] = useState<number>(0);

  // AI and System state
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSource, setGenerationSource] = useState<'gemini-api' | 'local-preset' | 'local-fallback' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(0.4);
  const restoredTemplateRef = useRef<TemplateId | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const editorStorageKey = `apex_sync_project_${projectId}_editor_v1`;

  // Sync template defaults when the user intentionally changes templates.
  useEffect(() => {
    if (restoredTemplateRef.current) {
      if (restoredTemplateRef.current === templateId) {
        restoredTemplateRef.current = null;
        return;
      }
      restoredTemplateRef.current = null;
    }

    const selected = TEMPLATE_PRESETS.find(t => t.id === templateId);
    if (selected) {
      setHeadline(selected.defaultHeadline);
      setSubtitle(selected.defaultSubtitle);
      setQuote(selected.defaultQuote);
    }
    
    // Set default sizing based on template
    switch (templateId) {
      case 'enterprise-philosophy':
        setHeadlineSize(54);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'enterprise-blueprint':
        setHeadlineSize(36);
        setSubtitleSize(20);
        setQuoteSize(16);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'industry-spotlight':
        setHeadlineSize(52);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'building-apex':
        setHeadlineSize(42);
        setSubtitleSize(20);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'enterprise-vision':
        setHeadlineSize(60);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
    }
    
    // Reset positions and alignments when changing templates to keep default design layout clean
    setHeadlineOffset(0);
    setSubtitleOffset(0);
    setQuoteOffset(0);
    setMetaOffset(0);
    setFooterOffset(0);
    setLogoOffset(0);
    setLogoSize(280);
    
    setHeadlineAlign('default');
    setSubtitleAlign('default');
    setQuoteAlign('default');
  }, [templateId]);

  // Restore the most recent working draft from this browser.
  useEffect(() => {
    try {
      const scopedDraft = localStorage.getItem(editorStorageKey);
      const legacyDraft = localStorage.getItem('apex_sync_editor_draft_v2');
      const cachedDraft = scopedDraft || legacyDraft;

      if (cachedDraft) {
        const parsed = JSON.parse(cachedDraft);

        if (parsed.templateId && TEMPLATE_PRESETS.some(t => t.id === parsed.templateId)) {
          restoredTemplateRef.current = parsed.templateId as TemplateId;
          setTemplateId(parsed.templateId as TemplateId);
        }

        if (typeof parsed.series === 'string') setSeries(parsed.series);
        if (typeof parsed.episode === 'string') setEpisode(parsed.episode);
        if (typeof parsed.day === 'string') setDay(parsed.day);
        if (typeof parsed.headline === 'string') setHeadline(parsed.headline);
        if (typeof parsed.subtitle === 'string') setSubtitle(parsed.subtitle);
        if (typeof parsed.quote === 'string') setQuote(parsed.quote);
        if (typeof parsed.footerLeft === 'string') setFooterLeft(parsed.footerLeft);
        if (typeof parsed.footerCenter === 'string') setFooterCenter(parsed.footerCenter);
        if (typeof parsed.footerRight === 'string') setFooterRight(parsed.footerRight);
        if (typeof parsed.backgroundId === 'string') setBackgroundId(parsed.backgroundId as BackgroundId);

        if (typeof parsed.showLogo === 'boolean') setShowLogo(parsed.showLogo);
        if (typeof parsed.showFooter === 'boolean') setShowFooter(parsed.showFooter);
        if (typeof parsed.showDayCounter === 'boolean') setShowDayCounter(parsed.showDayCounter);
        if (typeof parsed.showEpisode === 'boolean') setShowEpisode(parsed.showEpisode);
        if (typeof parsed.showQrCode === 'boolean') setShowQrCode(parsed.showQrCode);
        if (typeof parsed.showWebsite === 'boolean') setShowWebsite(parsed.showWebsite);

        if (typeof parsed.headlineSize === 'number') setHeadlineSize(parsed.headlineSize);
        if (typeof parsed.headlineOffset === 'number') setHeadlineOffset(parsed.headlineOffset);
        if (typeof parsed.headlineAlign === 'string') setHeadlineAlign(parsed.headlineAlign);
        if (typeof parsed.subtitleSize === 'number') setSubtitleSize(parsed.subtitleSize);
        if (typeof parsed.subtitleOffset === 'number') setSubtitleOffset(parsed.subtitleOffset);
        if (typeof parsed.subtitleAlign === 'string') setSubtitleAlign(parsed.subtitleAlign);
        if (typeof parsed.quoteSize === 'number') setQuoteSize(parsed.quoteSize);
        if (typeof parsed.quoteOffset === 'number') setQuoteOffset(parsed.quoteOffset);
        if (typeof parsed.quoteAlign === 'string') setQuoteAlign(parsed.quoteAlign);
        if (typeof parsed.metaSize === 'number') setMetaSize(parsed.metaSize);
        if (typeof parsed.metaOffset === 'number') setMetaOffset(parsed.metaOffset);
        if (typeof parsed.footerSize === 'number') setFooterSize(parsed.footerSize);
        if (typeof parsed.footerOffset === 'number') setFooterOffset(parsed.footerOffset);
        if (typeof parsed.logoSize === 'number') setLogoSize(parsed.logoSize);
        if (typeof parsed.logoOffset === 'number') setLogoOffset(parsed.logoOffset);
      }
    } catch (err) {
      console.error('Failed to restore Brand Studio draft:', err);
    } finally {
      setDraftLoaded(true);
    }
  }, [editorStorageKey]);

  // Autosave editor state after hydration so navigation or refresh does not destroy work.
  useEffect(() => {
    if (!draftLoaded) return;

    try {
      localStorage.setItem(editorStorageKey, JSON.stringify({
        templateId,
        series,
        episode,
        day,
        headline,
        subtitle,
        quote,
        footerLeft,
        footerCenter,
        footerRight,
        backgroundId,
        showLogo,
        showFooter,
        showDayCounter,
        showEpisode,
        showQrCode,
        showWebsite,
        headlineSize,
        headlineOffset,
        headlineAlign,
        subtitleSize,
        subtitleOffset,
        subtitleAlign,
        quoteSize,
        quoteOffset,
        quoteAlign,
        metaSize,
        metaOffset,
        footerSize,
        footerOffset,
        logoSize,
        logoOffset
      }));
      onProjectActivity();
    } catch (err) {
      console.error('Failed to autosave Brand Studio draft:', err);
    }
  }, [
    draftLoaded,
    editorStorageKey,
    onProjectActivity,
    templateId,
    series,
    episode,
    day,
    headline,
    subtitle,
    quote,
    footerLeft,
    footerCenter,
    footerRight,
    backgroundId,
    showLogo,
    showFooter,
    showDayCounter,
    showEpisode,
    showQrCode,
    showWebsite,
    headlineSize,
    headlineOffset,
    headlineAlign,
    subtitleSize,
    subtitleOffset,
    subtitleAlign,
    quoteSize,
    quoteOffset,
    quoteAlign,
    metaSize,
    metaOffset,
    footerSize,
    footerOffset,
    logoSize,
    logoOffset
  ]);

  const handleResetSizing = () => {
    switch (templateId) {
      case 'enterprise-philosophy':
        setHeadlineSize(54);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'enterprise-blueprint':
        setHeadlineSize(36);
        setSubtitleSize(20);
        setQuoteSize(16);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'industry-spotlight':
        setHeadlineSize(52);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'building-apex':
        setHeadlineSize(42);
        setSubtitleSize(20);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
      case 'enterprise-vision':
        setHeadlineSize(60);
        setSubtitleSize(24);
        setQuoteSize(18);
        setMetaSize(11);
        setFooterSize(14);
        break;
    }
    setHeadlineOffset(0);
    setSubtitleOffset(0);
    setQuoteOffset(0);
    setMetaOffset(0);
    setFooterOffset(0);
    setLogoOffset(0);
    setLogoSize(280);
    
    setHeadlineAlign('default');
    setSubtitleAlign('default');
    setQuoteAlign('default');
  };

  const getAlignmentClass = (element: 'headline' | 'subtitle' | 'quote', userAlign: string) => {
    if (userAlign !== 'default') {
      if (userAlign === 'left') return 'text-left';
      if (userAlign === 'center') return 'text-center';
      if (userAlign === 'right') return 'text-right';
    }
    
    // Default alignments per template
    switch (templateId) {
      case 'enterprise-philosophy':
      case 'enterprise-blueprint':
      case 'building-apex':
        return 'text-left';
      case 'industry-spotlight':
      case 'enterprise-vision':
        return 'text-center';
    }
    return 'text-left';
  };

  // Handle auto-generation on dashboard trigger
  useEffect(() => {
    if (autoGenerateOnLoad) {
      handleGenerateCopy();
    }
  }, [autoGenerateOnLoad]);

  // Resize listener to perfectly fit the 1200x1200px editor inside the workspace
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // Keep 24px padding on sides
        const availableWidth = parentWidth - 48;
        const newScale = Math.min(availableWidth / 1200, 0.55);
        setCanvasScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // API Call to Gemini Backend
  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          series,
          episode,
          day,
          prompt: customPrompt,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const targetH = resData.data.headline;
        const targetS = resData.data.subtitle;
        const targetQ = resData.data.quote;

        setHeadline(targetH);
        setSubtitle(targetS);
        setQuote(targetQ);
        setGenerationSource(resData.data.source || 'gemini-api');
      }
    } catch (err) {
      console.error('Error contacting Gemini generator endpoint:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to trigger actual file download
  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  // Export as PNG, JPG, or SVG
  const handleExport = async (format: 'png' | 'jpg' | 'svg') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportSuccess(null);

    // Save parent transform to reset scaling temporarily (crucial for accurate html-to-image layout calculations)
    const parent = canvasRef.current.parentElement;
    const originalTransform = parent ? parent.style.transform : '';

    try {
      if (parent) {
        parent.style.transform = 'none';
      }

      // Ensure the canvas is fully drawn and fonts are loaded
      try {
        await document.fonts.ready;
      } catch (fontReadyErr) {
        console.warn('Font loading check timed out or failed, continuing...', fontReadyErr);
      }
      
      let dataUrl = '';
      const filename = `apex-sync-${templateId}-${day.toLowerCase().replace(' ', '-')}.${format}`;

      const exportOptions = {
        width: 1200,
        height: 1200,
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'none',
        }
      };

      try {
        if (format === 'png') {
          dataUrl = await toPng(canvasRef.current, exportOptions);
        } else if (format === 'jpg') {
          dataUrl = await toJpeg(canvasRef.current, { ...exportOptions, quality: 0.95 });
        } else if (format === 'svg') {
          dataUrl = await toSvg(canvasRef.current, { width: 1200, height: 1200, style: { transform: 'none' } });
        }
      } catch (firstErr) {
        console.warn("Standard export failed, attempting safe fallback (skipFonts: true)...", firstErr);
        // Fallback options to prevent CORS/iframe permission bugs
        const fallbackOptions = {
          ...exportOptions,
          pixelRatio: 1.5,
          skipFonts: true,
        };
        
        if (format === 'png') {
          dataUrl = await toPng(canvasRef.current, fallbackOptions);
        } else if (format === 'jpg') {
          dataUrl = await toJpeg(canvasRef.current, { ...fallbackOptions, quality: 0.95 });
        } else if (format === 'svg') {
          dataUrl = await toSvg(canvasRef.current, { width: 1200, height: 1200, skipFonts: true, style: { transform: 'none' } });
        }
      }

      if (dataUrl) {
        downloadFile(dataUrl, filename);
        
        // Add to export logs
        onAddExport({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          brandSnapshot: { ...brandSettings },
          projectId,
          projectName,
          templateId,
          templateName: TEMPLATE_PRESETS.find(t => t.id === templateId)?.name || 'Template',
          headline,
          format,
          resolution: '1200 x 1200 px',
          subtitle,
          quote,
          backgroundId,
          series,
          episode,
          day,
          showLogo,
          showFooter,
          showDayCounter,
          showEpisode,
          showQrCode,
          showWebsite,
          headlineSize,
          headlineOffset,
          headlineAlign,
          subtitleSize,
          subtitleOffset,
          subtitleAlign,
          quoteSize,
          quoteOffset,
          quoteAlign,
          metaSize,
          metaOffset,
          footerSize,
          footerOffset,
          logoSize,
          logoOffset,
        });

        setExportSuccess(`Success: Exported ${format.toUpperCase()}`);
        setTimeout(() => setExportSuccess(null), 3500);
      } else {
        throw new Error('No image data URL generated');
      }
    } catch (err: any) {
      console.error('Export error:', err);
      setExportSuccess(`Export failed: ${err.message || 'Unknown error'}`);
      setTimeout(() => setExportSuccess(null), 5000);
    } finally {
      if (parent) {
        parent.style.transform = originalTransform;
      }
      setIsExporting(false);
    }
  };

  // Copy PNG image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportSuccess(null);

    const parent = canvasRef.current.parentElement;
    const originalTransform = parent ? parent.style.transform : '';

    try {
      if (parent) {
        parent.style.transform = 'none';
      }

      try {
        await document.fonts.ready;
      } catch (fontReadyErr) {
        console.warn('Font check failed for clipboard copy, continuing...', fontReadyErr);
      }

      let blob: Blob | null = null;
      const exportOptions = { 
        width: 1200, 
        height: 1200, 
        pixelRatio: 1.5,
        cacheBust: true,
        style: {
          transform: 'none',
        }
      };

      try {
        const dataUrl = await toPng(canvasRef.current, exportOptions);
        blob = await fetch(dataUrl).then(r => r.blob());
      } catch (firstErr) {
        console.warn("Standard clipboard copy render failed, trying skipFonts...", firstErr);
        const dataUrl = await toPng(canvasRef.current, { ...exportOptions, skipFonts: true });
        blob = await fetch(dataUrl).then(r => r.blob());
      }

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        setExportSuccess('Succeeded: Copied PNG to Clipboard');
        setTimeout(() => setExportSuccess(null), 3500);
      } else {
        throw new Error('Blob generation failed');
      }
    } catch (err: any) {
      console.error('Copy to clipboard failed:', err);
      setExportSuccess('Clipboard write locked by iframe. Use Download PNG.');
      setTimeout(() => setExportSuccess(null), 4000);
    } finally {
      if (parent) {
        parent.style.transform = originalTransform;
      }
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setIsPdfExporting(true);
    setExportSuccess(null);

    const parent = canvasRef.current.parentElement;
    const originalTransform = parent ? parent.style.transform : '';

    try {
      if (parent) {
        parent.style.transform = 'none';
      }

      try {
        await document.fonts.ready;
      } catch (fontReadyErr) {
        console.warn('Font check failed for PDF, continuing...', fontReadyErr);
      }

      // Render the live canvas to high-res PNG
      const exportOptions = {
        width: 1200,
        height: 1200,
        pixelRatio: 1.5,
        cacheBust: true,
        style: {
          transform: 'none',
        }
      };

      let dataUrl = '';
      try {
        dataUrl = await toPng(canvasRef.current, exportOptions);
      } catch (firstErr) {
        console.warn("Standard PDF render capture failed, trying fallback...", firstErr);
        dataUrl = await toPng(canvasRef.current, {
          ...exportOptions,
          skipFonts: true,
        });
      }

      if (!dataUrl) {
        throw new Error("Failed to render high-resolution canvas image");
      }

      // Initialize PDF layout (A4 portrait)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const brand = brandSettings;
      
      // Hex to RGB parser for customized branding colors
      const hexToRgb = (hex: string) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 199, g: 162, b: 72 };
      };

      const accentRgb = hexToRgb(brand.accentColor);

      // 1. Top Decorative Banner
      doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.rect(0, 0, 210, 8, 'F');

      // 2. Report Header Block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 15, 15);
      doc.text("CREATIVE ASSET AUDIT REPORT", 15, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("GENERATED VIA APEX SYNC STUDIO CLIENT", 15, 27);

      const uniqueId = Math.random().toString(36).substr(2, 9);
      const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();

      // Unique Document Reference and Timestamp
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`DOC REF: ASX-${uniqueId.toUpperCase()}`, 195, 22, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(`ISSUED: ${timestampString.toUpperCase()}`, 195, 27, { align: 'right' });

      // Dividing Divider Line
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 31, 195, 31);

      // 3. Technical & Creative Specifications section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.text("1. BRANDING & ASSET SPECIFICATIONS", 15, 40);

      // Metadata Specifications grid (Left side)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text("CREATIVE METADATA", 15, 46);

      doc.setFillColor(248, 248, 248);
      doc.rect(15, 49, 85, 38, 'F');
      doc.setDrawColor(235, 235, 235);
      doc.rect(15, 49, 85, 38, 'S');

      doc.setTextColor(120, 120, 120);
      doc.text("Brand Channel:", 18, 54);
      doc.text("Watermark Spec:", 18, 60);
      doc.text("Series Title:", 18, 66);
      doc.text("Current Chrono:", 18, 72);
      doc.text("Active Episode:", 18, 78);
      doc.text("Export Format:", 18, 84);

      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(brand.socialHandle || "@APEXSYNC", 46, 54);
      doc.text(brand.watermarkText || "INTELLIGENT SYSTEM", 46, 60);
      doc.text(series || "Enterprise Philosophy Series", 46, 66);
      doc.text(day || "Day 01", 46, 72);
      doc.text(episode || "Episode 01", 46, 78);
      doc.text("PDF (PROFESSIONAL SPEC)", 46, 84);

      // Content Specifications box (Right side)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text("CREATIVE COPY & DIRECTIVES", 110, 46);

      doc.setFillColor(248, 248, 248);
      doc.rect(110, 49, 85, 38, 'F');
      doc.rect(110, 49, 85, 38, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(8);

      const headlineLines = doc.splitTextToSize(headline, 79);
      doc.text("HEADLINE:", 113, 54);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(50, 50, 50);
      let headlineY = 58;
      headlineLines.slice(0, 2).forEach((line: string) => {
        doc.text(line, 113, headlineY);
        headlineY += 3.5;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      doc.text("SUBTITLE / INSIGHT:", 113, 68);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      const subtitleLines = doc.splitTextToSize(subtitle, 79);
      let subtitleY = 72;
      subtitleLines.slice(0, 3).forEach((line: string) => {
        doc.text(line, 113, subtitleY);
        subtitleY += 3.2;
      });

      // 4. Section 2: Visual High-Res Preview render
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.text("2. HIGH-RESOLUTION RENDER PREVIEW", 15, 96);

      // Canvas Frame
      doc.setFillColor(245, 245, 245);
      doc.setDrawColor(225, 225, 225);
      doc.rect(15, 100, 180, 168, 'F');
      doc.rect(15, 100, 180, 168, 'S');

      // Add high-fidelity thumbnail render center
      doc.addImage(dataUrl, 'PNG', 30, 109, 150, 150);

      // Verification seal details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`VERIFIED RENDER SPECIFICATION: 1200 X 1200 PX  •  SECURE TRANSACTION ID: ${uniqueId}`, 20, 263);

      // 5. Page Footer
      doc.setDrawColor(230, 230, 230);
      doc.line(15, 276, 195, 276);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text("APEX SYNC STUDIO • CONFIDENTIAL SPECIFICATION DOCUMENT", 15, 282);
      doc.text("PAGE 1 OF 1", 195, 282, { align: 'right' });

      // Save PDF Document
      const pdfFilename = `apex-spec-${uniqueId}-${templateId}.pdf`;
      doc.save(pdfFilename);

      // Log export transaction
      onAddExport({
        id: uniqueId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        templateId,
        templateName: TEMPLATE_PRESETS.find(t => t.id === templateId)?.name || 'Template',
        headline,
        format: 'pdf',
        resolution: 'A4 Document',
        subtitle,
        quote,
        backgroundId,
        series,
        episode,
        day,
        showLogo,
        showFooter,
        showDayCounter,
        showEpisode,
        showQrCode,
        showWebsite,
        headlineSize,
        headlineOffset,
        headlineAlign,
        subtitleSize,
        subtitleOffset,
        subtitleAlign,
        quoteSize,
        quoteOffset,
        quoteAlign,
        metaSize,
        metaOffset,
        footerSize,
        footerOffset,
        logoSize,
        logoOffset,
      });

      setExportSuccess('Succeeded: Exported Design to PDF');
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setExportSuccess(`PDF Export failed: ${err.message || 'Unknown error'}`);
      setTimeout(() => setExportSuccess(null), 4000);
    } finally {
      if (parent) {
        parent.style.transform = originalTransform;
      }
      setIsPdfExporting(false);
    }
  };

  const activeBackgroundClass = BACKGROUND_PRESETS.find(b => b.id === backgroundId)?.class || 'bg-[#0A0A0A]';

  return (
    <div id="editor-tab" className="flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden">
      
      {/* LEFT SIDE: CONTROLS PANEL */}
      <div className="w-full lg:w-[480px] bg-[#0E0E0E] border-r border-[#1F1F1F] flex flex-col h-full overflow-y-auto">
        
        {/* Section Header */}
        <div className="p-6 border-b border-[#1F1F1F] space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#C7A248] tracking-widest uppercase font-mono">
            <Binary className="w-3.5 h-3.5" />
            <span>Creative Console</span>
          </div>
          <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white">System Configuration</h2>
        </div>

        {/* Optional drafting assistant */}
        <div className="p-6 border-b border-[#1F1F1F] bg-[#111111]/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C7A248]" />
              Draft Assistant
            </span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[#C7A248]/10 border border-[#C7A248]/20 text-[#C7A248] font-mono rounded">
              CONTENT ENGINE
            </span>
          </div>
          
          <div className="space-y-3">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. A contrarian view on standard corporate meetings, emphasizing asynchronous system alignment..."
              className="w-full h-20 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A248]/50 transition-colors resize-none font-sans"
            />
            
            <button
              onClick={handleGenerateCopy}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-[#C7A248]/10 hover:bg-[#C7A248]/20 disabled:bg-neutral-900 border border-[#C7A248]/30 disabled:border-neutral-800 text-[#C7A248] disabled:text-neutral-600 py-2.5 rounded-lg text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Intelligence...' : 'Generate Brand Copy'}</span>
            </button>

            {generationSource === 'local-fallback' && (
              <div className="text-[10px] text-[#C7A248] bg-[#C7A248]/5 border border-[#C7A248]/25 rounded-lg p-3 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7A248] animate-pulse shrink-0" />
                  <span>Draft Service Unavailable</span>
                </div>
                <p className="text-neutral-400 leading-relaxed font-sans">
                  The optional drafting service is currently unavailable. A local brand preset has been loaded so you can continue designing without interruption.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Standard Design Fields */}
        <div className="p-6 space-y-6">
          
          {/* Series Meta Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Series Campaign</label>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/40"
              >
                {SERIES_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                <option value="Custom Series">Custom Series</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Episode</label>
              <select
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/40"
              >
                {EPISODE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Sequence / Day</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/40"
              >
                {DAY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Template Layout System */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Layout Variation</label>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATE_PRESETS.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setTemplateId(tmpl.id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg border text-left transition-all ${
                    templateId === tmpl.id
                      ? 'bg-[#C7A248]/5 border-[#C7A248]/40 text-[#C7A248]'
                      : 'bg-[#0A0A0A] border-[#222222] hover:border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-['Space_Grotesk'] text-[11px] font-bold tracking-wide block">{tmpl.name}</span>
                    <span className="text-[9px] text-neutral-500 block leading-tight">{tmpl.description.substring(0, 50)}...</span>
                  </div>
                  {templateId === tmpl.id && <Check className="w-3.5 h-3.5 text-[#C7A248] shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Inputs */}
          <div className="space-y-4 pt-2 border-t border-[#1F1F1F]">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Display Headline</label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-['Space_Grotesk'] tracking-wide leading-normal resize-y"
                placeholder="The headline (Press Enter or Shift+Enter for new line)..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Subtext</label>
              <textarea
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 leading-normal resize-y"
                placeholder="The subtitle (Press Enter or Shift+Enter for new line)..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Quote Passage</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full h-24 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 resize-none leading-relaxed"
                placeholder="The quote text..."
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Footer L</label>
                <input
                  type="text"
                  value={footerLeft}
                  onChange={(e) => setFooterLeft(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-2.5 py-2 text-[10px] text-white focus:outline-none focus:border-[#C7A248]/40 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Footer C</label>
                <input
                  type="text"
                  value={footerCenter}
                  onChange={(e) => setFooterCenter(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-2.5 py-2 text-[10px] text-white focus:outline-none focus:border-[#C7A248]/40 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Footer R</label>
                <input
                  type="text"
                  value={footerRight}
                  onChange={(e) => setFooterRight(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-2.5 py-2 text-[10px] text-white focus:outline-none focus:border-[#C7A248]/40 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Layout Placement & Font Sizing Accordion-like Block */}
          <div className="space-y-4 pt-4 border-t border-[#1F1F1F]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#C7A248] uppercase tracking-widest flex items-center gap-1.5">
                Layout & Sizing Tuner
              </span>
              <button
                type="button"
                onClick={handleResetSizing}
                className="text-[9px] text-[#C7A248] hover:text-[#e5be5c] uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer transition-all active:scale-95 bg-[#C7A248]/5 hover:bg-[#C7A248]/10 px-2 py-1 rounded border border-[#C7A248]/10"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset Layout</span>
              </button>
            </div>

            <div className="space-y-4 bg-[#111111]/40 border border-[#1F1F1F] rounded-xl p-4.5">
              {/* HEADLINE CONTROLS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>HEADLINE</span>
                  <span className="font-mono text-neutral-500">{headlineSize}px • {headlineOffset > 0 ? `+${headlineOffset}` : headlineOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Size</span>
                    <input 
                      type="range" 
                      min="16" 
                      max="120" 
                      value={headlineSize}
                      onChange={(e) => setHeadlineSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={headlineOffset}
                      onChange={(e) => setHeadlineOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-neutral-500 uppercase font-semibold">Align:</span>
                  <div className="flex gap-1">
                    {['default', 'left', 'center', 'right'].map((align) => (
                      <button
                        type="button"
                        key={align}
                        onClick={() => setHeadlineAlign(align as any)}
                        className={`text-[9px] px-2 py-0.5 rounded font-mono border uppercase tracking-wider transition-all ${
                          headlineAlign === align 
                            ? 'bg-[#C7A248]/20 border-[#C7A248]/40 text-[#C7A248] font-bold' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SUBTEXT CONTROLS */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>SUBTEXT</span>
                  <span className="font-mono text-neutral-500">{subtitleSize}px • {subtitleOffset > 0 ? `+${subtitleOffset}` : subtitleOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Size</span>
                    <input 
                      type="range" 
                      min="12" 
                      max="80" 
                      value={subtitleSize}
                      onChange={(e) => setSubtitleSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={subtitleOffset}
                      onChange={(e) => setSubtitleOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-neutral-500 uppercase font-semibold">Align:</span>
                  <div className="flex gap-1">
                    {['default', 'left', 'center', 'right'].map((align) => (
                      <button
                        type="button"
                        key={align}
                        onClick={() => setSubtitleAlign(align as any)}
                        className={`text-[9px] px-2 py-0.5 rounded font-mono border uppercase tracking-wider transition-all ${
                          subtitleAlign === align 
                            ? 'bg-[#C7A248]/20 border-[#C7A248]/40 text-[#C7A248] font-bold' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUOTE CONTROLS */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>QUOTE PASSAGE</span>
                  <span className="font-mono text-neutral-500">{quoteSize}px • {quoteOffset > 0 ? `+${quoteOffset}` : quoteOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Size</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="60" 
                      value={quoteSize}
                      onChange={(e) => setQuoteSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={quoteOffset}
                      onChange={(e) => setQuoteOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-neutral-500 uppercase font-semibold">Align:</span>
                  <div className="flex gap-1">
                    {['default', 'left', 'center', 'right'].map((align) => (
                      <button
                        type="button"
                        key={align}
                        onClick={() => setQuoteAlign(align as any)}
                        className={`text-[9px] px-2 py-0.5 rounded font-mono border uppercase tracking-wider transition-all ${
                          quoteAlign === align 
                            ? 'bg-[#C7A248]/20 border-[#C7A248]/40 text-[#C7A248] font-bold' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CHRONICLE / METADATA CONTROLS */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>METADATA & CHRONICLE</span>
                  <span className="font-mono text-neutral-500">{metaSize}px • {metaOffset > 0 ? `+${metaOffset}` : metaOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Size</span>
                    <input 
                      type="range" 
                      min="8" 
                      max="32" 
                      value={metaSize}
                      onChange={(e) => setMetaSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={metaOffset}
                      onChange={(e) => setMetaOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* BRAND LOGO CONTROLS */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>BRAND LOGO</span>
                  <span className="font-mono text-neutral-500">{logoSize}px • {logoOffset > 0 ? `+${logoOffset}` : logoOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Logo Size</span>
                    <input 
                      type="range" 
                      min="80" 
                      max="600" 
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={logoOffset}
                      onChange={(e) => setLogoOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* LOWER FOOTER SYSTEM CONTROLS */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>FOOTER SYSTEM</span>
                  <span className="font-mono text-neutral-500">{footerSize}px • {footerOffset > 0 ? `+${footerOffset}` : footerOffset}px</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Text Size</span>
                    <input 
                      type="range" 
                      min="8" 
                      max="24" 
                      value={footerSize}
                      onChange={(e) => setFooterSize(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-neutral-500 block uppercase font-semibold">Y-Offset</span>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      value={footerOffset}
                      onChange={(e) => setFooterOffset(Number(e.target.value))}
                      className="w-full accent-[#C7A248] bg-[#0A0A0A] border border-[#222222] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Background Textures / Meshes */}
          <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Enterprise Canvas Canvas</label>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUND_PRESETS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundId(bg.id)}
                  className={`px-2 py-3 rounded-lg border text-center transition-all flex flex-col justify-between h-20 bg-[#0A0A0A] ${
                    backgroundId === bg.id
                      ? 'border-[#C7A248] text-[#C7A248]'
                      : 'border-[#222222] text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                  }`}
                >
                  <div className={`w-full h-6 rounded ${bg.class} border border-neutral-800`} />
                  <span className="text-[9px] font-medium block mt-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis w-full">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Element Toggles */}
          <div className="space-y-3 pt-2 border-t border-[#1F1F1F]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Brand Accessories</label>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Brand Logo', state: showLogo, setter: setShowLogo },
                { label: 'Lower Footer', state: showFooter, setter: setShowFooter },
                { label: 'Day Sequence', state: showDayCounter, setter: setShowDayCounter },
                { label: 'Episode Title', state: showEpisode, setter: setShowEpisode },
                { label: 'QR Scan Code', state: showQrCode, setter: setShowQrCode },
                { label: 'Web Handle', state: showWebsite, setter: setShowWebsite },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.setter(!item.state)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    item.state 
                      ? 'bg-neutral-900 border-[#C7A248]/20 text-[#C7A248]' 
                      : 'bg-[#0A0A0A] border-[#222222] text-neutral-500'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.state ? <ToggleRight className="w-5 h-5 text-[#C7A248]" /> : <ToggleLeft className="w-5 h-5 text-neutral-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Download Section */}
          <div className="pt-6 border-t border-[#1F1F1F] space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#C7A248] uppercase tracking-widest block mb-1">Quick Export</span>
              <span className="text-[11px] text-neutral-400">Instantly save your design as a high-resolution PNG image.</span>
            </div>
            
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting || isPdfExporting}
              className="w-full flex items-center justify-center gap-2 bg-[#C7A248] hover:bg-[#b08e3d] disabled:bg-neutral-800 text-[#0A0A0A] disabled:text-neutral-500 py-3 rounded-xl text-xs font-bold transition-all hover:shadow-[0_4px_12px_rgba(199,162,72,0.2)] cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PNG Image</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: LIVE DISPLAY & EXPORT SYSTEM */}
      <div 
        ref={containerRef} 
        className="flex-1 bg-[#050505] flex flex-col items-center justify-start lg:justify-center p-6 overflow-y-auto relative select-none"
      >
        {/* Background glow lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(199,162,72,0.03),transparent_40%)] pointer-events-none" />

        {/* Action Panel: Export Controls */}
        <div className="w-full max-w-[540px] mb-4 bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-4 flex flex-col gap-3 z-10 shrink-0">
          <div className="flex flex-col gap-3">
            
            {/* Row 1: Title and info */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neutral-500 tracking-widest font-mono uppercase">CANVAS FORMAT</span>
                <span className="text-xs font-bold text-white font-['Space_Grotesk']">LinkedIn Square (1200 x 1200 px)</span>
              </div>
              <span className="text-[10px] bg-[#C7A248]/10 text-[#C7A248] border border-[#C7A248]/20 px-2 py-0.5 rounded font-mono font-bold">READY TO EXPORT</span>
            </div>

            {/* Row 2: Standard standalone design image exports */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider font-mono">1. DOWNLOAD DESIGN ALONE (STANDALONE IMAGE)</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExport('png')}
                  disabled={isExporting || isPdfExporting}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 bg-[#C7A248] hover:bg-[#b08e3d] disabled:bg-neutral-800 text-[#0A0A0A] disabled:text-neutral-500 px-3.5 py-2 rounded-lg text-xs font-bold transition-all hover:shadow-[0_4px_12px_rgba(199,162,72,0.2)] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
                <button
                  onClick={() => handleExport('jpg')}
                  disabled={isExporting || isPdfExporting}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white disabled:text-neutral-500 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JPG</span>
                </button>
                <button
                  onClick={() => handleExport('svg')}
                  disabled={isExporting || isPdfExporting}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white disabled:text-neutral-500 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={handleCopyImage}
                  disabled={isExporting || isPdfExporting}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-800 border border-neutral-800 text-[#C7A248] border-[#C7A248]/20 disabled:text-neutral-500 px-3.5 py-2 rounded-lg text-xs font-bold transition-all hover:bg-[#C7A248]/10 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Image</span>
                </button>
              </div>
            </div>

            {/* Row 3: Corporate audit documentation spec PDF */}
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider font-mono">2. DOWNLOAD CORPORATE REPORT (PDF FORM)</span>
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isPdfExporting || isExporting}
                  className="w-full flex items-center justify-center gap-2 bg-[#C7A248]/10 hover:bg-[#C7A248]/20 disabled:bg-neutral-800 border border-[#C7A248]/30 text-[#C7A248] disabled:text-neutral-500 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {isPdfExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating corporate PDF audit report...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Export Corporate Spec Sheet (PDF)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 border-t border-neutral-900 pt-2">
            <span className="text-[#C7A248] font-bold animate-pulse">💡</span>
            <span>If direct downloads are blocked by browser iframe security, click <strong className="text-[#C7A248]">"Copy Image"</strong> or open the application in a new tab.</span>
          </div>
        </div>

        {/* Dynamic Toast Alerts */}
        <AnimatePresence>
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-24 bg-[#111111] border border-[#C7A248]/30 rounded-lg px-4 py-2.5 text-xs text-[#C7A248] font-mono shadow-2xl flex items-center gap-2 z-20"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{exportSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scaled Canvas Wrapper to prevent empty scrolling space */}
        <div 
          className="flex items-center justify-center overflow-hidden shrink-0"
          style={{
            width: `${1200 * canvasScale}px`,
            height: `${1200 * canvasScale}px`,
          }}
        >
          {/* 1200x1200px HIGH-FIDELITY DESIGN CANVAS CONTAINER */}
          <div 
            className="border border-[#222222]/80 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative bg-[#0A0A0A] shrink-0"
            style={{
              width: '1200px',
              height: '1200px',
              transform: `scale(${canvasScale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* EXPORT TARGET WRAPPER */}
            <div 
              ref={canvasRef} 
            className={`w-[1200px] h-[1200px] p-24 flex flex-col justify-between relative overflow-hidden select-none text-white ${activeBackgroundClass}`}
            style={{ fontFamily: brandSettings.fontFamily }}
          >
            {/* Background Grid Pattern for layout styles if digital grid is on */}
            {backgroundId === 'digital-grid' && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            )}

            {/* HEADER COMPONENT */}
            <div className="flex justify-between items-start w-full relative z-10">
              
              {/* BRAND LOGO */}
              {showLogo ? (
                <div className="flex items-center">
                  <div 
                    className="flex items-center justify-center rounded-2xl overflow-hidden shrink-0"
                    style={{ 
                      width: `${logoSize}px`,
                      height: `${logoSize}px`,
                      transform: `translateY(${logoOffset}px)`,
                      boxShadow: brandSettings.logoUrl ? 'none' : `0 0 40px ${brandSettings.accentColor}26`
                    }}
                  >
                    {brandSettings.logoUrl ? (
                      <img src={brandSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${brandSettings.accentColor}, ${brandSettings.primaryColor})` }}>
                        <span className="text-black font-extrabold text-7xl tracking-widest leading-none" style={{ fontFamily: brandSettings.fontFamily }}>
                          {brandSettings.socialHandle ? brandSettings.socialHandle.replace('@', '').charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : <div />}

              {/* DAY / SEQUENCE BOX */}
              {showDayCounter && (
                <div 
                  className="flex flex-col items-end"
                  style={{
                    transform: `translateY(${metaOffset}px)`,
                  }}
                >
                  <div className="px-4 py-2 text-right" style={{ borderRight: `4px solid ${brandSettings.accentColor}`, background: `linear-gradient(to left, ${brandSettings.accentColor}1a, transparent)` }}>
                    <span className="font-bold text-neutral-400 uppercase tracking-widest block font-mono" style={{ fontSize: `${metaSize}px` }}>CHRONICLE</span>
                    <span className="font-extrabold text-white tracking-widest block mt-0.5 uppercase" style={{ fontFamily: brandSettings.fontFamily, fontSize: `${metaSize * 1.8}px` }}>{day}</span>
                  </div>
                </div>
              )}
            </div>

            {/* MAIN CORE DYNAMIC LAYOUT AREA */}
            <div className="flex-1 flex items-center justify-center my-10 relative z-10 w-full">
              
              {/* VARIATION 1: ENTERPRISE PHILOSOPHY */}
              {templateId === 'enterprise-philosophy' && (
                <div className="w-full space-y-12 text-left relative px-10">
                  {/* Huge Decorative Quote Marks */}
                  <div className="absolute -top-16 -left-10 text-9xl font-serif leading-none pointer-events-none" style={{ color: `${brandSettings.accentColor}26` }}>“</div>
                  
                  {/* Episode Title Badge */}
                  {showEpisode && (
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: `${brandSettings.accentColor}1a`, 
                        border: `1px solid ${brandSettings.accentColor}4d`,
                        transform: `translateY(${metaOffset}px)`
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandSettings.accentColor }} />
                      <span className="font-bold uppercase tracking-widest font-mono" style={{ color: brandSettings.accentColor, fontSize: `${metaSize}px` }}>{episode}</span>
                    </div>
                  )}

                  {/* Headline */}
                  <h1 
                    className={`font-extrabold leading-[1.12] text-white tracking-tight max-w-5xl whitespace-pre-wrap ${getAlignmentClass('headline', headlineAlign)}`} 
                    style={{ 
                      fontFamily: brandSettings.fontFamily,
                      fontSize: `${headlineSize}px`,
                      transform: `translateY(${headlineOffset}px)`
                    }}
                  >
                    {headline}
                  </h1>

                  {/* Subtitle */}
                  <p 
                    className={`text-neutral-400 font-medium leading-relaxed max-w-3xl whitespace-pre-wrap ${getAlignmentClass('subtitle', subtitleAlign)}`}
                    style={{
                      fontSize: `${subtitleSize}px`,
                      transform: `translateY(${subtitleOffset}px)`
                    }}
                  >
                    {subtitle}
                  </p>

                  {/* Accent Divider */}
                  <div className="w-32 h-[3px] rounded" style={{ backgroundColor: brandSettings.accentColor }} />

                  {/* Detailed Executive Quote Block */}
                  <div className="border-l-4 border-neutral-800 pl-6 py-1">
                    <p 
                      className={`text-neutral-400 italic leading-relaxed max-w-2xl font-light whitespace-pre-wrap ${getAlignmentClass('quote', quoteAlign)}`}
                      style={{
                        fontSize: `${quoteSize}px`,
                        transform: `translateY(${quoteOffset}px)`
                      }}
                    >
                      "{quote}"
                    </p>
                  </div>
                </div>
              )}

              {/* VARIATION 2: ENTERPRISE BLUEPRINT */}
              {templateId === 'enterprise-blueprint' && (
                <div className="w-full flex gap-12 items-center px-6">
                  
                  {/* Left Abstract Architecture Flow Diagram */}
                  <div className="w-2/5 aspect-square border border-[#222222] bg-neutral-950/40 rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest font-mono">AUTOMATION BLUEPRINT</span>
                      <Binary className="w-5 h-5" style={{ color: brandSettings.accentColor }} />
                    </div>

                    {/* Highly aesthetic interactive programmatic lines layout inside preview */}
                    <div className="space-y-4 my-auto relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: brandSettings.accentColor }} />
                        <div className="h-1 flex-1 rounded animate-pulse" style={{ backgroundColor: `${brandSettings.accentColor}80` }} />
                        <span className="text-[9px] font-mono" style={{ color: brandSettings.accentColor }}>Node A</span>
                      </div>
                      <div className="pl-6 border-l border-dashed space-y-3" style={{ borderColor: `${brandSettings.accentColor}66` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                          <div className="h-0.5 bg-neutral-800 flex-1 rounded" />
                          <span className="text-[8px] font-mono text-neutral-500">Autonomous loop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: `${brandSettings.accentColor}99` }} />
                          <div className="h-0.5 bg-neutral-800 flex-1 rounded" />
                          <span className="text-[8px] font-mono text-neutral-500">Resource dispatch</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded bg-white shrink-0" />
                        <div className="h-1 bg-neutral-800 flex-1 rounded" />
                        <span className="text-[9px] font-mono text-neutral-400">System End</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-[8px] font-mono text-neutral-600 relative z-10">
                      <span>REF: MODEL_v1.09</span>
                      <span>SECURE STATE</span>
                    </div>
                  </div>

                  {/* Right Text Fields */}
                  <div className="flex-1 space-y-6 text-left">
                    {showEpisode && (
                      <span 
                        className="font-bold uppercase tracking-widest font-mono block" 
                        style={{ 
                          color: brandSettings.accentColor,
                          fontSize: `${metaSize}px`,
                          transform: `translateY(${metaOffset}px)`
                        }}
                      >
                        SYSTEM CONFIGURATION // {episode}
                      </span>
                    )}
                    
                    <h1 
                      className={`font-extrabold leading-[1.15] text-white tracking-tight whitespace-pre-wrap ${getAlignmentClass('headline', headlineAlign)}`} 
                      style={{ 
                        fontFamily: brandSettings.fontFamily,
                        fontSize: `${headlineSize}px`,
                        transform: `translateY(${headlineOffset}px)`
                      }}
                    >
                      {headline}
                    </h1>

                    <p 
                      className={`text-neutral-400 font-medium whitespace-pre-wrap ${getAlignmentClass('subtitle', subtitleAlign)}`}
                      style={{
                        fontSize: `${subtitleSize}px`,
                        transform: `translateY(${subtitleOffset}px)`
                      }}
                    >
                      {subtitle}
                    </p>

                    <p 
                      className={`italic leading-relaxed border-t border-neutral-900 pt-4 text-neutral-500 whitespace-pre-wrap ${getAlignmentClass('quote', quoteAlign)}`}
                      style={{
                        fontSize: `${quoteSize}px`,
                        transform: `translateY(${quoteOffset}px)`
                      }}
                    >
                      "{quote}"
                    </p>
                  </div>

                </div>
              )}

              {/* VARIATION 3: INDUSTRY SPOTLIGHT */}
              {templateId === 'industry-spotlight' && (
                <div className="w-full text-center space-y-8 px-12">
                  {showEpisode && (
                    <div 
                      className="inline-flex items-center gap-3 px-4 py-1.5 border rounded-full mb-2" 
                      style={{ 
                        backgroundColor: `${brandSettings.accentColor}1a`, 
                        borderColor: `${brandSettings.accentColor}4d`,
                        transform: `translateY(${metaOffset}px)`
                      }}
                    >
                      <TrendingUp className="w-4 h-4" style={{ color: brandSettings.accentColor }} />
                      <span className="font-extrabold uppercase tracking-widest font-mono" style={{ color: brandSettings.accentColor, fontSize: `${metaSize}px` }}>INDUSTRY DISRUPTIVE TREND // {episode}</span>
                    </div>
                  )}

                  <h1 
                    className={`font-black text-white leading-tight tracking-tight max-w-4xl mx-auto whitespace-pre-wrap ${getAlignmentClass('headline', headlineAlign)}`} 
                    style={{ 
                      fontFamily: brandSettings.fontFamily,
                      fontSize: `${headlineSize}px`,
                      transform: `translateY(${headlineOffset}px)`
                    }}
                  >
                    {headline}
                  </h1>

                  <p 
                    className={`text-neutral-400 font-medium max-w-3xl mx-auto whitespace-pre-wrap ${getAlignmentClass('subtitle', subtitleAlign)}`}
                    style={{
                      fontSize: `${subtitleSize}px`,
                      transform: `translateY(${subtitleOffset}px)`
                    }}
                  >
                    {subtitle}
                  </p>

                  {/* Giant Stats spotlight block */}
                  <div className="my-8 py-8 px-12 bg-neutral-950/60 border border-neutral-900 rounded-2xl max-w-xl mx-auto shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">MEASURED PLATFORM VELOCITY</span>
                    <span className="text-6xl font-black text-white tracking-wide block" style={{ fontFamily: brandSettings.fontFamily, background: `linear-gradient(to right, #ffffff, #ffffff, ${brandSettings.accentColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      10x OUTPUT
                    </span>
                    <span className="text-xs font-mono block mt-2" style={{ color: brandSettings.accentColor }}>Zero Added Human Coordination Layer</span>
                  </div>

                  <p 
                    className={`italic max-w-2xl mx-auto leading-relaxed text-neutral-500 whitespace-pre-wrap ${getAlignmentClass('quote', quoteAlign)}`}
                    style={{
                      fontSize: `${quoteSize}px`,
                      transform: `translateY(${quoteOffset}px)`
                    }}
                  >
                    "{quote}"
                  </p>
                </div>
              )}

              {/* VARIATION 4: BUILDING APEX */}
              {templateId === 'building-apex' && (
                <div className="w-full flex flex-col items-start text-left px-16 space-y-8">
                  {/* Founder Showcase Header */}
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-lg relative overflow-hidden" style={{ border: `2px solid ${brandSettings.accentColor}66` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <User className="w-8 h-8" style={{ color: brandSettings.accentColor }} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-lg font-bold text-white" style={{ fontFamily: brandSettings.fontFamily }}>Olaoluwa Bankole</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: brandSettings.accentColor }}>FOUNDER & CEO, APEX SYNC</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* High accent separator line */}
                  <div className="w-full h-[1px]" style={{ background: `linear-gradient(to right, ${brandSettings.accentColor}66, #262626, transparent)` }} />

                  <div className="space-y-4">
                    {showEpisode && (
                      <span 
                        className="font-mono tracking-widest block uppercase text-xs" 
                        style={{ 
                          color: brandSettings.accentColor,
                          fontSize: `${metaSize}px`,
                          transform: `translateY(${metaOffset}px)`
                        }}
                      >
                        // {series} — {episode}
                      </span>
                    )}
                    <h1 
                      className={`font-extrabold leading-tight tracking-tight text-white whitespace-pre-wrap ${getAlignmentClass('headline', headlineAlign)}`} 
                      style={{ 
                        fontFamily: brandSettings.fontFamily,
                        fontSize: `${headlineSize}px`,
                        transform: `translateY(${headlineOffset}px)`
                      }}
                    >
                      {headline}
                    </h1>
                    <p 
                      className={`text-neutral-400 font-semibold whitespace-pre-wrap ${getAlignmentClass('subtitle', subtitleAlign)}`}
                      style={{
                        fontSize: `${subtitleSize}px`,
                        transform: `translateY(${subtitleOffset}px)`
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>

                  {/* Narrative Body */}
                  <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-6 w-full shadow-md">
                    <p 
                      className={`leading-relaxed font-light italic text-neutral-400 whitespace-pre-wrap ${getAlignmentClass('quote', quoteAlign)}`}
                      style={{
                        fontSize: `${quoteSize}px`,
                        transform: `translateY(${quoteOffset}px)`
                      }}
                    >
                      "{quote}"
                    </p>
                  </div>
                </div>
              )}

              {/* VARIATION 5: ENTERPRISE VISION */}
              {templateId === 'enterprise-vision' && (
                <div className="w-full text-center space-y-10 relative">
                  {/* Glowing core sphere background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[90px] pointer-events-none" style={{ backgroundColor: `${brandSettings.accentColor}1a` }} />

                  <div className="space-y-2 relative z-10">
                    <Compass className="w-10 h-10 mx-auto mb-2 animate-pulse" style={{ color: brandSettings.accentColor }} />
                    {showEpisode && (
                      <span 
                        className="font-mono font-bold text-neutral-400 uppercase tracking-[0.3em] block"
                        style={{ 
                          fontSize: `${metaSize}px`,
                          transform: `translateY(${metaOffset}px)`
                        }}
                      >
                        {episode} // LONG-TERM ARCHITECTURE
                      </span>
                    )}
                  </div>

                  <h1 
                    className={`font-black text-white leading-tight tracking-tight uppercase max-w-4xl mx-auto relative z-10 whitespace-pre-wrap ${getAlignmentClass('headline', headlineAlign)}`} 
                    style={{ 
                      fontFamily: brandSettings.fontFamily,
                      fontSize: `${headlineSize}px`,
                      transform: `translateY(${headlineOffset}px)`
                    }}
                  >
                    {headline}
                  </h1>

                  <p 
                    className={`font-medium tracking-wide max-w-3xl mx-auto relative z-10 whitespace-pre-wrap ${getAlignmentClass('subtitle', subtitleAlign)}`} 
                    style={{ 
                      color: brandSettings.accentColor,
                      fontSize: `${subtitleSize}px`,
                      transform: `translateY(${subtitleOffset}px)`
                    }}
                  >
                    {subtitle}
                  </p>

                  <div className="max-w-2xl mx-auto border-t border-neutral-800/80 pt-6 relative z-10">
                    <p 
                      className={`leading-relaxed italic text-neutral-500 whitespace-pre-wrap ${getAlignmentClass('quote', quoteAlign)}`}
                      style={{
                        fontSize: `${quoteSize}px`,
                        transform: `translateY(${quoteOffset}px)`
                      }}
                    >
                      "{quote}"
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* LOWER FOOTER SYSTEM */}
            {showFooter ? (
              <div 
                className="flex justify-between items-center w-full border-t border-neutral-800/80 pt-10 relative z-10"
                style={{
                  transform: `translateY(${footerOffset}px)`,
                }}
              >
                
                {/* Footer Left */}
                <div className="flex flex-col text-left">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider font-mono" style={{ fontSize: `${footerSize * 0.7}px` }}>OWNER / DISPATCH</span>
                  <span className="font-semibold text-white mt-1 uppercase" style={{ fontFamily: brandSettings.fontFamily, fontSize: `${footerSize}px` }}>{footerLeft}</span>
                </div>

                {/* Footer Center */}
                <div className="flex flex-col text-center">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider font-mono" style={{ fontSize: `${footerSize * 0.7}px` }}>PRODUCTION SUITE</span>
                  <span className="font-semibold text-white mt-1" style={{ fontFamily: brandSettings.fontFamily, fontSize: `${footerSize}px` }}>{footerCenter}</span>
                </div>

                {/* Footer Right / Dynamic QR scan box */}
                <div className="flex items-center gap-4 text-right">
                  {showQrCode ? (
                    <div 
                      className="bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0"
                      style={{
                        width: `${footerSize * 3.4}px`,
                        height: `${footerSize * 3.4}px`,
                      }}
                    >
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  ) : <div />}

                  <div className="flex flex-col">
                    <span className="font-bold uppercase tracking-wider font-mono" style={{ color: brandSettings.accentColor, fontSize: `${footerSize * 0.7}px` }}>{footerRight}</span>
                    {showWebsite && (
                      <span className="font-medium text-neutral-400 mt-0.5" style={{ fontSize: `${footerSize * 0.8}px` }}>{brandSettings.website || 'apexsync.io/studio'}</span>
                    )}
                  </div>
                </div>

              </div>
            ) : <div />}

          </div>
        </div>
        </div>

      </div>

    </div>
  );
}
