import React, { useState } from 'react';
import { Project, InquiryMessage } from '../types';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  CheckCircle2,
  Mail,
  Plus,
  Inbox,
  Layout,
  Clock,
  Send,
  AlertCircle,
  TrendingUp,
  Settings,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  inquiries: InquiryMessage[];
  onToggleInquiryRead: (id: string) => void;
  onDeleteInquiry: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onAddProject: (newProject: Project) => void;
  onAddMilestone: (projectId: string, milestone: { date: string; title: string; description: string; status: 'completed' | 'in-progress' | 'planned' }) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  isOpen,
  onClose,
  projects,
  inquiries,
  onToggleInquiryRead,
  onDeleteInquiry,
  onDeleteProject,
  onAddProject,
  onAddMilestone
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'new-project'>('inquiries');

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Business Website');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIconType, setNewIconType] = useState<'gym' | 'restaurant' | 'creator' | 'game' | 'code'>('code');
  const [newTech, setNewTech] = useState('HTML5, CSS3, JavaScript ES6+');
  const [newFeatures, setNewFeatures] = useState('Mobile Responsive, High Performance, Custom Lead Funnel');
  const [newDuration, setNewDuration] = useState('3-5 Days Dev Time');

  // Milestone Form State
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [mDate, setMDate] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'gsj12345@#$') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      tagline: newTagline || 'Modern custom built web application',
      description: newDescription || 'Bespoke web platform engineered with speed, scalability and clean responsive design.',
      imageColor: 'from-blue-600/40 via-cyan-600/20 to-slate-950',
      iconType: newIconType,
      technologies: newTech.split(',').map(s => s.trim()).filter(Boolean),
      features: newFeatures.split(',').map(s => s.trim()).filter(Boolean),
      duration: newDuration,
      status: 'Completed',
      demoUrl: '#demo',
      githubUrl: 'https://github.com/GSJ-Dev',
      timeline: [
        { date: 'Sprint 1', title: 'Architecture & UI Mockup', description: 'Wireframing, semantic schema, and layout structure.', status: 'completed' },
        { date: 'Sprint 2', title: 'Frontend & Interactive Logic', description: 'Full responsive coding and dynamic components.', status: 'completed' }
      ]
    };

    onAddProject(created);
    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
    setActiveTab('projects');
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !mTitle.trim()) return;

    onAddMilestone(selectedProjectId, {
      date: mDate || 'Sprint Milestone',
      title: mTitle,
      description: mDesc || 'Milestone verification and delivery.',
      status: 'completed'
    });

    setMTitle('');
    setMDesc('');
    setMDate('');
  };

  const unreadCount = inquiries.filter(i => !i.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0b1120] border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto my-auto flex flex-col">
        {/* Top Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-[#0d1527]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">GSJ Admin Control Center</h3>
                {isAuthenticated && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    AUTHENTICATED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Private developer dashboard & lead management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono-code transition-colors"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Challenge */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white font-display">GSJ Master Passcode</h4>
              <p className="text-xs text-slate-400 mt-1">Enter your admin password to view incoming leads and manage demo projects.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500 text-center font-mono-code"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-400 mt-2">Incorrect passcode. Please check your admin credentials and try again.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg transition-all"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="p-6 space-y-6 flex-1">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-white font-display">{inquiries.length}</div>
                  <div className="text-xs text-slate-400">Total Client Leads</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400"><Inbox className="w-5 h-5" /></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-display">{unreadCount}</div>
                  <div className="text-xs text-slate-400">Unread Inquiries</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Mail className="w-5 h-5" /></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-purple-400 font-display">{projects.length}</div>
                  <div className="text-xs text-slate-400">Active Live Projects</div>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400"><Layout className="w-5 h-5" /></div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'inquiries'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Leads & Messages ({inquiries.length})</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Manage Projects & Timelines</span>
              </button>

              <button
                onClick={() => setActiveTab('new-project')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'new-project'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Showcase</span>
              </button>
            </div>

            {/* TAB 1: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-500 text-xs">
                    No inquiries recorded yet. Test the contact form on the home page to see new leads appear here in real-time.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map(inq => (
                      <div
                        key={inq.id}
                        className={`p-4 rounded-xl border transition-all ${
                          inq.read
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                            : 'bg-slate-900 border-cyan-500/40 text-slate-200 shadow-md shadow-cyan-500/5'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${inq.read ? 'bg-slate-600' : 'bg-cyan-400 animate-ping'}`} />
                            <h5 className="font-bold text-white text-sm">{inq.name}</h5>
                            <span className="text-xs text-slate-400 font-mono-code">&lt;{inq.email}&gt;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {inq.service}
                            </span>
                            <span className="text-[11px] text-slate-500">{inq.date}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 my-3 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                          "{inq.message}"
                        </p>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500 font-mono-code">Timeline: {inq.timeline}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleInquiryRead(inq.id)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                            >
                              {inq.read ? 'Mark Unread' : 'Mark as Read'}
                            </button>
                            <a
                              href={`mailto:${inq.email}?subject=RE: Project Inquiry with GSJ&body=Hi ${inq.name},%0D%0A%0D%0AThank you for reaching out regarding your project...`}
                              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              <span>Reply Email</span>
                            </a>
                            <button
                              onClick={() => onDeleteInquiry(inq.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROJECTS & TIMELINES */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {/* Project List */}
                <div className="space-y-3">
                  <h5 className="text-sm font-bold text-white font-display">Active Portfolio Projects</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projects.map(p => (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <h6 className="font-bold text-white text-sm">{p.title}</h6>
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{p.tagline}</p>
                          <div className="text-[11px] font-mono-code text-slate-500 pt-1">
                            {p.timeline.length} Milestones logged
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <button
                            onClick={() => setSelectedProjectId(p.id)}
                            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Add Sprint Milestone</span>
                          </button>
                          <button
                            onClick={() => onDeleteProject(p.id)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone Form */}
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-sm font-bold text-white">Append Milestone to Project</h5>
                  </div>

                  <form onSubmit={handleCreateMilestone} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono-code text-slate-400">Target Project</label>
                      <select
                        value={selectedProjectId}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-mono-code text-slate-400">Day / Sprint Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Day 6 or Post-Launch QA"
                        value={mDate}
                        onChange={e => setMDate(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono-code text-slate-400">Milestone Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Performance Audit & Security"
                        value={mTitle}
                        onChange={e => setMTitle(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-mono-code text-slate-400">Milestone Technical Summary</label>
                      <input
                        type="text"
                        placeholder="e.g. Ran Lighthouse tests and achieved 99 score."
                        value={mDesc}
                        onChange={e => setMDesc(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                      >
                        + Add Milestone
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: ADD NEW PROJECT */}
            {activeTab === 'new-project' && (
              <form onSubmit={handleCreateProject} className="space-y-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-sm font-bold text-white font-display">Create New Portfolio Project</h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Nova Logistics Portal"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. SaaS / Logistics"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Icon Type</label>
                    <select
                      value={newIconType}
                      onChange={e => setNewIconType(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="code">Code & Web App</option>
                      <option value="gym">Gym & Fitness</option>
                      <option value="restaurant">Restaurant & Dining</option>
                      <option value="creator">Creator & Influencer</option>
                      <option value="game">Browser Game</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Development Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Days Dev Time"
                      value={newDuration}
                      onChange={e => setNewDuration(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono-code text-slate-400">Tagline</label>
                    <input
                      type="text"
                      placeholder="Short 1-sentence value hook"
                      value={newTagline}
                      onChange={e => setNewTagline(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono-code text-slate-400">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Full project technical overview..."
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono-code text-slate-400">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={newTech}
                      onChange={e => setNewTech(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Publish Project to Portfolio
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
