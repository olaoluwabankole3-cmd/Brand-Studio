/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import {
  Archive,
  ArchiveRestore,
  Clock3,
  Copy,
  FolderKanban,
  Layers3,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { ExportHistoryItem, StudioProject } from '../types';

interface ProjectsProps {
  brandName: string;
  projects: StudioProject[];
  activeProjectId: string | null;
  exportsList: ExportHistoryItem[];
  onCreateProject: (input: { name: string; campaignName: string; description: string }) => void;
  onOpenProject: (projectId: string) => void;
  onUpdateProject: (projectId: string, updates: Partial<Pick<StudioProject, 'name' | 'campaignName' | 'description'>>) => void;
  onDuplicateProject: (projectId: string) => void;
  onToggleArchiveProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const formatRelativeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  const diff = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};

export default function Projects({
  brandName,
  projects,
  activeProjectId,
  exportsList,
  onCreateProject,
  onOpenProject,
  onUpdateProject,
  onDuplicateProject,
  onToggleArchiveProject,
  onDeleteProject
}: ProjectsProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [name, setName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCampaignName, setEditCampaignName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const visibleProjects = useMemo(
    () => projects.filter(project => showArchived || project.status !== 'archived'),
    [projects, showArchived]
  );

  const archivedCount = projects.filter(project => project.status === 'archived').length;
  const activeCount = projects.filter(project => project.status === 'active').length;

  const exportCountByProject = useMemo(() => {
    const counts = new Map<string, number>();
    exportsList.forEach(item => {
      if (!item.projectId) return;
      counts.set(item.projectId, (counts.get(item.projectId) || 0) + 1);
    });
    return counts;
  }, [exportsList]);

  const handleCreate = () => {
    const cleanName = name.trim();
    if (!cleanName) return;

    onCreateProject({
      name: cleanName,
      campaignName: campaignName.trim(),
      description: description.trim()
    });

    setName('');
    setCampaignName('');
    setDescription('');
    setShowCreate(false);
  };

  const beginEdit = (project: StudioProject) => {
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditCampaignName(project.campaignName);
    setEditDescription(project.description);
  };

  const saveEdit = (projectId: string) => {
    const cleanName = editName.trim();
    if (!cleanName) return;

    onUpdateProject(projectId, {
      name: cleanName,
      campaignName: editCampaignName.trim(),
      description: editDescription.trim()
    });
    setEditingProjectId(null);
  };

  return (
    <div id="projects-tab" className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#C7A248]" />
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Projects</h1>
          </div>
          <p className="text-neutral-400 text-xs max-w-2xl">
            Organize campaigns, drafts, carousel decks, and exports under a project owned by <strong className="text-neutral-300">{brandName}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 bg-[#C7A248] hover:bg-[#b08d38] text-black px-4 py-2.5 rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Active Projects</span>
          <div className="text-2xl font-bold text-white mt-2">{activeCount}</div>
        </div>
        <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Archived</span>
          <div className="text-2xl font-bold text-white mt-2">{archivedCount}</div>
        </div>
        <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Project Assets</span>
          <div className="text-2xl font-bold text-white mt-2">
            {projects.reduce((sum, project) => sum + (exportCountByProject.get(project.id) || 0), 0)}
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="bg-[#0E0E0E] border border-[#C7A248]/30 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Create Project</h2>
              <p className="text-[10px] text-neutral-500 mt-1">This becomes the working container for drafts, decks, and exports.</p>
            </div>
            <button onClick={() => setShowCreate(false)} className="text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Project Name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enterprise Intelligence — September"
                className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Campaign / Series</label>
              <input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Enterprise Intelligence Series"
                className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Project Brief</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project producing, for whom, and for what campaign?"
              rows={3}
              className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-[#C7A248]/50"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 text-xs font-semibold hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="px-4 py-2 rounded-lg bg-[#C7A248] text-black text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create & Open
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
          <Layers3 className="w-3.5 h-3.5" />
          {showArchived ? 'All Projects' : 'Active Projects'}
        </div>

        {archivedCount > 0 && (
          <button
            onClick={() => setShowArchived(value => !value)}
            className="text-[10px] font-semibold text-neutral-500 hover:text-[#C7A248] transition-colors"
          >
            {showArchived ? 'Hide archived' : `Show archived (${archivedCount})`}
          </button>
        )}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="border border-dashed border-[#242424] bg-[#0C0C0C] rounded-2xl py-16 text-center">
          <FolderKanban className="w-10 h-10 text-neutral-700 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-300 mt-4">No active projects yet</h3>
          <p className="text-xs text-neutral-600 mt-1">Create a project to start a persistent production workspace.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {visibleProjects
            .slice()
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map(project => {
              const isActive = project.id === activeProjectId;
              const isEditing = project.id === editingProjectId;
              const assetCount = exportCountByProject.get(project.id) || 0;

              return (
                <div
                  key={project.id}
                  className={`bg-[#0E0E0E] border rounded-2xl p-6 transition-all ${
                    isActive ? 'border-[#C7A248]/50 shadow-[0_0_0_1px_rgba(199,162,72,0.08)]' : 'border-[#1F1F1F] hover:border-neutral-700'
                  } ${project.status === 'archived' ? 'opacity-70' : ''}`}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
                        />
                        <input
                          value={editCampaignName}
                          onChange={(e) => setEditCampaignName(e.target.value)}
                          placeholder="Campaign / Series"
                          className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C7A248]/50"
                        />
                      </div>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-[#C7A248]/50"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProjectId(null)}
                          className="px-3 py-2 rounded-lg border border-neutral-800 text-neutral-400 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(project.id)}
                          className="px-3 py-2 rounded-lg bg-[#C7A248] text-black text-xs font-bold flex items-center gap-2"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {isActive && (
                              <span className="px-2 py-0.5 rounded bg-[#C7A248]/10 border border-[#C7A248]/20 text-[9px] text-[#C7A248] font-bold uppercase tracking-widest">
                                Open
                              </span>
                            )}
                            {project.status === 'archived' && (
                              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                                Archived
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] truncate">{project.name}</h3>
                          <p className="text-[11px] text-[#C7A248]/80 font-mono mt-1">
                            {project.campaignName || 'Independent Project'}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Assets</span>
                          <div className="text-lg font-bold text-neutral-300">{assetCount}</div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed min-h-[38px] mt-4">
                        {project.description || 'No project brief added yet.'}
                      </p>

                      <div className="flex items-center gap-2 mt-5 text-[10px] text-neutral-600">
                        <Clock3 className="w-3.5 h-3.5" />
                        <span>Edited {formatRelativeDate(project.updatedAt)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#1F1F1F]">
                        <button
                          onClick={() => onOpenProject(project.id)}
                          disabled={project.status === 'archived'}
                          className="flex items-center gap-2 px-3 py-2 bg-[#C7A248] text-black rounded-lg text-[11px] font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {isActive ? 'Continue' : 'Open'}
                        </button>
                        <button
                          onClick={() => beginEdit(project)}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[11px] font-semibold"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDuplicateProject(project.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[11px] font-semibold"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => onToggleArchiveProject(project.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[11px] font-semibold"
                        >
                          {project.status === 'archived' ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                          {project.status === 'archived' ? 'Restore' : 'Archive'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${project.name}"? Working drafts and deck state for this project will be removed.`)) {
                              onDeleteProject(project.id);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-600 hover:text-rose-400 hover:border-rose-500/20 rounded-lg text-[11px] font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
