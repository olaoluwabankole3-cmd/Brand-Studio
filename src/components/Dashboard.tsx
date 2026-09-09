/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Sparkles, 
  FileEdit, 
  Sliders, 
  Quote, 
  Binary, 
  TrendingUp, 
  UserSquare, 
  Compass,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { TemplateId } from '../types';
import { TEMPLATE_PRESETS } from '../data';

interface DashboardProps {
  onSelectTemplate: (id: TemplateId, autoGenerate: boolean) => void;
  onViewSlides?: () => void;
  exportCount: number;
}

export default function Dashboard({ onSelectTemplate, onViewSlides, exportCount }: DashboardProps) {
  // Product metrics are derived from actual application state.
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 17 ? 'Good Afternoon' :
    'Good Evening';

  const stats = [
    { label: 'Template Systems', value: TEMPLATE_PRESETS.length.toString(), change: 'Available design structures', isNeutral: true },
    { label: 'Recorded Exports', value: exportCount.toString(), change: exportCount === 1 ? '1 asset in this browser' : `${exportCount} assets in this browser`, isNeutral: true },
    { label: 'Design Modes', value: '2', change: 'Single-card + carousel', isNeutral: true },
    { label: 'Persistence', value: 'Local', change: 'Brand settings & export history', isNeutral: true },
  ];

  // Helper icons for the aesthetic representation of the miniature design structure
  const renderMiniaturePreview = (id: TemplateId) => {
    switch (id) {
      case 'enterprise-philosophy':
        return (
          <div className="w-full h-32 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-[#C7A248]/40 transition-colors">
            <div className="absolute top-2 right-2 opacity-10">
              <Quote className="w-12 h-12 text-[#C7A248]" />
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C7A248]" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-5/6 bg-neutral-200 rounded" />
              <div className="h-2 w-2/3 bg-neutral-200 rounded" />
            </div>
            <div className="flex justify-between items-center text-[8px] text-[#C7A248]/80 font-mono tracking-widest uppercase">
              <span>APEX SYNC</span>
              <span>EPISODE 01</span>
            </div>
          </div>
        );
      case 'enterprise-blueprint':
        return (
          <div className="w-full h-32 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex gap-2 relative overflow-hidden group-hover:border-[#C7A248]/40 transition-colors">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            {/* Left Diagram Miniature */}
            <div className="w-1/3 border border-[#222222] rounded p-1 flex flex-col justify-between relative bg-black/40 z-10">
              <div className="grid grid-cols-2 gap-1">
                <div className="h-1 bg-[#C7A248]/30 rounded" />
                <div className="h-1 bg-[#C7A248]/30 rounded" />
                <div className="h-1 bg-neutral-800 rounded col-span-2" />
              </div>
              <div className="flex justify-center my-1">
                <Binary className="w-6 h-6 text-[#C7A248]/60" />
              </div>
              <div className="h-1 w-full bg-neutral-800 rounded" />
            </div>

            {/* Right text */}
            <div className="flex-1 flex flex-col justify-between z-10">
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-neutral-300 rounded" />
                <div className="h-1.5 w-5/6 bg-neutral-300 rounded" />
                <div className="h-1 w-2/3 bg-neutral-500 rounded" />
              </div>
              <div className="h-1 w-1/2 bg-[#C7A248] rounded" />
            </div>
          </div>
        );
      case 'industry-spotlight':
        return (
          <div className="w-full h-32 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-[#C7A248]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div className="px-1.5 py-0.5 rounded bg-[#C7A248]/10 border border-[#C7A248]/30 text-[8px] text-[#C7A248] font-mono">
                SPOTLIGHT
              </div>
              <TrendingUp className="w-4.5 h-4.5 text-[#C7A248]" />
            </div>

            <div className="text-center my-1">
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">98.4%</span>
              <div className="h-1 w-12 bg-[#C7A248] mx-auto mt-1 rounded" />
            </div>

            <div className="space-y-0.5">
              <div className="h-1 w-3/4 bg-neutral-400 mx-auto rounded" />
              <div className="h-1 w-1/2 bg-neutral-500 mx-auto rounded" />
            </div>
          </div>
        );
      case 'building-apex':
        return (
          <div className="w-full h-32 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-[#C7A248]/40 transition-colors">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-neutral-800 border border-[#C7A248]/40 flex items-center justify-center">
                <UserSquare className="w-3.5 h-3.5 text-[#C7A248]" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 w-12 bg-white rounded" />
                <div className="h-1 w-8 bg-neutral-500 rounded" />
              </div>
            </div>

            <div className="border-l-2 border-[#C7A248] pl-2 py-0.5 my-1.5">
              <div className="space-y-1">
                <div className="h-1 w-full bg-neutral-300 rounded" />
                <div className="h-1 w-11/12 bg-neutral-300 rounded" />
                <div className="h-1 w-3/4 bg-neutral-400 rounded" />
              </div>
            </div>

            <div className="h-1.5 w-1/3 bg-[#C7A248]/20 rounded" />
          </div>
        );
      case 'enterprise-vision':
        return (
          <div className="w-full h-32 bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-[#C7A248]/40 transition-colors">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#C7A248]/5 blur-xl pointer-events-none" />
            
            <div className="flex justify-between">
              <Compass className="w-4 h-4 text-neutral-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C7A248] animate-ping" />
            </div>

            <div className="text-center my-1.5">
              <div className="h-2 w-4/5 bg-white mx-auto rounded mb-1" />
              <div className="h-2 w-3/5 bg-white mx-auto rounded" />
            </div>

            <div className="h-1 w-1/3 bg-[#C7A248] mx-auto rounded" />
          </div>
        );
    }
  };

  return (
    <div id="dashboard-tab" className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Greeting Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#111111] to-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C7A248]/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#C7A248] tracking-widest uppercase font-mono block">SYSTEM STATUS ACTIVE</span>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
            {greeting}, Olaoluwa
          </h1>
          <p className="text-neutral-400 text-sm max-w-md">
            Welcome back to Brand Studio. Build, edit, and orchestrate high-fidelity corporate brand assets on demand.
          </p>
        </div>

        <button 
          onClick={() => onSelectTemplate('enterprise-philosophy', false)}
          className="mt-6 md:mt-0 flex items-center gap-2 bg-[#C7A248] hover:bg-[#b08e3d] text-[#0A0A0A] px-5 py-3 rounded-lg text-xs font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(199,162,72,0.3)] shadow-lg"
        >
          <span>Launch Design Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex flex-col justify-between min-h-[110px]"
          >
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
              {stat.label}
            </span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white">
                {stat.value}
              </span>
            </div>
            <div className="text-[10px] text-[#C7A248]/90 font-mono">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Featured: The Apex Sync Slide System Banner */}
      <div className="bg-black border border-[#C7A248]/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(199,162,72,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C7A248]/10 border border-[#C7A248]/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7A248] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-[#C7A248] font-mono uppercase">
              NEW RELEASE
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight leading-none">
              The Apex Sync Slide System
            </h2>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Don't think of it as "making slides." Think of it as building an organizational Design Operating System.
            </p>
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed font-sans">
            Create high-fidelity presentation carousels following <strong>8 strict universal layouts</strong>. Experience unified typography and spacing tokens, synchronized headers/footers, and custom-tailored color accents representing individual series pillars.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-neutral-400 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[#C4A248] font-bold">&bull;</span>
              <span>8 Master Layouts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#3B82F6] font-bold">&bull;</span>
              <span>Fixed Header & Footer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-bold">&bull;</span>
              <span>5 Pillar Accents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8B5CF6] font-bold">&bull;</span>
              <span>Durable PDF Export</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onViewSlides}
          className="bg-neutral-900 border border-neutral-800 hover:border-[#C7A248]/40 text-[#F7F7F7] hover:text-white px-6 py-4 rounded-xl text-xs font-bold font-['Space_Grotesk'] tracking-wide transition-all shrink-0 w-full lg:w-auto hover:bg-black text-center"
        >
          Open Slide System &rarr;
        </button>
      </div>

      {/* Template Studio Header */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#C7A248]" />
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-wide">
            Enterprise Template Suites
          </h2>
        </div>
        <p className="text-neutral-400 text-xs">
          Select a structural layout below to load it into the editor canvas.
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_PRESETS.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#C7A248]/30 relative hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-4">
              {/* Miniature Layout Preview (Saves rendering space, looks incredible) */}
              {renderMiniaturePreview(tmpl.id)}

              <div className="space-y-1">
                <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white group-hover:text-[#C7A248] transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed min-h-[48px]">
                  {tmpl.description}
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-[#1F1F1F]/60">
              <button
                onClick={() => onSelectTemplate(tmpl.id, false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-neutral-800"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>
              
              <button
                onClick={() => onSelectTemplate(tmpl.id, true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C7A248]/10 hover:bg-[#C7A248]/20 text-[#C7A248] rounded-lg text-[11px] font-bold transition-colors border border-[#C7A248]/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Draft</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
