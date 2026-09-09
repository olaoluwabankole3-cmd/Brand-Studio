/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  UserSquare, 
  Globe, 
  ChevronRight,
  Database
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import CarouselBuilder from './components/CarouselBuilder';
import BrandAssets from './components/BrandAssets';
import ExportHistory from './components/ExportHistory';
import Settings from './components/Settings';

import { TemplateId, BrandSettings, BrandProfile, ExportHistoryItem } from './types';
import { DEFAULT_BRAND_SETTINGS, TEMPLATE_PRESETS } from './data';

const DEFAULT_PROFILE_ID = 'apex-sync';

const createDefaultBrandProfile = (): BrandProfile => ({
  id: DEFAULT_PROFILE_ID,
  name: 'Apex Sync',
  settings: { ...DEFAULT_BRAND_SETTINGS },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export default function App() {
  // Navigation Routing Tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Interactive templates state
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('enterprise-philosophy');
  const [autoGenerateTrigger, setAutoGenerateTrigger] = useState<boolean>(false);

  // Persistent User State
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([createDefaultBrandProfile()]);
  const [activeBrandId, setActiveBrandId] = useState<string>(DEFAULT_PROFILE_ID);
  const [exportsList, setExportsList] = useState<ExportHistoryItem[]>([]);

  const activeBrandProfile =
    brandProfiles.find(profile => profile.id === activeBrandId) || brandProfiles[0];
  const brandSettings: BrandSettings = activeBrandProfile?.settings || DEFAULT_BRAND_SETTINGS;

  // Load state from browser cache on initial boot
  useEffect(() => {
    try {
      const cachedProfiles = localStorage.getItem('apex_sync_brand_profiles_v2');
      const cachedActiveBrandId = localStorage.getItem('apex_sync_active_brand_v2');

      if (cachedProfiles) {
        const parsedProfiles = JSON.parse(cachedProfiles);
        if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0) {
          setBrandProfiles(parsedProfiles);
          const requestedActiveId = cachedActiveBrandId || parsedProfiles[0].id;
          const validActiveId = parsedProfiles.some((profile: BrandProfile) => profile.id === requestedActiveId)
            ? requestedActiveId
            : parsedProfiles[0].id;
          setActiveBrandId(validActiveId);
        }
      } else {
        // Migrate the original single-brand cache into the V2 workspace model.
        const cachedBrand = localStorage.getItem('apex_sync_brand_settings_v1');
        if (cachedBrand) {
          const parsed = JSON.parse(cachedBrand);
          if (parsed && typeof parsed === 'object') {
            const migratedProfile: BrandProfile = {
              ...createDefaultBrandProfile(),
              settings: { ...DEFAULT_BRAND_SETTINGS, ...parsed },
              updatedAt: new Date().toISOString()
            };
            setBrandProfiles([migratedProfile]);
            setActiveBrandId(migratedProfile.id);
            localStorage.setItem('apex_sync_brand_profiles_v2', JSON.stringify([migratedProfile]));
            localStorage.setItem('apex_sync_active_brand_v2', migratedProfile.id);
          }
        }
      }
    } catch (err) {
      console.error('Error hydrating brand workspaces from cache:', err);
    }

    try {
      const cachedExports = localStorage.getItem('apex_sync_exports_v1');
      if (cachedExports) {
        const parsed = JSON.parse(cachedExports);
        if (Array.isArray(parsed)) {
          setExportsList(parsed);
        } else {
          setExportsList([]);
        }
      }
    } catch (err) {
      console.error('Error hydrating exports list from cache:', err);
    }
  }, []);

  const persistBrandProfiles = (profiles: BrandProfile[], selectedBrandId: string) => {
    try {
      localStorage.setItem('apex_sync_brand_profiles_v2', JSON.stringify(profiles));
      localStorage.setItem('apex_sync_active_brand_v2', selectedBrandId);
    } catch (err) {
      console.error('Failed to commit brand workspaces:', err);
    }
  };

  // Save brand parameters inside the currently selected workspace.
  const handleUpdateBrandSettings = (newSettings: BrandSettings) => {
    const now = new Date().toISOString();
    const updatedProfiles = brandProfiles.map(profile =>
      profile.id === activeBrandId
        ? { ...profile, settings: newSettings, updatedAt: now }
        : profile
    );
    setBrandProfiles(updatedProfiles);
    persistBrandProfiles(updatedProfiles, activeBrandId);
  };

  const handleSelectBrand = (brandId: string) => {
    if (!brandProfiles.some(profile => profile.id === brandId)) return;
    setActiveBrandId(brandId);
    persistBrandProfiles(brandProfiles, brandId);
  };

  const handleCreateBrand = () => {
    const now = new Date().toISOString();
    const newProfile: BrandProfile = {
      id: `brand-${Date.now().toString(36)}`,
      name: `Brand ${brandProfiles.length + 1}`,
      settings: { ...brandSettings },
      createdAt: now,
      updatedAt: now
    };

    const updatedProfiles = [...brandProfiles, newProfile];
    setBrandProfiles(updatedProfiles);
    setActiveBrandId(newProfile.id);
    persistBrandProfiles(updatedProfiles, newProfile.id);
  };

  const handleRenameActiveBrand = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const updatedProfiles = brandProfiles.map(profile =>
      profile.id === activeBrandId
        ? { ...profile, name: cleanName, updatedAt: new Date().toISOString() }
        : profile
    );
    setBrandProfiles(updatedProfiles);
    persistBrandProfiles(updatedProfiles, activeBrandId);
  };

  const handleDeleteActiveBrand = () => {
    if (brandProfiles.length <= 1) return;

    const updatedProfiles = brandProfiles.filter(profile => profile.id !== activeBrandId);
    const nextActiveId = updatedProfiles[0].id;
    setBrandProfiles(updatedProfiles);
    setActiveBrandId(nextActiveId);
    persistBrandProfiles(updatedProfiles, nextActiveId);
  };

  // Log a new export transaction
  const handleAddExport = (newItem: ExportHistoryItem) => {
    const updatedList = [newItem, ...exportsList];
    setExportsList(updatedList);
    try {
      localStorage.setItem('apex_sync_exports_v1', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to log export transaction:', err);
    }
  };

  // Clear export transactions log
  const handleClearHistory = () => {
    setExportsList([]);
    try {
      localStorage.removeItem('apex_sync_exports_v1');
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  // Reset entire application back to defaults
  const handleResetApp = () => {
    const defaultProfile = createDefaultBrandProfile();
    setBrandProfiles([defaultProfile]);
    setActiveBrandId(defaultProfile.id);
    setExportsList([]);
    try {
      localStorage.removeItem('apex_sync_brand_settings_v1');
      localStorage.removeItem('apex_sync_brand_profiles_v2');
      localStorage.removeItem('apex_sync_active_brand_v2');
      localStorage.removeItem('apex_sync_exports_v1');
      localStorage.removeItem('apex_sync_editor_draft_v2');
      localStorage.removeItem('apex_carousel_slides_v1');
      localStorage.removeItem('apex_carousel_pillar_v1');
      localStorage.removeItem('apex_carousel_day_v1');
      localStorage.removeItem('apex_carousel_episode_v1');
      localStorage.removeItem('apex_carousel_series_v1');
      localStorage.removeItem('apex_carousel_workspace_v2');
      alert('Brand Studio workspace reset to system defaults.');
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to reset application state:', err);
    }
  };

  // Transition helper from card actions
  const handleSelectTemplate = (id: TemplateId, autoGenerate: boolean) => {
    setSelectedTemplateId(id);
    setAutoGenerateTrigger(autoGenerate);
    setActiveTab('studio');
  };

  // Render sub-view with smooth transitions
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onSelectTemplate={handleSelectTemplate} 
            onViewSlides={() => setActiveTab('slides')}
            exportCount={(exportsList || []).length}
          />
        );
      case 'studio':
        return (
          <Editor
            key={`${selectedTemplateId}-${autoGenerateTrigger ? 'auto' : 'manual'}`}
            initialTemplateId={selectedTemplateId}
            autoGenerateOnLoad={autoGenerateTrigger}
            brandSettings={brandSettings}
            onAddExport={handleAddExport}
          />
        );
      case 'slides':
        return (
          <CarouselBuilder
            brandSettings={brandSettings}
            onAddExport={handleAddExport}
          />
        );
      case 'templates':
        return (
          <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Visual Design Patterns</h1>
              <p className="text-neutral-400 text-xs">
                Browse and preview ready-made layout structures optimized for executive content production.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATE_PRESETS.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-6 space-y-4 hover:border-[#C7A248]/30 transition-all cursor-pointer"
                  onClick={() => handleSelectTemplate(tmpl.id, false)}
                >
                  <span className="text-[9px] font-bold text-[#C7A248] tracking-widest uppercase font-mono bg-[#C7A248]/10 px-2.5 py-1 rounded border border-[#C7A248]/20">
                    STRUCTURE {tmpl.id.replace('enterprise-', '').toUpperCase()}
                  </span>
                  
                  <div className="space-y-1">
                    <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white">{tmpl.name}</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed">{tmpl.description}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono pt-2 border-t border-[#1F1F1F]">
                    <span>1200 x 1200 optimized</span>
                    <span className="text-[#C7A248]">Load Layout &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'assets':
        return (
          <BrandAssets
            brandSettings={brandSettings}
            brandProfiles={brandProfiles}
            activeBrandId={activeBrandId}
            onSelectBrand={handleSelectBrand}
            onCreateBrand={handleCreateBrand}
            onRenameActiveBrand={handleRenameActiveBrand}
            onDeleteActiveBrand={handleDeleteActiveBrand}
            onUpdateBrandSettings={handleUpdateBrandSettings}
          />
        );
      case 'exports':
        return (
          <ExportHistory 
            exportsList={exportsList} 
            onClearHistory={handleClearHistory}
            brandSettings={brandSettings}
          />
        );
      case 'settings':
        return (
          <Settings 
            onResetApp={handleResetApp} 
          />
        );
      default:
        return <div className="p-8 text-neutral-400">Section not found.</div>;
    }
  };

  return (
    <div id="apex-app-shell" className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
      
      {/* LEFT STATIC SIDEBAR NAVIGATION */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* RIGHT MAIN WORKSPACE FRAME */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Workspace Top Bar (Header Panel) */}
        <header className="h-[64px] border-b border-[#1F1F1F] px-8 flex items-center justify-between bg-[#0E0E0E] shrink-0 select-none">
          
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-500 font-mono tracking-wider uppercase">STUDIO WORKSPACE</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-xs font-semibold text-neutral-300 capitalize font-['Space_Grotesk'] tracking-wide">
              {activeTab === 'studio' ? 'Design Engine' : activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Connected state & Profile indicators */}
          <div className="flex items-center gap-6">
            
            {/* Workspace status */}
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#C7A248]" />
              <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest hidden md:inline">
                WORKSPACE READY
              </span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-neutral-800 pl-4">
              <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                {activeBrandProfile?.name || 'Workspace'}
              </span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C7A248] to-[#927129] flex items-center justify-center font-bold text-black text-xs">
                {(activeBrandProfile?.name || 'W').charAt(0).toUpperCase()}
              </div>
            </div>

          </div>

        </header>

        {/* Dynamic sub-view viewport */}
        <main className="flex-1 overflow-y-auto bg-[#070707]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}
