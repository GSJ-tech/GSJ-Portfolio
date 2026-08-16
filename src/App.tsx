import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Zap,
  ShieldCheck,
  Headphones,
  Flame,
  Layout,
  Terminal,
  Send,
  Copy,
  Check,
  Gamepad2,
  Dumbbell,
  Utensils,
  Video,
  Clock,
  Eye,
  Menu,
  X,
  Lock,
  Play,
  RotateCcw,
  Trophy,
  ChevronRight,
  Phone,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

import { Project, InquiryMessage, INITIAL_PROJECTS } from './types';
import { ProjectModal } from './components/ProjectModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OnboardingChecklist } from './components/OnboardingChecklist';
import { CookieBanner } from './components/CookieBanner';
import { trackEvent } from './utils/analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'games'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  // Projects State
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('gsj_projects_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [selectedTimelineProject, setSelectedTimelineProject] = useState<Project>(() => projectsList[0] || INITIAL_PROJECTS[0]);

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(() => {
    const saved = localStorage.getItem('gsj_inquiries_v2');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'inq-101',
            name: 'Marcus Vance',
            email: 'marcus@ironpulse.club',
            service: 'Gym / Fitness Website',
            timeline: 'Within 1-2 Weeks',
            message: 'Loved your IronForge Gym demo with the BMI calculator and membership tiers. We need a similar platform with trainer booking.',
            date: 'Aug 15, 2026',
            read: false
          },
          {
            id: 'inq-102',
            name: 'Elena Rostova',
            email: 'elena@kairocreators.com',
            service: 'Creator / Influencer Hub',
            timeline: 'Standard (1-2 Weeks)',
            message: 'Looking for a media kit and sponsorship booking portal for our YouTube channel (450K subs). Your creator demo looks very clean.',
            date: 'Aug 14, 2026',
            read: true
          }
        ];
  });

  // Admin Dashboard State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Business Website',
    timeline: 'Standard (1-2 Weeks)',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Mini Shadow Jump Game State
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(160);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({ x: 50, y: 140, vy: 0, isGrounded: true });
  const obstaclesRef = useRef<Array<{ x: number; width: number; height: number; speed: number }>>([]);
  const scoreRef = useRef(0);

  const myEmail = 'gurmanassingh148@gmail.com';
  const myPhone = '+91 8699979370';
  const myPhoneDisplay = '+91 86999 79370';
  const whatsappUrl = `https://wa.me/918699979370?text=${encodeURIComponent("Hi GSJ, I reviewed your portfolio and would like to discuss a web development project!")}`;

  useEffect(() => {
    trackEvent('pageview', 'home_landing');
  }, []);

  useEffect(() => {
    localStorage.setItem('gsj_projects_v2', JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem('gsj_inquiries_v2', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(myEmail);
    setCopiedEmail(true);
    trackEvent('pageview', 'copied_email', 'contact');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(myPhone);
    setCopiedPhone(true);
    trackEvent('call_click', 'copied_phone', 'contact');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleOpenWhatsApp = (source: string) => {
    trackEvent('whatsapp_click', source, 'conversion');
  };

  const handleOpenCall = (source: string) => {
    trackEvent('call_click', source, 'conversion');
  };

  const handleOpenDemoModal = (project: Project) => {
    trackEvent('demo_open', project.title, 'portfolio');
    setSelectedModalProject(project);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmittingForm(true);

    const newInq: InquiryMessage = {
      id: `inq-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      service: formData.service,
      timeline: formData.timeline,
      message: formData.message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    // 1. Save to local storage for Admin Dashboard access
    setInquiries(prev => [newInq, ...prev]);

    // 2. Automatically dispatch email to developer inbox
    try {
      await fetch('https://formsubmit.co/ajax/gurmanassingh148@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `⚡ New Project Inquiry from ${formData.name} - GSJ Portfolio`,
          Name: formData.name,
          Email: formData.email,
          Service: formData.service,
          Timeline: formData.timeline,
          Message: formData.message || 'No additional message provided.',
          Date: newInq.date,
          Source: window.location.href,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (err) {
      console.warn('Background email dispatch error:', err);
    } finally {
      setIsSubmittingForm(false);
      setFormSubmitted(true);
      trackEvent('contact_submit', formData.service, 'leads', { timeline: formData.timeline });
    }
  };

  const toggleInquiryRead = (id: string) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, read: !inq.read } : inq));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  const deleteProject = (id: string) => {
    setProjectsList(prev => prev.filter(p => p.id !== id));
    if (selectedTimelineProject.id === id && projectsList.length > 1) {
      setSelectedTimelineProject(projectsList.find(p => p.id !== id) || INITIAL_PROJECTS[0]);
    }
  };

  const addProject = (newProj: Project) => {
    setProjectsList(prev => [newProj, ...prev]);
  };

  const addMilestone = (projectId: string, milestone: any) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          timeline: [...p.timeline, milestone]
        };
      }
      return p;
    }));
  };

  // Helper to render icon by type
  const renderProjectIcon = (type: string) => {
    switch (type) {
      case 'gym':
        return <Dumbbell className="w-5 h-5" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5" />;
      case 'creator':
        return <Video className="w-5 h-5" />;
      case 'game':
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  // Shadow Jump Game Loop
  const startGame = () => {
    setGameState('playing');
    setGameScore(0);
    scoreRef.current = 0;
    playerRef.current = { x: 50, y: 140, vy: 0, isGrounded: true };
    obstaclesRef.current = [
      { x: 350, width: 22, height: 35, speed: 4.5 },
      { x: 550, width: 26, height: 42, speed: 4.5 }
    ];
  };

  const jumpPlayer = () => {
    if (playerRef.current.isGrounded && gameState === 'playing') {
      playerRef.current.vy = -11;
      playerRef.current.isGrounded = false;
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jumpPlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;

    const loop = () => {
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 175);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Floor line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 175);
      ctx.lineTo(canvas.width, 175);
      ctx.stroke();

      // Player
      const p = playerRef.current;
      p.vy += 0.65;
      p.y += p.vy;

      if (p.y >= 140) {
        p.y = 140;
        p.vy = 0;
        p.isGrounded = true;
      }

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(p.x, p.y, 25, 35);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x + 14, p.y + 6, 8, 5);

      // Obstacles
      let collision = false;
      const obstacles = obstaclesRef.current;

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(obs.x, 175 - obs.height, obs.width, obs.height);

        if (
          p.x + 23 > obs.x &&
          p.x < obs.x + obs.width &&
          p.y + 35 > 175 - obs.height
        ) {
          collision = true;
        }

        if (obs.x + obs.width < 0) {
          obs.x = canvas.width + Math.random() * 150 + 100;
          obs.height = Math.floor(Math.random() * 25) + 25;
          obs.speed = 4.5 + Math.min(scoreRef.current * 0.05, 3.5);
          scoreRef.current += 10;
          setGameScore(scoreRef.current);
          if (scoreRef.current > gameHighScore) {
            setGameHighScore(scoreRef.current);
          }
        }
      }

      if (collision) {
        setGameState('gameover');
        return;
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, gameHighScore]);

  const filteredProjects = projectsList.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'web') return !p.isGame;
    if (activeTab === 'games') return p.isGame;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080c14]/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  GSJ
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-1.5">
                GSJ
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </span>
              <span className="text-xs text-slate-400 font-mono-code">Developer Portfolio</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#onboarding" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Onboarding</span>
            </a>
            <a href="#timelines" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Timelines
            </a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#why-me" className="hover:text-cyan-400 transition-colors">Why Me</a>
          </nav>

          {/* Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              onClick={() => handleOpenWhatsApp('header_nav')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1.5 text-xs font-mono-code"
              title="Chat on WhatsApp (+91 8699979370)"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${myPhone.replace(/\s+/g, '')}`}
              onClick={() => handleOpenCall('header_nav')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono-code"
              title="Direct Call (+91 8699979370)"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Call</span>
            </a>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono-code"
              title="Admin Dashboard (GSJ Only)"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin</span>
              {inquiries.filter(i => !i.read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 transition-all flex items-center gap-2 group"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`tel:${myPhone.replace(/\s+/g, '')}`}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090e1a]/95 border-b border-slate-800 px-6 py-6 space-y-4 backdrop-blur-xl">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">About</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">Projects</a>
            <a href="#timelines" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">Project Timelines</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">Services</a>
            <a href="#why-me" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-cyan-400 font-medium text-base py-1">Why Me</a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({myPhoneDisplay})</span>
              </a>
              <a
                href={`tel:${myPhone.replace(/\s+/g, '')}`}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call {myPhoneDisplay}</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md"
              >
                Contact Me Form
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono-code flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-mono-code font-medium text-cyan-300">Open for Freelance & Project Contracts</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
                  Hi, I'm{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                    GSJ
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-300 font-display">
                  <span className="text-cyan-400">Web Developer</span> | <span className="text-purple-400">Builder</span> | <span className="text-emerald-400">Entrepreneur</span>
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                I build high-performance custom websites for businesses, gyms, restaurants, creators, and modern startups. Engineered for fast speeds, conversions, and clean responsive design.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                >
                  <Eye className="w-5 h-5" />
                  <span>View 3 Live Demos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Me</span>
                </a>

                <a
                  href={`tel:${myPhone.replace(/\s+/g, '')}`}
                  className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 font-mono-code"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>{myPhoneDisplay}</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-cyan-300 text-sm font-mono-code transition-all flex items-center gap-2"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono-code">
                <span className="text-slate-500">Demo Showcases:</span>
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">Gym & Athletic Portal</span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">Restaurant & WhatsApp Cart</span>
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400">Creator & Influencer Hub</span>
              </div>
            </div>

            {/* Terminal Widget */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30" />
                <div className="relative rounded-2xl bg-[#0b1120] border border-slate-800 shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-[#0d1527] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>gsj-portfolio.config.ts</span>
                    </div>
                    <div className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono-code border border-cyan-500/20">
                      LIVE
                    </div>
                  </div>

                  <div className="p-5 font-mono-code text-xs sm:text-sm space-y-2.5 text-slate-300 leading-relaxed overflow-x-auto">
                    <div><span className="text-purple-400">interface</span> <span className="text-cyan-300">DeveloperProfile</span> &#123;</div>
                    <div className="pl-4"><span className="text-slate-400">developer:</span> <span className="text-emerald-300">'GSJ'</span>,</div>
                    <div className="pl-4"><span className="text-slate-400">phone:</span> <span className="text-cyan-300">'+91 8699979370'</span>,</div>
                    <div className="pl-4"><span className="text-slate-400">email:</span> <span className="text-cyan-300">'gurmanassingh148@gmail.com'</span>,</div>
                    <div className="pl-4"><span className="text-slate-400">focus:</span> <span className="text-amber-300">'Fast, Scalable Web Solutions'</span>,</div>
                    <div className="pl-4"><span className="text-slate-400">liveDemos:</span> [<span className="text-red-300">'Gym'</span>, <span className="text-yellow-300">'Restaurant'</span>, <span className="text-purple-300">'Influencer'</span>],</div>
                    <div className="pl-4"><span className="text-slate-400">adminDashboard:</span> <span className="text-emerald-400">'Active & Functional'</span>,</div>
                    <div>&#125;;</div>

                    <div className="pt-2 text-slate-500 text-xs">// Ready to launch your digital platform?</div>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-cyan-400">&gt;</span>
                      <span className="text-slate-300">gsj.initializeProjectDiscussion();</span>
                      <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-[#0d1527]/70 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <ShieldCheck className="w-4 h-4" /> Production Grade Code
                    </span>
                    <span className="font-mono-code text-cyan-400">Mobile-First</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ABOUT SECTION */}
        {/* ============================================================ */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Profile
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">GSJ</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Student, developer, and aspiring founder dedicated to crafting serious digital products.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl space-y-5 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Student, Developer & Aspiring Founder</h3>
                    <p className="text-xs text-slate-400">Focused on problem solving, rapid learning, and building</p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  I am a passionate freelance web developer and builder. I master core web technologies to create practical web platforms that serve real business goals.
                </p>

                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Every build adheres to four key tenets: <strong className="text-slate-200 font-semibold">fast load times, responsive UI that works across all devices, clean maintainable code, and high user engagement</strong>.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-display">Practical</div>
                    <div className="text-xs text-slate-400 mt-0.5">Problem Solving</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-display">Clean</div>
                    <div className="text-xs text-slate-400 mt-0.5">Semantic Code</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 font-display">Sprint</div>
                    <div className="text-xs text-slate-400 mt-0.5">Timely Delivery</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-base">Relentless Problem Solving</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Breaking down complex project requirements into modular, efficient code without bloat.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-base">Continuous Learning</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Regularly sharpening knowledge in JavaScript ES6+, responsive layouts, and cloud backends.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-base">Builder Mindset</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Shipping production-ready projects from scratch, taking responsibility for every design pixel and functional flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SKILLS SECTION */}
        {/* ============================================================ */}
        <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Technical Toolkit
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                Skills & <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Capabilities</span>
              </h2>
              <p className="text-slate-400 text-base">
                Core technologies and engineering workflows used to ship robust web solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'HTML5', cat: 'Semantic & a11y', desc: 'Accessible DOM hierarchy, SEO optimization, and clean semantic architecture.', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                { name: 'CSS3 / Tailwind', cat: 'Modern Styling', desc: 'Glassmorphism, fluid responsive layouts, keyframe animations, and custom UI components.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { name: 'JavaScript ES6+', cat: 'Logic & APIs', desc: 'Asynchronous workflows, DOM manipulation, state management, and modern Web APIs.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                { name: 'Firebase', cat: 'Cloud Backend', desc: 'Firestore NoSQL database, user authentication, security rules, and real-time state sync.', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { name: 'GitHub & Git', cat: 'Version Control', desc: 'Branch workflows, continuous deployment, and structured repository architectures.', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
                { name: 'Responsive Design', cat: 'Multi-Device', desc: 'Mobile-first methodology ensuring pixel-perfect fidelity across all screen dimensions.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                { name: 'UI / UX Design', cat: 'Product Design', desc: 'Futuristic dark aesthetics, frictionless user funnels, and high visual hierarchy.', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { name: 'Developer Tooling', cat: 'Productivity', desc: 'Automation, AI-assisted refactoring, and rapid prototyping workflows.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((skill, idx) => (
                <div key={idx} className={`p-5 rounded-2xl bg-slate-900/70 border ${skill.border} flex flex-col justify-between space-y-3`}>
                  <div>
                    <span className="text-[10px] font-mono-code text-slate-500 uppercase">{skill.cat}</span>
                    <h4 className={`text-lg font-bold ${skill.color} font-display mt-0.5`}>{skill.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PROJECTS SECTION WITH 3 REQUESTED DEMOS */}
        {/* ============================================================ */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                  Featured Demos & Work
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                  Interactive <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Project Demos</span>
                </h2>
                <p className="text-slate-400 text-base">
                  Click <strong className="text-cyan-400 font-semibold">"Launch Interactive Demo"</strong> on any project to test real features (Gym BMI tools & plans, Restaurant WhatsApp Cart, and Influencer Media Kit & Sponsorship forms).
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'all' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  All Projects ({projectsList.length})
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'web' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Web Applications
                </button>
                <button
                  onClick={() => setActiveTab('games')}
                  className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'games' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Browser Games
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-cyan-500/10"
                >
                  {/* Card Top Banner */}
                  <div className={`p-6 bg-gradient-to-br ${project.imageColor} border-b border-slate-800 relative overflow-hidden`}>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner">
                        {renderProjectIcon(project.iconType)}
                      </div>
                      <span className="text-[11px] font-mono-code px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                        {project.duration}
                      </span>
                    </div>

                    <div className="mt-4 relative z-10">
                      <span className="text-xs font-mono-code text-cyan-300/80 tracking-wide uppercase">{project.category}</span>
                      <h3 className="text-xl font-bold text-white font-display mt-0.5">{project.title}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-cyan-400 font-mono-code">{project.tagline}</p>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{project.description}</p>

                      {/* Feature Bullets */}
                      <div className="space-y-1.5 pt-2">
                        {project.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-code text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-[#0d1527] border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        if (project.isGame) {
                          const el = document.getElementById('game-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          handleOpenDemoModal(project);
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{project.isGame ? 'Play Game Below' : 'Launch Interactive Demo'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTimelineProject(project);
                        const el = document.getElementById('timelines');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View Project Development Timeline"
                    >
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTERACTIVE ONBOARDING CHECKLIST SECTION */}
        {/* ============================================================ */}
        <OnboardingChecklist
          onOpenDemo={(target) => {
            const match = projectsList.find(p => p.id === target || p.category.toLowerCase().includes(target));
            if (match) handleOpenDemoModal(match);
          }}
          onNavigateSection={(id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* ============================================================ */}
        {/* PROJECT DEVELOPMENT TIMELINES SECTION */}
        {/* ============================================================ */}
        <section id="timelines" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Sprint Architecture
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                Project Development <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Timelines</span>
              </h2>
              <p className="text-slate-400 text-base">
                Transparent day-by-day sprint breakdowns demonstrating structured engineering and on-time delivery.
              </p>
            </div>

            {/* Project Timeline Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {projectsList.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedTimelineProject(p)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedTimelineProject.id === p.id
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {renderProjectIcon(p.iconType)}
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Project Milestone Tree */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code text-cyan-400">{selectedTimelineProject.category}</span>
                  <h3 className="text-2xl font-bold text-white font-display">{selectedTimelineProject.title}</h3>
                  <p className="text-xs text-slate-400 max-w-xl">{selectedTimelineProject.tagline}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-cyan-300">
                    ⏱ {selectedTimelineProject.duration}
                  </span>
                  <button
                    onClick={() => {
                      if (selectedTimelineProject.isGame) {
                        const el = document.getElementById('game-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setSelectedModalProject(selectedTimelineProject);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open Demo</span>
                  </button>
                </div>
              </div>

              {/* Timeline Milestones Vertical List */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-emerald-500">
                {selectedTimelineProject.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-md">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono-code text-cyan-400 font-bold">{step.date}</span>
                        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {step.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* BROWSER GAME LIVE PLAY SECTION */}
        {/* ============================================================ */}
        <section id="game-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Interactive Canvas Lab
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                Shadow Jump: <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">Neon Odyssey</span>
              </h2>
              <p className="text-slate-400 text-base">
                Pure HTML5 Canvas & Vanilla JavaScript endless platformer running in real-time.
              </p>
            </div>

            <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-white font-display">60 FPS Game Loop</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono-code">
                  <span className="text-slate-400">Score: <strong className="text-cyan-400 text-sm">{gameScore}</strong></span>
                  <span className="text-slate-400">High: <strong className="text-amber-400 text-sm">{gameHighScore}</strong></span>
                </div>
              </div>

              {/* Game Canvas Box */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0a0f1d] aspect-[16/7] max-h-72 w-full flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={220}
                  onClick={jumpPlayer}
                  className="w-full h-full object-contain cursor-pointer"
                />

                {gameState === 'idle' && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
                    <h4 className="text-xl font-bold text-white font-display">Shadow Jump</h4>
                    <p className="text-xs text-slate-300 max-w-sm">Press Spacebar or Click/Tap anywhere on screen to Jump over incoming neon obstacles.</p>
                    <button
                      onClick={startGame}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Game</span>
                    </button>
                  </div>
                )}

                {gameState === 'gameover' && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <h4 className="text-2xl font-extrabold text-red-500 font-display">GAME OVER</h4>
                    <p className="text-xs text-slate-300">Final Score: <strong className="text-cyan-400">{gameScore}</strong></p>
                    <button
                      onClick={startGame}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Play Again</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-mono-code pt-1">
                <span>Controls: Spacebar / Arrow Up / Tap</span>
                <span>Vanilla JS Physics</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SERVICES SECTION */}
        {/* ============================================================ */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Offerings
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                Services & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-slate-400 text-base">
                Fast, reliable web development services tailored to business and creator needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Business & Brand Websites', tag: 'Custom Engineered', desc: 'Modern digital storefronts engineered to capture inquiries and establish authority.', feats: ['Custom Brand Identity & Layout', 'Direct WhatsApp & Lead Funnel', 'Mobile-First Fluid Scaling'], time: '3-5 Days Delivery' },
                { title: 'Gym & Athletic Portals', tag: 'High Conversion', desc: 'Membership matrix, class schedules, trainer spotlight, and health metric calculators.', feats: ['Tiered Pricing Switcher', 'Trainer Booking Workflow', 'Built-in BMI & Macro Tools'], time: '4-5 Days Delivery' },
                { title: 'Restaurant & Hospitality', tag: 'Takeout Engine', desc: 'Digital menus with dietary indicators, table reservation engine, and 1-click WhatsApp cart.', feats: ['Categorized Digital Menu', '1-Click WhatsApp Checkout', 'Instant Table Reservations'], time: '3-4 Days Delivery' },
                { title: 'Creator & Influencer Hubs', tag: 'Media Kit Portal', desc: 'Personal branding, verified audience statistics, brand sponsorship intake, and video showcases.', feats: ['Audience Stats Media Kit', 'Brand Collaboration Intake', 'Video Showcase Gallery'], time: '3-5 Days Delivery' },
              ].map((srv, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                      {srv.tag}
                    </span>
                    <h3 className="text-xl font-bold text-white font-display">{srv.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{srv.desc}</p>
                    <div className="pt-2 space-y-1.5">
                      {srv.feats.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-400">
                    <span>⏱ {srv.time}</span>
                    <a href="#contact" className="text-cyan-400 hover:underline flex items-center gap-1">Discuss Project &rarr;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* WHY WORK WITH ME */}
        {/* ============================================================ */}
        <section id="why-me" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                Value Proposition
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
                Why Work <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">With Me</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Fast Delivery', desc: 'Sprint-based workflows ensuring prompt delivery without code bloat.', stat: '2-5 Days', statLabel: 'Sprint Turnaround' },
                { title: 'Mobile First', desc: 'Tested across iPhones, Android devices, and laptops for 100% fluid UX.', stat: '100%', statLabel: 'Responsive Matrix' },
                { title: 'Modern Aesthetics', desc: 'Sleek dark theme aesthetics, glassmorphism, and polished micro-interactions.', stat: 'Modern UI', statLabel: 'High Visual Standard' },
                { title: 'Direct Support', desc: 'Direct developer communication with zero agency middlemen.', stat: 'Dedicated', statLabel: 'Direct Partner' },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0b1120] border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-cyan-400 font-display">{item.stat}</div>
                    <div className="text-[11px] font-mono-code text-slate-500">{item.statLabel}</div>
                    <h4 className="text-base font-bold text-white pt-2">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONTACT SECTION */}
        {/* ============================================================ */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase tracking-wider">
                  Let's Connect
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                  Have a Project in Mind? <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Let's Build It.</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Reach out directly via Call, WhatsApp, or email, or submit your requirements using the sprint form below. Submissions are instantly routed to the GSJ Admin Command Center.
                </p>
              </div>

              <div className="space-y-3">
                {/* Phone & WhatsApp Card */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Direct Mobile & WhatsApp</div>
                        <div className="text-sm font-mono-code font-bold text-white tracking-wide">{myPhoneDisplay}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyPhone}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copy Phone Number"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${myPhone.replace(/\s+/g, '')}`}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Call</span>
                    </a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Direct Developer Email</div>
                      <a href={`mailto:${myEmail}`} className="text-sm font-mono-code text-white hover:text-cyan-300 transition-colors">
                        {myEmail}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Quick Availability Badge */}
                <div className="p-3.5 rounded-xl bg-[#0d1527] border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Available for freelance contracts, custom web apps & startup MVPs.</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0b1120] border border-slate-800">
              {formSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white font-display">Inquiry Sent &amp; Emailed to GSJ!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you! Your project details have been delivered directly to <span className="text-cyan-400 font-mono-code">{myEmail}</span> and recorded in the GSJ Command Center.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Follow-up on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', email: '', service: 'Business Website', timeline: 'Standard (1-2 Weeks)', message: '' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono-code text-slate-400">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Rivera"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono-code text-slate-400">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@company.com"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono-code text-slate-400">Project Type</label>
                      <select
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option>Gym &amp; Fitness Platform</option>
                        <option>Restaurant &amp; WhatsApp Ordering</option>
                        <option>Creator / Influencer Hub</option>
                        <option>Business Website</option>
                        <option>Landing Page</option>
                        <option>Website Redesign</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono-code text-slate-400">Desired Timeline</label>
                      <select
                        value={formData.timeline}
                        onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option>Standard (1-2 Weeks)</option>
                        <option>Urgent (3-5 Days)</option>
                        <option>Flexible / Planning Phase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono-code text-slate-400">Project Overview &amp; Goals</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you're looking to build..."
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmittingForm ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending &amp; Delivering to GSJ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#060910] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-display">
                GSJ
              </div>
              <div>
                <span className="font-bold text-white font-display text-sm">GSJ Web Development</span>
                <p className="text-slate-500 text-xs">High-performance modern websites & web platforms</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono-code">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp ({myPhoneDisplay})</span>
              </a>
              <a href={`tel:${myPhone.replace(/\s+/g, '')}`} className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call ({myPhoneDisplay})</span>
              </a>
              <a href={`mailto:${myEmail}`} className="hover:text-white flex items-center gap-1.5 transition-colors">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{myEmail}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span>© 2026 GSJ. All rights reserved. • Built for speed &amp; conversions.</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 font-mono-code">Main: gsj.dev • App: app.gsj.dev</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('gsj_open_cookie_preferences'))}
                className="text-slate-400 hover:text-cyan-400 font-mono-code transition-colors"
              >
                Cookie Preferences
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono-code transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Quick Action Contact Widget (WhatsApp & Call) */}
      <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <a
          href={whatsappUrl}
          onClick={() => handleOpenWhatsApp('floating_widget')}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
          title="Chat with GSJ on WhatsApp (+91 8699979370)"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline font-mono-code">Chat on WhatsApp</span>
        </a>
      </aside>

      {/* Privacy & Cookie Consent Banner */}
      <CookieBanner />

      {/* Interactive Project Modal Preview */}
      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projectsList}
        inquiries={inquiries}
        onToggleInquiryRead={toggleInquiryRead}
        onDeleteInquiry={deleteInquiry}
        onDeleteProject={deleteProject}
        onAddProject={addProject}
        onAddMilestone={addMilestone}
      />
    </div>
  );
}
