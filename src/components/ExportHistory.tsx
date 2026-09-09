/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Download, 
  Check, 
  Calendar,
  Layers,
  FileCheck2,
  Binary,
  TrendingUp,
  User,
  Compass,
  QrCode,
  Loader2,
  FileDown,
  AlertTriangle
} from 'lucide-react';
import { ExportHistoryItem, BrandSettings } from '../types';
import { DEFAULT_BRAND_SETTINGS, BACKGROUND_PRESETS, TEMPLATE_PRESETS } from '../data';

interface ExportHistoryProps {
  exportsList: ExportHistoryItem[];
  onClearHistory: () => void;
  brandSettings?: BrandSettings;
}

function DesignThumbnail({ item, brandSettings }: { item: ExportHistoryItem, brandSettings?: BrandSettings }) {
  const brand = brandSettings || DEFAULT_BRAND_SETTINGS;
  
  // Resolve fields with fallbacks
  const templateId = item.templateId;
  const headline = item.headline;
  const subtitle = item.subtitle || TEMPLATE_PRESETS.find(t => t.id === templateId)?.defaultSubtitle || '';
  const quote = item.quote || TEMPLATE_PRESETS.find(t => t.id === templateId)?.defaultQuote || '';
  const backgroundId = item.backgroundId || (
    templateId === 'enterprise-blueprint' ? 'digital-grid' : 
    templateId === 'enterprise-vision' ? 'abstract-ai' : 'matte-black'
  );
  
  const series = item.series || 'Enterprise Philosophy Series';
  const episode = item.episode || 'Episode 01';
  const day = item.day || 'Day 01';
  
  const showLogo = item.showLogo !== false;
  const showFooter = item.showFooter !== false;
  const showDayCounter = item.showDayCounter !== false;
  const showEpisode = item.showEpisode !== false;
  const showQrCode = item.showQrCode !== false;
  const showWebsite = item.showWebsite !== false;
  
  const activeBackgroundClass = BACKGROUND_PRESETS.find(b => b.id === backgroundId)?.class || 'bg-[#0A0A0A]';

  // Sizing & Alignment configurations with fallbacks
  const logoSize = item.logoSize || 280;
  const logoOffset = item.logoOffset || 0;
  
  const headlineSize = item.headlineSize || 54;
  const headlineOffset = item.headlineOffset || 0;
  const headlineAlign = item.headlineAlign || 'left';
  
  const subtitleSize = item.subtitleSize || 24;
  const subtitleOffset = item.subtitleOffset || 0;
  const subtitleAlign = item.subtitleAlign || 'left';
  
  const quoteSize = item.quoteSize || 18;
  const quoteOffset = item.quoteOffset || 0;
  const quoteAlign = item.quoteAlign || 'left';
  
  const metaSize = item.metaSize || 11;
  const metaOffset = item.metaOffset || 0;
  
  const footerSize = item.footerSize || 14;
  const footerOffset = item.footerOffset || 0;

  const getAlignmentClass = (element: string, align: string | undefined) => {
    if (align === 'center') return 'text-center mx-auto';
    if (align === 'right') return 'text-right ml-auto';
    return 'text-left mr-auto';
  };

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-black rounded-lg border border-neutral-800 relative overflow-hidden shrink-0 select-none pointer-events-none shadow-md">
      {/* 1200x1200px HIGH-FIDELITY DESIGN CANVAS CONTAINER inside viewport */}
      <div 
        id={`thumbnail-canvas-${item.id}`}
        className={`w-[1200px] h-[1200px] p-24 flex flex-col justify-between absolute top-0 left-0 text-white ${activeBackgroundClass}`}
        style={{
          transform: 'scale(0.093333)',
          transformOrigin: 'top left',
          fontFamily: brand.fontFamily
        }}
      >
        {/* Background Grid Pattern if digital grid is on */}
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
                  boxShadow: brand.logoUrl ? 'none' : `0 0 40px ${brand.accentColor}26`
                }}
              >
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${brand.accentColor}, ${brand.primaryColor})` }}>
                    <span className="text-black font-extrabold text-7xl tracking-widest leading-none" style={{ fontFamily: brand.fontFamily }}>
                      {brand.socialHandle ? brand.socialHandle.replace('@', '').charAt(0).toUpperCase() : 'A'}
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
              <div className="px-4 py-2 text-right" style={{ borderRight: `4px solid ${brand.accentColor}`, background: `linear-gradient(to left, ${brand.accentColor}1a, transparent)` }}>
                <span className="font-bold text-neutral-400 uppercase tracking-widest block font-mono" style={{ fontSize: `${metaSize}px` }}>CHRONICLE</span>
                <span className="font-extrabold text-white tracking-widest block mt-0.5 uppercase" style={{ fontFamily: brand.fontFamily, fontSize: `${metaSize * 1.8}px` }}>{day}</span>
              </div>
            </div>
          )}
        </div>

        {/* MAIN CORE DYNAMIC LAYOUT AREA */}
        <div className="flex-1 flex items-center justify-center my-10 relative z-10 w-full">
          
          {/* VARIATION 1: ENTERPRISE PHILOSOPHY */}
          {templateId === 'enterprise-philosophy' && (
            <div className="w-full space-y-12 text-left relative px-10">
              <div className="absolute -top-16 -left-10 text-9xl font-serif leading-none pointer-events-none" style={{ color: `${brand.accentColor}26` }}>“</div>
              
              {showEpisode && (
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full" 
                  style={{ 
                    backgroundColor: `${brand.accentColor}1a`, 
                    border: `1px solid ${brand.accentColor}4d`,
                    transform: `translateY(${metaOffset}px)`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.accentColor }} />
                  <span className="font-bold uppercase tracking-widest font-mono" style={{ color: brand.accentColor, fontSize: `${metaSize}px` }}>{episode}</span>
                </div>
              )}

              <h1 
                className={`font-extrabold leading-[1.12] text-white tracking-tight max-w-5xl ${getAlignmentClass('headline', headlineAlign)}`} 
                style={{ 
                  fontFamily: brand.fontFamily,
                  fontSize: `${headlineSize}px`,
                  transform: `translateY(${headlineOffset}px)`
                }}
              >
                {headline}
              </h1>

              <p 
                className={`text-neutral-400 font-medium leading-relaxed max-w-3xl ${getAlignmentClass('subtitle', subtitleAlign)}`}
                style={{
                  fontSize: `${subtitleSize}px`,
                  transform: `translateY(${subtitleOffset}px)`
                }}
              >
                {subtitle}
              </p>

              <div className="w-32 h-[3px] rounded" style={{ backgroundColor: brand.accentColor }} />

              <div className="border-l-4 border-neutral-800 pl-6 py-1">
                <p 
                  className={`text-neutral-400 italic leading-relaxed max-w-2xl font-light ${getAlignmentClass('quote', quoteAlign)}`}
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
              <div className="w-2/5 aspect-square border border-[#222222] bg-neutral-950/40 rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest font-mono">AUTOMATION BLUEPRINT</span>
                  <Binary className="w-5 h-5" style={{ color: brand.accentColor }} />
                </div>

                <div className="space-y-4 my-auto relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: brand.accentColor }} />
                    <div className="h-1 flex-1 rounded" style={{ backgroundColor: `${brand.accentColor}80` }} />
                    <span className="text-[9px] font-mono" style={{ color: brand.accentColor }}>Node A</span>
                  </div>
                  <div className="pl-6 border-l border-dashed space-y-3" style={{ borderColor: `${brand.accentColor}66` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                      <div className="h-0.5 bg-neutral-800 flex-1 rounded" />
                      <span className="text-[8px] font-mono text-neutral-500">Autonomous loop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: `${brand.accentColor}99` }} />
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

              <div className="flex-1 space-y-6 text-left">
                {showEpisode && (
                  <span 
                    className="font-bold uppercase tracking-widest font-mono block" 
                    style={{ 
                      color: brand.accentColor,
                      fontSize: `${metaSize}px`,
                      transform: `translateY(${metaOffset}px)`
                    }}
                  >
                    SYSTEM CONFIGURATION // {episode}
                  </span>
                )}
                
                <h1 
                  className={`font-extrabold leading-[1.15] text-white tracking-tight ${getAlignmentClass('headline', headlineAlign)}`} 
                  style={{ 
                    fontFamily: brand.fontFamily,
                    fontSize: `${headlineSize}px`,
                    transform: `translateY(${headlineOffset}px)`
                  }}
                >
                  {headline}
                </h1>

                <p 
                  className={`text-neutral-400 font-medium ${getAlignmentClass('subtitle', subtitleAlign)}`}
                  style={{
                    fontSize: `${subtitleSize}px`,
                    transform: `translateY(${subtitleOffset}px)`
                  }}
                >
                  {subtitle}
                </p>

                <p 
                  className={`italic leading-relaxed border-t border-neutral-900 pt-4 text-neutral-500 ${getAlignmentClass('quote', quoteAlign)}`}
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
                    backgroundColor: `${brand.accentColor}1a`, 
                    borderColor: `${brand.accentColor}4d`,
                    transform: `translateY(${metaOffset}px)`
                  }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: brand.accentColor }} />
                  <span className="font-extrabold uppercase tracking-widest font-mono" style={{ color: brand.accentColor, fontSize: `${metaSize}px` }}>INDUSTRY DISRUPTIVE TREND // {episode}</span>
                </div>
              )}

              <h1 
                className={`font-black text-white leading-tight tracking-tight max-w-4xl mx-auto ${getAlignmentClass('headline', headlineAlign)}`} 
                style={{ 
                  fontFamily: brand.fontFamily,
                  fontSize: `${headlineSize}px`,
                  transform: `translateY(${headlineOffset}px)`
                }}
              >
                {headline}
              </h1>

              <p 
                className={`text-neutral-400 font-medium max-w-3xl mx-auto ${getAlignmentClass('subtitle', subtitleAlign)}`}
                style={{
                  fontSize: `${subtitleSize}px`,
                  transform: `translateY(${subtitleOffset}px)`
                }}
              >
                {subtitle}
              </p>

              <div className="my-8 py-8 px-12 bg-neutral-950/60 border border-neutral-900 rounded-2xl max-w-xl mx-auto shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">MEASURED PLATFORM VELOCITY</span>
                <span className="text-6xl font-black text-white tracking-wide block" style={{ fontFamily: brand.fontFamily, background: `linear-gradient(to right, #ffffff, #ffffff, ${brand.accentColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  10x OUTPUT
                </span>
                <span className="text-xs font-mono block mt-2" style={{ color: brand.accentColor }}>Zero Added Human Coordination Layer</span>
              </div>

              <p 
                className={`italic max-w-2xl mx-auto leading-relaxed text-neutral-500 ${getAlignmentClass('quote', quoteAlign)}`}
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
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-lg relative overflow-hidden" style={{ border: `2px solid ${brand.accentColor}66` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <User className="w-8 h-8" style={{ color: brand.accentColor }} />
                </div>
                <div className="space-y-1">
                  <span className="text-lg font-bold text-white" style={{ fontFamily: brand.fontFamily }}>Olaoluwa Bankole</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: brand.accentColor }}>FOUNDER & CEO, APEX SYNC</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px]" style={{ background: `linear-gradient(to right, ${brand.accentColor}66, #262626, transparent)` }} />

              <div className="space-y-4">
                {showEpisode && (
                  <span 
                    className="font-mono tracking-widest block uppercase text-xs" 
                    style={{ 
                      color: brand.accentColor,
                      fontSize: `${metaSize}px`,
                      transform: `translateY(${metaOffset}px)`
                    }}
                  >
                    // {series} — {episode}
                  </span>
                )}
                <h1 
                  className={`font-extrabold leading-tight tracking-tight text-white ${getAlignmentClass('headline', headlineAlign)}`} 
                  style={{ 
                    fontFamily: brand.fontFamily,
                    fontSize: `${headlineSize}px`,
                    transform: `translateY(${headlineOffset}px)`
                  }}
                >
                  {headline}
                </h1>
                <p 
                  className={`text-neutral-400 font-semibold ${getAlignmentClass('subtitle', subtitleAlign)}`}
                  style={{
                    fontSize: `${subtitleSize}px`,
                    transform: `translateY(${subtitleOffset}px)`
                  }}
                >
                  {subtitle}
                </p>
              </div>

              <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-6 w-full shadow-md">
                <p 
                  className={`leading-relaxed font-light italic text-neutral-400 ${getAlignmentClass('quote', quoteAlign)}`}
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[90px] pointer-events-none" style={{ backgroundColor: `${brand.accentColor}1a` }} />

              <div className="space-y-2 relative z-10">
                <Compass className="w-10 h-10 mx-auto mb-2" style={{ color: brand.accentColor }} />
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
                className={`font-black text-white leading-tight tracking-tight uppercase max-w-4xl mx-auto relative z-10 ${getAlignmentClass('headline', headlineAlign)}`} 
                style={{ 
                  fontFamily: brand.fontFamily,
                  fontSize: `${headlineSize}px`,
                  transform: `translateY(${headlineOffset}px)`
                }}
              >
                {headline}
              </h1>

              <p 
                className={`font-medium tracking-wide max-w-3xl mx-auto relative z-10 ${getAlignmentClass('subtitle', subtitleAlign)}`} 
                style={{ 
                  color: brand.accentColor,
                  fontSize: `${subtitleSize}px`,
                  transform: `translateY(${subtitleOffset}px)`
                }}
              >
                {subtitle}
              </p>

              <div className="max-w-2xl mx-auto border-t border-neutral-800/80 pt-6 relative z-10">
                <p 
                  className={`leading-relaxed italic text-neutral-500 ${getAlignmentClass('quote', quoteAlign)}`}
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
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">OWNER / DISPATCH</span>
              <span className="font-semibold text-white mt-1 uppercase" style={{ fontFamily: brand.fontFamily, fontSize: `${footerSize}px` }}>{brand.socialHandle ? brand.socialHandle.replace('@', '') : 'Apex Sync'}</span>
            </div>

            <div className="flex flex-col text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">PRODUCTION SUITE</span>
              <span className="font-semibold text-white mt-1" style={{ fontFamily: brand.fontFamily, fontSize: `${footerSize}px` }}>Enterprise Intelligence</span>
            </div>

            <div className="flex items-center gap-4 text-right">
              {showQrCode ? (
                <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                  <QrCode className="w-full h-full text-black" />
                </div>
              ) : <div />}

              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: brand.accentColor }}>{day}</span>
                {showWebsite && (
                  <span className="font-medium text-neutral-400 mt-0.5" style={{ fontSize: `${footerSize - 2}px` }}>{brand.website || 'apexsync.io/studio'}</span>
                )}
              </div>
            </div>
          </div>
        ) : <div />}

      </div>
    </div>
  );
}

