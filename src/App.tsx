/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
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
import Projects from './components/Projects';

import { TemplateId, BrandSettings, BrandProfile, ExportHistoryItem, StudioProject } from './types';
import { DEFAULT_BRAND_SETTINGS, TEMPLATE_PRESETS } from './data';

const DEFAULT_PROFILE_ID = 'apex-sync';
const DEFAULT_PROJECT_ID = 'apex-enterprise-intelligence';

const PROJECT_STORAGE_SUFFIXES = [
  'editor_v1',
  'carousel_slides_v1',
  'carousel_pillar_v1',
  'carousel_day_v1',
  'carousel_episode_v1',
  'carousel_series_v1',
  'carousel_workspace_v1'
];

const projectStorageKey = (projectId: string, suffix: string) =>
  `apex_sync_project_${projectId}_${suffix}`;

const createDefaultBrandProfile = (): BrandProfile => ({
  id: DEFAULT_PROFILE_ID,
  name: 'Apex Sync',
  settings: { ...DEFAULT_BRAND_SETTINGS },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const createDefaultProject = (): StudioProject => {
  const now = new Date().toISOString();
  return {
    id: DEFAULT_PROJECT_ID,
    brandId: DEFAULT_PROFILE_ID,
    name: 'Enterprise Intelligence Series',
    campaignName: 'Enterprise Intelligence',
    description: 'Primary thought-leadership publishing workspace for Apex Sync.',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now
  };
};

export default function App() {
  // Navigation Routing Tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Interactive templates state
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('enterprise-philosophy');
  const [autoGenerateTrigger, setAutoGenerateTrigger] = useState<boolean>(false);

  // Persistent User State
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([createDefaultBrandProfile()]);
  const [activeBrandId, setActiveBrandId] = useState<string>(DEFAULT_PROFILE_ID);
  const [projects, setProjects] = useState<StudioProject[]>([createDefaultProject()]);
  const [activeProjectByBrand, setActiveProjectByBrand] = useState<Record<string, string>>({
    [DEFAULT_PROFILE_ID]: DEFAULT_PROJECT_ID
  });
  const [exportsList, setExportsList] = useState<ExportHistoryItem[]>([]);

  const activeBrandProfile =
    brandProfiles.find(profile => profile.id === activeBrandId) || brandProfiles[0];
  const brandSettings: BrandSettings = activeBrandProfile?.settings || DEFAULT_BRAND_SETTINGS;
  const activeProjectId = activeProjectByBrand[activeBrandId] || null;
  const activeProject =
    projects.find(project => project.id === activeProjectId && project.brandId === activeBrandId) || null;
  const activeBrandProjects = projects.filter(project => project.brandId === activeBrandId);

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
      const cachedProjects = localStorage.getItem('apex_sync_projects_v3');
      const cachedActiveProjects = localStorage.getItem('apex_sync_active_projects_v3');

      if (cachedProjects) {
        const parsedProjects = JSON.parse(cachedProjects);
        if (Array.isArray(parsedProjects)) {
          setProjects(parsedProjects);
        }
      } else {
        const defaultProject = createDefaultProject();
        setProjects([defaultProject]);
        localStorage.setItem('apex_sync_projects_v3', JSON.stringify([defaultProject]));
      }

      if (cachedActiveProjects) {
        const parsedActiveProjects = JSON.parse(cachedActiveProjects);
        if (parsedActiveProjects && typeof parsedActiveProjects === 'object') {
          setActiveProjectByBrand(parsedActiveProjects);
        }
      } else {
        const defaultMap = { [DEFAULT_PROFILE_ID]: DEFAULT_PROJECT_ID };
        setActiveProjectByBrand(defaultMap);
        localStorage.setItem('apex_sync_active_projects_v3', JSON.stringify(defaultMap));
      }
    } catch (err) {
      console.error('Error hydrating projects from cache:', err);
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

  const persistProjects = (nextProjects: StudioProject[], activeMap: Record<string, string>) => {
    try {
      localStorage.setItem('apex_sync_projects_v3', JSON.stringify(nextProjects));
      localStorage.setItem('apex_sync_active_projects_v3', JSON.stringify(activeMap));
    } catch (err) {
      console.error('Failed to commit project workspaces:', err);
    }
  };

  const copyProjectStorage = (sourceProjectId: string, targetProjectId: string) => {
    PROJECT_STORAGE_SUFFIXES.forEach(suffix => {
      const sourceValue = localStorage.getItem(projectStorageKey(sourceProjectId, suffix));
      if (sourceValue !== null) {
        localStorage.setItem(projectStorageKey(targetProjectId, suffix), sourceValue);
      }
    });
  };

  const clearProjectStorage = (projectId: string) => {
    PROJECT_STORAGE_SUFFIXES.forEach(suffix => {
      localStorage.removeItem(projectStorageKey(projectId, suffix));
    });
  };

  // Save brand parameters inside the currently selected workspace.
  const handleUpdateBrandSettings = (newSettings: BrandSettings) => {
    setBrandProfiles(currentProfiles => {
      const now = new Date().toISOString();
      const updatedProfiles = currentProfiles.map(profile =>
        profile.id === activeBrandId
          ? { ...profile, settings: newSettings, updatedAt: now }
          : profile
      );
      persistBrandProfiles(updatedProfiles, activeBrandId);
      return updatedProfiles;
    });
  };

  const handleSelectBrand = (brandId: string) => {
    if (!brandProfiles.some(profile => profile.id === brandId)) return;
    setActiveBrandId(brandId);
    persistBrandProfiles(brandProfiles, brandId);

    const selectedProjectId = activeProjectByBrand[brandId];
    const selectedProject = projects.find(
      project => project.id === selectedProjectId && project.brandId === brandId && project.status === 'active'
    );
    if (!selectedProject) {
      setActiveTab('projects');
    }
  };

  const handleCreateBrand = () => {
    setBrandProfiles(currentProfiles => {
      const now = new Date().toISOString();
      const currentActiveProfile =
        currentProfiles.find(profile => profile.id === activeBrandId) || currentProfiles[0];

      const newProfile: BrandProfile = {
        id: `brand-${Date.now().toString(36)}`,
        name: `Brand ${currentProfiles.length + 1}`,
        settings: { ...(currentActiveProfile?.settings || DEFAULT_BRAND_SETTINGS) },
        createdAt: now,
        updatedAt: now
      };

      const updatedProfiles = [...currentProfiles, newProfile];
      setActiveBrandId(newProfile.id);
      persistBrandProfiles(updatedProfiles, newProfile.id);
      return updatedProfiles;
    });
  };

  const handleRenameActiveBrand = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setBrandProfiles(currentProfiles => {
      const updatedProfiles = currentProfiles.map(profile =>
        profile.id === activeBrandId
          ? { ...profile, name: cleanName, updatedAt: new Date().toISOString() }
          : profile
      );
      persistBrandProfiles(updatedProfiles, activeBrandId);
      return updatedProfiles;
    });
  };

  const handleDeleteActiveBrand = () => {
    if (brandProfiles.length <= 1) return;

    const brandProjectsToDelete = projects.filter(project => project.brandId === activeBrandId);
    brandProjectsToDelete.forEach(project => {
      try {
        clearProjectStorage(project.id);
      } catch (err) {
        console.error('Failed to clear project data while deleting brand:', err);
      }
    });

    const updatedProfiles = brandProfiles.filter(profile => profile.id !== activeBrandId);
    const updatedProjects = projects.filter(project => project.brandId !== activeBrandId);
    const nextActiveId = updatedProfiles[0].id;
    const nextActiveMap = { ...activeProjectByBrand };
    delete nextActiveMap[activeBrandId];

    setBrandProfiles(updatedProfiles);
    setProjects(updatedProjects);
    setActiveBrandId(nextActiveId);
    setActiveProjectByBrand(nextActiveMap);
    persistBrandProfiles(updatedProfiles, nextActiveId);
    persistProjects(updatedProjects, nextActiveMap);

    const nextProjectId = nextActiveMap[nextActiveId];
    const hasOpenProject = updatedProjects.some(
      project => project.id === nextProjectId && project.brandId === nextActiveId && project.status === 'active'
    );
    if (!hasOpenProject) {
      setActiveTab('projects');
    }
  };

  const handleCreateProject = (input: { name: string; campaignName: string; description: string }) => {
    const now = new Date().toISOString();
    const project: StudioProject = {
      id: `project-${Date.now().toString(36)}`,
      brandId: activeBrandId,
      name: input.name,
      campaignName: input.campaignName,
      description: input.description,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now
    };

    const nextProjects = [...projects, project];
    const nextActiveMap = { ...activeProjectByBrand, [activeBrandId]: project.id };
    setProjects(nextProjects);
    setActiveProjectByBrand(nextActiveMap);
    persistProjects(nextProjects, nextActiveMap);
    setActiveTab('dashboard');
  };

  const handleOpenProject = (projectId: string) => {
    const project = projects.find(item => item.id === projectId && item.brandId === activeBrandId);
    if (!project || project.status === 'archived') return;

    const now = new Date().toISOString();
    const nextProjects = projects.map(item =>
      item.id === projectId
        ? { ...item, lastOpenedAt: now, updatedAt: now }
        : item
    );
    const nextActiveMap = { ...activeProjectByBrand, [activeBrandId]: projectId };
    setProjects(nextProjects);
    setActiveProjectByBrand(nextActiveMap);
    persistProjects(nextProjects, nextActiveMap);
    setActiveTab('dashboard');
  };

  const handleUpdateProject = (
    projectId: string,
    updates: Partial<Pick<StudioProject, 'name' | 'campaignName' | 'description'>>
  ) => {
    const nextProjects = projects.map(project =>
      project.id === projectId && project.brandId === activeBrandId
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    );
    setProjects(nextProjects);
    persistProjects(nextProjects, activeProjectByBrand);
  };

  const handleDuplicateProject = (projectId: string) => {
    const source = projects.find(project => project.id === projectId && project.brandId === activeBrandId);
    if (!source) return;

    const now = new Date().toISOString();
    const duplicate: StudioProject = {
      ...source,
      id: `project-${Date.now().toString(36)}`,
      name: `${source.name} Copy`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      duplicatedFromId: source.id
    };

    try {
      copyProjectStorage(source.id, duplicate.id);
    } catch (err) {
      console.error('Failed to duplicate project workspace data:', err);
    }

    const nextProjects = [...projects, duplicate];
    const nextActiveMap = { ...activeProjectByBrand, [activeBrandId]: duplicate.id };
    setProjects(nextProjects);
    setActiveProjectByBrand(nextActiveMap);
    persistProjects(nextProjects, nextActiveMap);
  };

  const handleToggleArchiveProject = (projectId: string) => {
    const target = projects.find(project => project.id === projectId && project.brandId === activeBrandId);
    if (!target) return;

    const nextStatus = target.status === 'archived' ? 'active' : 'archived';
    const nextProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, status: nextStatus, updatedAt: new Date().toISOString() }
        : project
    );

    let nextActiveMap = { ...activeProjectByBrand };
    if (nextStatus === 'archived' && nextActiveMap[activeBrandId] === projectId) {
      const replacement = nextProjects
        .filter(project => project.brandId === activeBrandId && project.status === 'active' && project.id !== projectId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

      if (replacement) {
        nextActiveMap[activeBrandId] = replacement.id;
      } else {
        delete nextActiveMap[activeBrandId];
      }
    }

    setProjects(nextProjects);
    setActiveProjectByBrand(nextActiveMap);
    persistProjects(nextProjects, nextActiveMap);
  };

  const handleDeleteProject = (projectId: string) => {
    const target = projects.find(project => project.id === projectId && project.brandId === activeBrandId);
    if (!target) return;

    const nextProjects = projects.filter(project => project.id !== projectId);
    const nextActiveMap = { ...activeProjectByBrand };

    if (nextActiveMap[activeBrandId] === projectId) {
      const replacement = nextProjects
        .filter(project => project.brandId === activeBrandId && project.status === 'active')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

      if (replacement) {
        nextActiveMap[activeBrandId] = replacement.id;
      } else {
        delete nextActiveMap[activeBrandId];
      }
    }

    try {
      clearProjectStorage(projectId);
    } catch (err) {
      console.error('Failed to clear deleted project workspace data:', err);
    }

    setProjects(nextProjects);
    setActiveProjectByBrand(nextActiveMap);
    persistProjects(nextProjects, nextActiveMap);
  };

  const handleProjectActivity = useCallback(() => {
    if (!activeProjectId) return;

    setProjects(currentProjects => {
      const now = new Date().toISOString();
      const nextProjects = currentProjects.map(project =>
        project.id === activeProjectId
          ? { ...project, updatedAt: now, lastOpenedAt: now }
          : project
      );

      try {
        localStorage.setItem('apex_sync_projects_v3', JSON.stringify(nextProjects));
        localStorage.setItem('apex_sync_active_projects_v3', JSON.stringify(activeProjectByBrand));
      } catch (err) {
        console.error('Failed to update project activity:', err);
      }

      return nextProjects;
    });
  }, [activeProjectId, activeProjectByBrand]);

  const handleNavigation = (tab: string) => {
    if ((tab === 'studio' || tab === 'slides') && !activeProject) {
      setActiveTab('projects');
      return;
    }
    setActiveTab(tab);
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
    const defaultProject = createDefaultProject();
    setBrandProfiles([defaultProfile]);
    setActiveBrandId(defaultProfile.id);
    setProjects([defaultProject]);
    setActiveProjectByBrand({ [defaultProfile.id]: defaultProject.id });
    setExportsList([]);
    try {
      localStorage.removeItem('apex_sync_brand_settings_v1');
      localStorage.removeItem('apex_sync_brand_profiles_v2');
      localStorage.removeItem('apex_sync_active_brand_v2');
      localStorage.removeItem('apex_sync_exports_v1');
      localStorage.removeItem('apex_sync_projects_v3');
      localStorage.removeItem('apex_sync_active_projects_v3');
      localStorage.removeItem('apex_sync_editor_draft_v2');
      localStorage.removeItem('apex_carousel_slides_v1');
      localStorage.removeItem('apex_carousel_pillar_v1');
      localStorage.removeItem('apex_carousel_day_v1');
      localStorage.removeItem('apex_carousel_episode_v1');
      localStorage.removeItem('apex_carousel_series_v1');
      localStorage.removeItem('apex_carousel_workspace_v2');
      Object.keys(localStorage)
        .filter(key => key.startsWith('apex_sync_project_'))
        .forEach(key => localStorage.removeItem(key));
      alert('Brand Studio workspace reset to system defaults.');
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to reset application state:', err);
    }
  };

  // Transition helper from card actions
  const handleSelectTemplate = (id: TemplateId, autoGenerate: boolean) => {
    if (!activeProject) {
      setActiveTab('projects');
      return;
    }
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
            onViewSlides={() => handleNavigation('slides')}
            exportCount={(exportsList || []).filter(item => !activeProjectId || item.projectId === activeProjectId).length}
            activeProjectName={activeProject?.name || null}
            projectCount={activeBrandProjects.filter(project => project.status === 'active').length}
            onViewProjects={() => setActiveTab('projects')}
          />
        );
      case 'studio':
        return (
          <Editor
            key={`${activeProjectId}-${selectedTemplateId}-${autoGenerateTrigger ? 'auto' : 'manual'}`}
            initialTemplateId={selectedTemplateId}
            autoGenerateOnLoad={autoGenerateTrigger}
            brandSettings={brandSettings}
            projectId={activeProject!.id}
            projectName={activeProject!.name}
            onProjectActivity={handleProjectActivity}
            onAddExport={handleAddExport}
          />
        );
      case 'slides':
        return (
          <CarouselBuilder
            key={activeProjectId || 'no-project'}
            brandSettings={brandSettings}
            projectId={activeProject!.id}
            projectName={activeProject!.name}
            onProjectActivity={handleProjectActivity}
            onAddExport={handleAddExport}
          />
        );
      case 'projects':
        return (
          <Projects
            brandName={activeBrandProfile?.name || 'Workspace'}
            projects={activeBrandProjects}
            activeProjectId={activeProjectId}
            exportsList={exportsList}
            onCreateProject={handleCreateProject}
            onOpenProject={handleOpenProject}
            onUpdateProject={handleUpdateProject}
            onDuplicateProject={handleDuplicateProject}
            onToggleArchiveProject={handleToggleArchiveProject}
            onDeleteProject={handleDeleteProject}
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
            activeProjectId={activeProjectId}
            activeProjectName={activeProject?.name || null}
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
      <Sidebar activeTab={activeTab} setActiveTab={handleNavigation} />

      {/* RIGHT MAIN WORKSPACE FRAME */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Workspace Top Bar (Header Panel) */}
        <header className="h-[64px] border-b border-[#1F1F1F] px-8 flex items-center justify-between bg-[#0E0E0E] shrink-0 select-none">
          
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-500 font-mono tracking-wider uppercase">STUDIO WORKSPACE</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            {activeProject && (
              <>
                <span className="text-xs text-neutral-600">/</span>
                <span className="text-[11px] font-semibold text-neutral-400 max-w-[220px] truncate">
                  {activeProject.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </>
            )}
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
