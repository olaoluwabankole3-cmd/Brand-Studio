/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  FolderGit2, 
  Upload, 
  Check, 
  RefreshCw, 
  Palette, 
  Globe, 
  Mail, 
  Share2,
  FileText,
  Plus,
  Trash2,
  Layers3
} from 'lucide-react';
import { BrandSettings, BrandProfile } from '../types';

interface BrandAssetsProps {
  brandSettings: BrandSettings;
  brandProfiles: BrandProfile[];
  activeBrandId: string;
  onSelectBrand: (brandId: string) => void;
  onCreateBrand: () => void;
  onRenameActiveBrand: (name: string) => void;
  onDeleteActiveBrand: () => void;
  onUpdateBrandSettings: (settings: BrandSettings) => void;
}

export default function BrandAssets({
  brandSettings,
  brandProfiles,
  activeBrandId,
  onSelectBrand,
  onCreateBrand,
  onRenameActiveBrand,
  onDeleteActiveBrand,
  onUpdateBrandSettings
}: BrandAssetsProps) {
  const activeProfile = brandProfiles.find(profile => profile.id === activeBrandId) || brandProfiles[0];
  const [profileName, setProfileName] = useState(activeProfile?.name || 'Workspace');
  const [logoUrl, setLogoUrl] = useState(brandSettings.logoUrl);
  const [fontFamily, setFontFamily] = useState(brandSettings.fontFamily);
  const [primaryColor, setPrimaryColor] = useState(brandSettings.primaryColor);
  const [accentColor, setAccentColor] = useState(brandSettings.accentColor);
  const [watermarkText, setWatermarkText] = useState(brandSettings.watermarkText);
  const [socialHandle, setSocialHandle] = useState(brandSettings.socialHandle);
  const [website, setWebsite] = useState(brandSettings.website);
  const [email, setEmail] = useState(brandSettings.email);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const selectedProfile = brandProfiles.find(profile => profile.id === activeBrandId) || brandProfiles[0];
    setProfileName(selectedProfile?.name || 'Workspace');
    setLogoUrl(brandSettings.logoUrl);
    setFontFamily(brandSettings.fontFamily);
    setPrimaryColor(brandSettings.primaryColor);
    setAccentColor(brandSettings.accentColor);
    setWatermarkText(brandSettings.watermarkText);
    setSocialHandle(brandSettings.socialHandle);
    setWebsite(brandSettings.website);
    setEmail(brandSettings.email);
  }, [activeBrandId, brandSettings, brandProfiles]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onRenameActiveBrand(profileName);
    onUpdateBrandSettings({
      logoUrl,
      fontFamily,
      primaryColor,
      accentColor,
      watermarkText,
      socialHandle,
      website,
      email
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div id="brand-assets-tab" className="p-8 max-w-4xl mx-auto space-y-10">
      
      {/* Tab Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-[#C7A248]" />
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Brand Assets Library</h1>
        </div>
        <p className="text-neutral-400 text-xs">
          Configure default corporate identity parameters. These settings are dynamically bound into the Template Engine layouts.
        </p>
      </div>

      {/* Workspace Switcher */}
      <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C7A248]/10 border border-[#C7A248]/20 flex items-center justify-center">
              <Layers3 className="w-4 h-4 text-[#C7A248]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Brand Workspace</p>
              <p className="text-[10px] text-neutral-500">Switch between separate client or company brand kits.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCreateBrand}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C7A248]/10 border border-[#C7A248]/30 text-[#C7A248] text-xs font-semibold hover:bg-[#C7A248]/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Brand
            </button>
            <button
              type="button"
              onClick={onDeleteActiveBrand}
              disabled={brandProfiles.length <= 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs font-semibold hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Workspace</label>
            <select
              value={activeBrandId}
              onChange={(e) => onSelectBrand(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
            >
              {brandProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>{profile.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Workspace Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g. Apex Sync, Client A, Founder Brand"
              className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
            />
          </div>
        </div>
      </div>

      {/* Main Configurations Form */}
      <form onSubmit={handleSave} className="space-y-8 bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-8 shadow-xl">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Logo Upload Box */}
          <div className="space-y-3 col-span-1 md:col-span-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Corporate Brand Logo</label>
            <div className="flex items-center gap-6 p-6 bg-[#050505] border border-[#222222] rounded-xl">
              <div className="w-16 h-16 rounded-xl bg-[#C7A248]/10 border border-[#C7A248]/30 flex items-center justify-center font-['Space_Grotesk'] text-[#C7A248] text-xl font-black">
                {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : 'A'}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Paste brand logo URL..."
                  className="w-full bg-[#0E0E0E] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/40"
                />
                <span className="text-[10px] text-neutral-500 block">
                  Leave empty to utilize the premium built-in Apex Sync geometric corporate glyph.
                </span>
              </div>
            </div>
          </div>

          {/* Typeface Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Primary Display Typeface</label>
            <div className="relative">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-semibold"
              >
                <option value="Space Grotesk">Space Grotesk (Default display)</option>
                <option value="Inter">Inter (Clean modern/neutral)</option>
                <option value="system-ui">System UI default sans</option>
              </select>
            </div>
          </div>

          {/* Watermark Tag */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">System Security Watermark</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-semibold font-mono"
              placeholder="INTELLIGENT SYSTEM"
            />
          </div>

          {/* Social Handle */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Executive Social Handle</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-neutral-600 text-xs font-mono">@</span>
              <input
                type="text"
                value={socialHandle.replace('@', '')}
                onChange={(e) => setSocialHandle('@' + e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-semibold"
                placeholder="ApexSyncCorp"
              />
            </div>
          </div>

          {/* Website Link */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Corporate Domain Link</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-neutral-600 text-xs font-mono">https://</span>
              <input
                type="text"
                value={website.replace('https://', '').replace('http://', '')}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg pl-18 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-semibold"
                placeholder="apexsync.io/studio"
              />
            </div>
          </div>

          {/* Primary & Accent Color selectors */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Corporate Colors System</label>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Primary */}
              <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[#222222] rounded-xl">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase block leading-none">Matte</span>
                  <span className="text-xs text-white font-mono uppercase mt-1 leading-none">{primaryColor}</span>
                </div>
              </div>

              {/* Accent */}
              <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[#222222] rounded-xl">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase block leading-none">Premium Gold</span>
                  <span className="text-xs text-[#C7A248] font-mono uppercase mt-1 leading-none">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Communications Contact Email */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Communications Handle</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C7A248]/40 font-semibold"
              placeholder="studio@apexsync.io"
            />
          </div>

        </div>

        {/* Form CTA */}
        <div className="flex justify-end pt-4 border-t border-[#1F1F1F]">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#C7A248] hover:bg-[#b08e3d] text-[#0A0A0A] px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 shadow-md"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Default Presets Updated</span>
              </>
            ) : (
              <>
                <span>Commit Brand Presets</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
