import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Layers, 
  Send, 
  Clock, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionType: 'open_demo' | 'whatsapp' | 'contact_form' | 'custom';
  actionTarget?: string;
  icon: string;
  estimatedTime: string;
}

const CHECKLIST_STEPS: ChecklistItem[] = [
  {
    id: 'demo_review',
    title: 'Explore 3 Live Production Demos',
    description: 'Test the Gym Member Portal, Restaurant WhatsApp Checkout & Creator Media Hub.',
    actionText: 'View Live Demos',
    actionType: 'open_demo',
    actionTarget: 'projects',
    icon: '⚡',
    estimatedTime: '2 mins'
  },
  {
    id: 'scope_definition',
    title: 'Define Your Tech Stack & Requirements',
    description: 'Select desired features: Responsive UI, Admin Dashboard, Payment Gateway, or SEO setup.',
    actionText: 'Explore Tech Capabilities',
    actionType: 'custom',
    actionTarget: 'skills',
    icon: '🛠️',
    estimatedTime: '3 mins'
  },
  {
    id: 'whatsapp_connect',
    title: 'Initiate Direct WhatsApp Consultation',
    description: 'Connect with GSJ (+91 86999 79370) for rapid feasibility feedback and budget estimation.',
    actionText: 'Chat on WhatsApp',
    actionType: 'whatsapp',
    icon: '💬',
    estimatedTime: '1 min'
  },
  {
    id: 'sprint_brief',
    title: 'Submit Project Sprint Specs',
    description: 'Fill out the brief in the contact section to route instantly to the GSJ Admin Command Center.',
    actionText: 'Open Project Brief Form',
    actionType: 'contact_form',
    actionTarget: 'contact',
    icon: '📝',
    estimatedTime: '2 mins'
  },
  {
    id: 'timeline_kickoff',
    title: 'Receive Sprint Timeline & Milestones',
    description: 'Get your customized 3-to-7 day delivery milestone roadmap with daily staging updates.',
    actionText: 'View Delivery SLA',
    actionType: 'custom',
    actionTarget: 'services',
    icon: '🚀',
    estimatedTime: 'Instant'
  }
];

const STORAGE_KEY = 'gsj_onboarding_progress_v1';

interface OnboardingChecklistProps {
  onOpenDemo?: (projectId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  onOpenDemo,
  onNavigateSection
}) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['demo_review'];
    } catch {
      return ['demo_review'];
    }
  });

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps));
    } catch (e) {
      console.error(e);
    }
  }, [completedSteps]);

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const isCompleted = prev.includes(id);
      const next = isCompleted ? prev.filter(item => item !== id) : [...prev, id];
      trackEvent('checklist_step', id, 'onboarding', { isCompleted: !isCompleted, totalDone: next.length });
      return next;
    });
  };

  const handleAction = (step: ChecklistItem) => {
    trackEvent('checklist_step', step.id, 'onboarding_action_click');
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
    }

    if (step.actionType === 'whatsapp') {
      window.open('https://wa.me/918699979370?text=Hello%20GSJ,%20I%20am%20following%20the%20project%20onboarding%20checklist%20and%20want%20to%20discuss%20a%20new%20web%20project.', '_blank');
    } else if (step.actionTarget) {
      const el = document.getElementById(step.actionTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigateSection) {
        onNavigateSection(step.actionTarget);
      }
    }
  };

  const resetChecklist = () => {
    setCompletedSteps([]);
    localStorage.removeItem(STORAGE_KEY);
    trackEvent('checklist_step', 'reset', 'onboarding');
  };

  const progressPercent = Math.round((completedSteps.length / CHECKLIST_STEPS.length) * 100);

  return (
    <section id="onboarding" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c1326] to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono-code text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLIENT SPRINT LAUNCHPAD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Project Kickoff & Onboarding Checklist
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Follow these 5 streamlined steps to scope, test, and kick off your high-performance web build with GSJ.
              </p>
            </div>

            {/* Progress Counter & Controls */}
            <div className="flex items-center gap-4">
              <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-cyan-400 transition-all duration-500"
                      fill="transparent"
                      strokeDasharray={113}
                      strokeDashoffset={113 - (113 * progressPercent) / 100}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-white font-mono-code">
                    {progressPercent}%
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono-code">Progress</div>
                  <div className="text-sm font-bold text-white">
                    {completedSteps.length} of {CHECKLIST_STEPS.length} Completed
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isExpanded ? 'Collapse checklist' : 'Expand checklist'}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Checklist Step Cards */}
          {isExpanded && (
            <div className="grid grid-cols-1 gap-3.5">
              {CHECKLIST_STEPS.map((step, index) => {
                const isDone = completedSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-slate-950/60 border-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                        title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono-code font-bold text-cyan-400">
                            STEP 0{index + 1}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {step.icon} {step.title}
                          </span>
                          <span className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.estimatedTime}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                      <button
                        onClick={() => handleAction(step)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                          step.actionType === 'whatsapp'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40'
                        }`}
                      >
                        {step.actionType === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                        <span>{step.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Reset & Status */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All progress is saved locally. Average client kickoff turnaround: 24 Hours.</span>
            </div>
            {completedSteps.length > 0 && (
              <button
                onClick={resetChecklist}
                className="hover:text-slate-300 flex items-center gap-1 text-slate-400 font-mono-code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Checklist</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
