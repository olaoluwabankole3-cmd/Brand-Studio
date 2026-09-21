/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  FolderKanban,
  Palette,
  Copy,
  FolderGit2,
  History,
  Settings,
  Presentation,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sections = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
      { id: 'projects', name: 'Projects', icon: FolderKanban },
    ]
  },
  {
    label: 'Create',
    items: [
      { id: 'studio', name: 'Brand Studio', icon: Palette },
      { id: 'slides', name: 'Slide System', icon: Presentation },
      { id: 'templates', name: 'Templates', icon: Copy },
    ]
  },
  {
    label: 'Manage',
    items: [
      { id: 'assets', name: 'Brand Assets', icon: FolderGit2 },
      { id: 'exports', name: 'Exports', icon: History },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside
      id="left-sidebar"
      className="w-64 bg-[#0B0D10] border-r border-white/[0.06] flex flex-col h-screen overflow-y-auto shrink-0 select-none"
    >
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF5A] text-[#111318] flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,90,0.18)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white tracking-tight">
              Brand Studio
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
              by Apex Sync
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-5 flex-1 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-2 text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.16em]">
              {section.label}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${isActive
                      ? 'bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                      : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.035]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF5A]' : 'text-neutral-600'}`} />
                    <span>{item.name}</span>
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF5A]" />}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/[0.06]">
        <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-300">Workspace autosave</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[10px] leading-relaxed text-neutral-600 mt-1.5">
            Projects and drafts are saved to this browser.
          </p>
        </div>
      </div>
    </aside>
  );
}
