/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Settings as SettingsIcon, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Tv2, 
  Moon,
  Info
} from 'lucide-react';
import { TemplateId } from '../types';
import { TEMPLATE_PRESETS } from '../data';

interface SettingsProps {
  onResetApp: () => void;
}

export default function Settings({ onResetApp }: SettingsProps) {
  const [autoSave, setAutoSave] = useState(true);
  const [animations, setAnimations] = useState('smooth');
  const [defaultTemplate, setDefaultTemplate] = useState<TemplateId>('enterprise-philosophy');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="settings-tab" className="p-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#C7A248]" />
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">System Settings</h1>
        </div>
        <p className="text-neutral-400 text-xs">
          Optimize hardware render acceleration, local state triggers, and defaults.
        </p>
      </div>

      {/* Settings Panel */}
      <form onSubmit={handleSave} className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-8 space-y-8 shadow-xl">
        
        {/* Force Dark Mode Alert Info */}
        <div className="bg-[#C7A248]/5 border border-[#C7A248]/20 rounded-xl p-5 flex gap-4 items-start">
          <Moon className="w-5 h-5 text-[#C7A248] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-white font-['Space_Grotesk']">Forced Premium Dark Theme</span>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              In accordance with design blueprints, Apex Sync Brand Studio operates strictly in a calibrated Matte Black dark workspace. This prevents visual fatigue during extended branding sessions and ensures accurate contrast analysis.
            </p>
          </div>
        </div>

        {/* Configurations list */}
        <div className="space-y-6">
          
          {/* Theme selection */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-[#1F1F1F]/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white font-['Space_Grotesk']">Active Theme Mode</span>
              <p className="text-[11px] text-neutral-500">The global visual style of the application editor and dashboard.</p>
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                disabled 
                className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-600 rounded-lg text-xs font-semibold cursor-not-allowed"
              >
                Light Scheme
              </button>
              <button 
                type="button"
                className="px-4 py-2 bg-[#C7A248]/10 border border-[#C7A248]/40 text-[#C7A248] rounded-lg text-xs font-bold shadow-sm"
              >
                Lux Matte Dark (Active)
              </button>
            </div>
          </div>

          {/* Auto Save Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-[#1F1F1F]/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white font-['Space_Grotesk']">State Auto Save (LocalStorage)</span>
              <p className="text-[11px] text-neutral-500">Commits brand settings and active content changes automatically to browser cache.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoSave(!autoSave)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                autoSave 
                  ? 'bg-neutral-900 border-[#C7A248]/30 text-[#C7A248]' 
                  : 'bg-black border-neutral-800 text-neutral-500'
              }`}
            >
              {autoSave ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Animation Speeds */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-[#1F1F1F]/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white font-['Space_Grotesk']">Micro-Animations Orchestrator</span>
              <p className="text-[11px] text-neutral-500">Configures frame-velocity profiles of visual state and sidebar transitions.</p>
            </div>
            <div className="flex gap-2 bg-[#050505] p-1 border border-neutral-800 rounded-lg">
              {['classic', 'smooth'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setAnimations(style)}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold capitalize transition-all ${
                    animations === style
                      ? 'bg-[#C7A248] text-black shadow-md'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Default Startup Layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white font-['Space_Grotesk']">Startup Layout Default</span>
              <p className="text-[11px] text-neutral-500">Determines which visual structure loads first on entering the design console.</p>
            </div>
            <select
              value={defaultTemplate}
              onChange={(e) => setDefaultTemplate(e.target.value as TemplateId)}
              className="bg-[#050505] border border-[#222222] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/40"
            >
              {TEMPLATE_PRESETS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-[#1F1F1F]">
          <button
            type="button"
            onClick={onResetApp}
            className="text-xs text-rose-500 hover:text-rose-400 font-semibold"
          >
            Purge Local Cache & Reset Studio
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#C7A248] hover:bg-[#b08e3d] text-[#0A0A0A] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Preferences Enforced</span>
              </>
            ) : (
              <span>Commit Preferences</span>
            )}
          </button>
        </div>

      </form>

      {/* Security Info Badge Footer */}
      <div className="flex justify-center items-center gap-2 text-[10px] text-neutral-600 font-mono text-center">
        <ShieldCheck className="w-4 h-4 text-[#C7A248]/60" />
        <span>SECURE END-TO-END AUTOMATED STATE RETENTION // VERSION 1.0</span>
      </div>

    </div>
  );
}