export default function ExportHistory({ exportsList, onClearHistory, brandSettings }: ExportHistoryProps) {
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  
  const [exportingImgId, setExportingImgId] = useState<string | null>(null);
  const [successImgId, setSuccessImgId] = useState<string | null>(null);

  const handleExportImage = async (item: ExportHistoryItem) => {
    if (exportingImgId || exportingId) return;
    setExportingImgId(item.id);
    setErrorId(null);

    try {
      const element = document.getElementById(`thumbnail-canvas-${item.id}`);
      if (!element) {
        throw new Error("Visual design canvas element not found");
      }

      try {
        await document.fonts.ready;
      } catch (fontReadyErr) {
        console.warn('Font loading check timed out or failed, continuing...', fontReadyErr);
      }

      const exportOptions = {
        width: 1200,
        height: 1200,
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'none',
        }
      };

      let dataUrl = '';
      try {
        dataUrl = await toPng(element, exportOptions);
      } catch (firstErr) {
        console.warn("Standard image capture failed, attempting fallback...", firstErr);
        dataUrl = await toPng(element, {
          ...exportOptions,
          skipFonts: true,
        });
      }

      if (!dataUrl) {
        throw new Error("Failed to render high-resolution canvas image");
      }

      const filename = `apex-sync-${item.templateId}-${item.id}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      setSuccessImgId(item.id);
      setTimeout(() => setSuccessImgId(null), 3000);
    } catch (err: any) {
      console.error("Image generation failed:", err);
      setErrorId(item.id);
      setTimeout(() => setErrorId(null), 4000);
    } finally {
      setExportingImgId(null);
    }
  };

  const handleExportPDF = async (item: ExportHistoryItem) => {
    if (exportingId) return;
    setExportingId(item.id);
    setErrorId(null);

    try {
      const element = document.getElementById(`thumbnail-canvas-${item.id}`);
      if (!element) {
        throw new Error("Visual specification canvas element not found");
      }

      // Render the thumbnail to dynamic hi-res PNG
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
        dataUrl = await toPng(element, exportOptions);
      } catch (firstErr) {
        console.warn("Standard PDF thumbnail capture failed, trying fallback...", firstErr);
        dataUrl = await toPng(element, {
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

      const brand = brandSettings || DEFAULT_BRAND_SETTINGS;
      
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

      // Unique Document Reference and Timestamp
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`DOC REF: ASX-${item.id.toUpperCase()}`, 195, 22, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(`ISSUED: ${item.timestamp.toUpperCase()}`, 195, 27, { align: 'right' });

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
      doc.text(item.series || "Enterprise Philosophy Series", 46, 66);
      doc.text(item.day || "Day 01", 46, 72);
      doc.text(item.episode || "Episode 01", 46, 78);
      doc.text(`${item.format.toUpperCase()} (${item.resolution})`, 46, 84);

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

      const headlineLines = doc.splitTextToSize(item.headline, 79);
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
      const subtitleVal = item.subtitle || TEMPLATE_PRESETS.find(t => t.id === item.templateId)?.defaultSubtitle || "Enterprise structural optimization via autonomous automation loops.";
      const subtitleLines = doc.splitTextToSize(subtitleVal, 79);
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
      doc.text(`VERIFIED RENDER SPECIFICATION: 1200 X 1200 PX  •  SECURE TRANSACTION ID: ${item.id}`, 20, 263);

      // 5. Page Footer
      doc.setDrawColor(230, 230, 230);
      doc.line(15, 276, 195, 276);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text("APEX SYNC STUDIO • CONFIDENTIAL SPECIFICATION DOCUMENT", 15, 282);
      doc.text("PAGE 1 OF 1", 195, 282, { align: 'right' });

      // Save PDF Document
      const pdfFilename = `apex-spec-${item.id}-${item.templateId}.pdf`;
      doc.save(pdfFilename);

      setSuccessId(item.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setErrorId(item.id);
      setTimeout(() => setErrorId(null), 4000);
    } finally {
      setExportingId(null);
    }
  };

  // Generate programmatic mocks if empty
  const mockExports: ExportHistoryItem[] = [
    {
      id: 'mock-1',
      timestamp: 'Today, 02:44 PM',
      templateId: 'enterprise-philosophy',
      templateName: 'Enterprise Philosophy Layout',
      headline: "Companies Don't Scale Because They Hire More People",
      format: 'png',
      resolution: '1200 x 1200 px (LinkedIn)'
    },
    {
      id: 'mock-2',
      timestamp: 'Today, 11:15 AM',
      templateId: 'enterprise-blueprint',
      templateName: 'Enterprise Blueprint Layout',
      headline: 'Architecting the Autonomous State Machine',
      format: 'png',
      resolution: '1200 x 1200 px (LinkedIn)'
    },
    {
      id: 'mock-3',
      timestamp: 'Yesterday, 06:12 PM',
      templateId: 'industry-spotlight',
      templateName: 'Industry Spotlight Layout',
      headline: 'Autonomous Workflows are the New Standard Suite',
      format: 'jpg',
      resolution: '1200 x 1200 px (LinkedIn)'
    },
    {
      id: 'mock-4',
      timestamp: 'Yesterday, 04:30 PM',
      templateId: 'building-apex',
      templateName: 'Building Apex Layout',
      headline: 'A Culture of Execution, Not Consensus',
      format: 'svg',
      resolution: 'Vector Graphic Output'
    },
    {
      id: 'mock-5',
      timestamp: 'July 28, 2026',
      templateId: 'enterprise-vision',
      templateName: 'Enterprise Vision Layout',
      headline: 'The Sovereign Protocol Era is Arriving',
      format: 'png',
      resolution: '1200 x 1200 px (LinkedIn)'
    }
  ];

  const activeList = (exportsList && exportsList.length > 0) ? exportsList : mockExports;

  // Group items by timeframes
  const todayItems = activeList.filter(item => item.timestamp.includes('Today') || item.timestamp.includes(':'));
  const yesterdayItems = activeList.filter(item => item.timestamp.includes('Yesterday'));
  const olderItems = activeList.filter(item => !item.timestamp.includes('Today') && !item.timestamp.includes('Yesterday') && !item.timestamp.includes(':'));

  const renderSection = (title: string, items: ExportHistoryItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>{title}</span>
        </div>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all hover:border-[#C7A248]/30"
            >
              <div className="flex items-center gap-5 flex-1 min-w-0 w-full">
                {/* Miniature design canvas preview thumbnail */}
                <DesignThumbnail item={item} brandSettings={brandSettings} />

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono uppercase rounded">
                      {item.format.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#C7A248] font-mono tracking-wider font-semibold">
                      {item.templateName}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">• {item.timestamp}</span>
                  </div>
                  
                  <h3 className="text-sm font-semibold font-['Space_Grotesk'] text-white tracking-wide max-w-2xl leading-snug break-words">
                    "{item.headline}"
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right w-full md:w-auto justify-between md:justify-end border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col text-left md:text-right">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider font-mono">RESOLUTION</span>
                  <span className="text-[11px] text-neutral-300 font-medium font-mono mt-0.5">{item.resolution}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div 
                    className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-500"
                    title="Audit Log Verified"
                  >
                    <FileCheck2 className="w-4 h-4 text-[#C7A248]" />
                  </div>

                  {/* Standalone Image Download Option - just the design alone */}
                  <button
                    onClick={() => handleExportImage(item)}
                    disabled={exportingImgId !== null || exportingId !== null}
                    className={`group px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                      successImgId === item.id
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : errorId === item.id
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : exportingImgId === item.id
                        ? 'bg-[#C7A248]/10 text-[#C7A248] border-[#C7A248]/20 cursor-wait'
                        : 'bg-[#C7A248] hover:bg-[#b08d38] text-neutral-950 border-[#C7A248] cursor-pointer shadow-[0_4px_12px_rgba(199,162,72,0.15)] hover:shadow-[0_4px_16px_rgba(199,162,72,0.25)]'
                    }`}
                  >
                    {successImgId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>PNG Saved</span>
                      </>
                    ) : exportingImgId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Download PNG</span>
                      </>
                    )}
                  </button>

                  {/* Corporate PDF Audit Report Spec */}
                  <button
                    onClick={() => handleExportPDF(item)}
                    disabled={exportingImgId !== null || exportingId !== null}
                    className={`group px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                      successId === item.id
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : errorId === item.id
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : exportingId === item.id
                        ? 'bg-[#C7A248]/10 text-[#C7A248] border-[#C7A248]/20 cursor-wait'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 cursor-pointer'
                    }`}
                  >
                    {successId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>PDF Saved</span>
                      </>
                    ) : errorId === item.id ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                        <span>Failed</span>
                      </>
                    ) : exportingId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="export-history-tab" className="p-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#C7A248]" />
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Export Audit Logs</h1>
          </div>
          <p className="text-neutral-400 text-xs">
            Review history logs, resolution statistics, and metadata of prior content production cycles.
          </p>
        </div>

        {exportsList && exportsList.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-400 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {/* History Sections */}
      <div className="space-y-8">
        {activeList.length === 0 ? (
          <div className="text-center py-16 bg-[#0E0E0E] border border-dashed border-[#1F1F1F] rounded-2xl space-y-3">
            <History className="w-12 h-12 text-neutral-700 mx-auto" />
            <p className="text-neutral-500 text-sm">No export transactions registered in current browser state.</p>
          </div>
        ) : (
          <>
            {renderSection("Today's Exports", todayItems)}
            {renderSection("Yesterday", yesterdayItems)}
            {renderSection("This Week / Older", olderItems)}
          </>
        )}
      </div>

    </div>
  );
}
