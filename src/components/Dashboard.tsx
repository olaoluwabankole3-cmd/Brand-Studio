/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  FileEdit,
  FolderKanban,
  Layers3,
  Presentation,
  Sparkles
} from 'lucide-react';
import { TemplateId } from '../types';
import { TEMPLATE_PRESETS } from '../data';

interface DashboardProps {
  onSelectTemplate: (id: TemplateId, autoGenerate: boolean) => void;
  onViewSlides?: () => void;
  onViewProjects: () => void;
  exportCount: number;
  activeProjectName: string | null;
  projectCount: number;
}

const previewAccent: Record<string, string> = {
  'enterprise-philosophy': 'from-amber-300/20 via-transparent to-transparent',
  'enterprise-blueprint': 'from-sky-400/20 via-transparent to-transparent',
  'industry-spotlight': 'from-emerald-400/20 via-transparent to-transparent',
  'building-apex': 'from-violet-400/20 via-transparent to-transparent',
  'enterprise-vision': 'from-rose-400/20 via-transparent to-transparent'
};

export default function Dashboard({
  onSelectTemplate,
  onViewSlides,
  onViewProjects,
  exportCount,
  activeProjectName,
  projectCount
}: DashboardProps) {
  const stats = [
    { label: 'Active projects', value: projectCount.toString(), detail: 'Organized workspaces' },
    { label: 'Exports', value: exportCount.toString(), detail: 'Assets in current project' },
    { label: 'Design systems', value: TEMPLATE_PRESETS.length.toString(), detail: 'Reusable template suites' }
  ];

  return (
    <div id="dashboard-tab" className="px-6 py-7 lg:px-10 lg:py-9 max-w-[1440px] mx-auto space-y-8">
      <section className="relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#101318] p-7 lg:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(212,175,90,0.10),transparent_62%)] pointer-events-none" />
        <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-7">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#E5C778]">
              <Sparkles className="w-3.5 h-3.5" />
              Content operations workspace
            </div>
            <h1 className="mt-5 max-w-2xl font-['Space_Grotesk'] text-3xl lg:text-[42px] leading-[1.08] tracking-[-0.03em] font-semibold text-white">
              Turn campaigns into repeatable design systems.
            </h1>
            <p className="mt-4 max-w-2xl text-sm lg:text-[15px] leading-7 text-neutral-400">
              Plan projects, build branded content, manage reusable visual systems, and export campaign-ready assets from one persistent workspace.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[12px] text-neutral-500">
              <FolderKanban className="w-4 h-4 text-[#D4AF5A]" />
              {activeProjectName
                ? <span>Current project: <strong className="text-neutral-300 font-medium">{activeProjectName}</strong></span>
                : <span>No project open yet — start by creating a workspace.</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onViewProjects}
              className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.035] text-[13px] font-semibold text-neutral-200 hover:bg-white/[0.06] transition-colors"
            >
              Manage projects
            </button>
            <button
              onClick={() => onSelectTemplate('enterprise-philosophy', false)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF5A] text-[#16181D] text-[13px] font-bold hover:bg-[#E0BD69] transition-colors shadow-[0_12px_30px_rgba(212,175,90,0.18)]"
            >
              {activeProjectName ? 'Open Brand Studio' : 'Choose a project'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/[0.06] bg-[#0E1115] p-5">
            <div className="text-[12px] font-medium text-neutral-500">{stat.label}</div>
            <div className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
            <div className="mt-2 text-[11px] text-neutral-600">{stat.detail}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[22px] border border-white/[0.06] bg-[#0E1115] p-6 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF5A]/10 border border-[#D4AF5A]/15 flex items-center justify-center shrink-0">
            <Presentation className="w-5 h-5 text-[#D4AF5A]" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-[#D4AF5A]">Slide System</div>
            <h2 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold text-white">
              Build consistent carousel and presentation assets.
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-neutral-500">
              Reuse structured layouts, brand tokens, headers, footers and export settings across an entire content series.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Reusable layouts', 'Brand tokens', 'Project-scoped drafts', 'PDF export'].map((item) => (
                <span key={item} className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-neutral-500">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onViewSlides}
          className="shrink-0 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.035] text-[13px] font-semibold text-neutral-200 hover:bg-white/[0.06] transition-colors"
        >
          Open Slide System
        </button>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-600">Template library</div>
            <h2 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-white">Choose a starting system</h2>
            <p className="mt-1.5 text-[13px] text-neutral-500">Each template can be configured manually or used to generate a structured first draft.</p>
          </div>
          <Layers3 className="w-5 h-5 text-neutral-700 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {TEMPLATE_PRESETS.map((tmpl) => (
            <article
              key={tmpl.id}
              className="group rounded-[20px] border border-white/[0.06] bg-[#0E1115] p-4 hover:border-[#D4AF5A]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`relative h-36 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#090B0E] bg-gradient-to-br ${previewAccent[tmpl.id] || ''}`}>
                <div className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04]" />
                    <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-600">Apex Sync</span>
                  </div>
                  <div>
                    <div className="h-2.5 w-4/5 rounded-full bg-white/80" />
                    <div className="mt-2 h-2.5 w-3/5 rounded-full bg-white/35" />
                    <div className="mt-4 h-1.5 w-16 rounded-full bg-[#D4AF5A]/70" />
                  </div>
                </div>
              </div>

              <div className="px-1 pt-4">
                <h3 className="font-['Space_Grotesk'] text-[15px] font-semibold text-neutral-100 group-hover:text-white">
                  {tmpl.name}
                </h3>
                <p className="mt-1.5 min-h-[44px] text-[12px] leading-5 text-neutral-500">
                  {tmpl.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectTemplate(tmpl.id, false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-neutral-300 hover:bg-white/[0.05] transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    Configure
                  </button>
                  <button
                    onClick={() => onSelectTemplate(tmpl.id, true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF5A]/18 bg-[#D4AF5A]/[0.07] px-3 py-2.5 text-[11px] font-semibold text-[#DDBE71] hover:bg-[#D4AF5A]/[0.11] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
