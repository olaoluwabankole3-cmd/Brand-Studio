/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  LayoutDashboard,
  FolderKanban,
  Palette, 
  Copy, 
  FolderGit2, 
  History, 
  Settings, 
  Cpu, 
  Sparkles, 
  Presentation, 
  FileText, 
  Mail, 
  Calendar, 
  BarChart3, 
  Users 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const primaryNavigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'Projects', icon: FolderKanban },
    { id: 'slides', name: 'Slide System', icon: Presentation },
    { id: 'studio', name: 'Brand Studio', icon: Palette },
    { id: 'templates', name: 'Templates', icon: Copy },
    { id: 'assets', name: 'Brand Assets', icon: FolderGit2 },
    { id: 'exports', name: 'Exports', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const futureNavigation = [
    { name: 'Proposal Builder', icon: FileText },
    { name: 'Email Header Builder', icon: Mail },
    { name: 'Social Scheduler', icon: Calendar },
    { name: 'Draft Assistant', icon: Cpu },
    { name: 'Brand Analytics', icon: BarChart3 },
    { name: 'Team Collaboration', icon: Users },
  ];

  return (
    <aside 
      id="left-sidebar" 
      className="w-72 bg-[#0E0E0E] border-r border-[#1F1F1F] flex flex-col h-screen overflow-y-auto shrink-0 select-none"
    >
      {/* Brand Logo Section */}
      <div className="p-6 border-b border-[#1F1F1F] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C7A248] to-[#927129] flex items-center justify-center shadow-[0_0_15px_rgba(199,162,72,0.25)]">
          <span className="font-['Space_Grotesk'] text-[#0A0A0A] font-bold text-lg leading-none tracking-wider">A</span>
        </div>
        <div className="flex flex-col">
          <span className="font-['Space_Grotesk'] text-white font-semibold text-sm tracking-wide leading-tight">
            APEX SYNC
          </span>
          <span className="text-[10px] text-[#C7A248] font-medium tracking-widest leading-none uppercase mt-0.5">
            Brand Studio
          </span>
        </div>
      </div>

      {/* Main Active Navigation */}
      <div className="px-4 py-6 flex-1 space-y-7">
        <div>
          <span className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block mb-3">
            Core Engine
          </span>
          <nav className="space-y-1">
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 relative group ${
                    isActive 
                      ? 'text-[#C7A248]' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-indicator"
                      className="absolute inset-0 bg-[#C7A248]/5 border border-[#C7A248]/20 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-[#C7A248]' : 'text-neutral-400 group-hover:text-white'}`} />
                  <span className="font-['Space_Grotesk'] tracking-wide">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Future Modules Section (Coming Soon) */}
        <div>
          <span className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block mb-3">
            Enterprise expansion
          </span>
          <div className="space-y-1">
            {futureNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-neutral-500 cursor-not-allowed group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-neutral-600" />
                    <span className="font-['Space_Grotesk'] text-[11px] tracking-wide text-neutral-500">{item.name}</span>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-500 font-semibold uppercase rounded tracking-wider scale-90 opacity-70 group-hover:opacity-100 transition-opacity">
                    V2
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Block */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#0A0A0A] flex flex-col gap-1 text-[11px] text-neutral-500">
        <div className="flex justify-between items-center">
          <span className="font-medium text-neutral-400">Version 2.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-[10px] leading-tight text-neutral-600">
          Structured content production for brands, projects, and campaigns.
        </p>
      </div>
    </aside>
  );
}
