import React, { useState } from 'react';
import { Project } from '../types';
import {
  X,
  Dumbbell,
  Utensils,
  Video,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Plus,
  Minus,
  MessageSquare,
  ShoppingBag,
  Calculator,
  User,
  Users,
  Eye,
  Award,
  Play,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  // Gym Demo State
  const [gymBilling, setGymBilling] = useState<'monthly' | 'annual'>('monthly');
  const [gymHeight, setGymHeight] = useState('175');
  const [gymWeight, setGymWeight] = useState('72');
  const [bmiResult, setBmiResult] = useState<string | null>(null);
  const [passClaimed, setPassClaimed] = useState(false);

  // Restaurant Demo State
  const [menuTab, setMenuTab] = useState<'all' | 'mains' | 'specialty' | 'desserts'>('all');
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [resDate, setResDate] = useState('Today at 7:30 PM');
  const [resGuests, setResGuests] = useState('2 Guests');
  const [resConfirmed, setResConfirmed] = useState(false);

  // Influencer / Creator Demo State
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [brandSponsorSubmitted, setBrandSponsorSubmitted] = useState(false);

  // Calculate Gym BMI
  const handleCalcBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(gymHeight) / 100;
    const w = parseFloat(gymWeight);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      setBmiResult(bmi);
    }
  };

  // Restaurant Cart
  const menuItems = [
    { id: '1', name: 'Smoked Truffle Risotto', cat: 'mains', price: 18, tag: 'Chef Favorite', cal: '520 kcal' },
    { id: '2', name: 'Wood-Fired Ribeye Steak', cat: 'mains', price: 26, tag: 'Signature Meat', cal: '680 kcal' },
    { id: '3', name: 'Charred Salmon with Citrus Butter', cat: 'specialty', price: 22, tag: 'Gluten Free', cal: '490 kcal' },
    { id: '4', name: 'Artisan Burrata Salad', cat: 'specialty', price: 14, tag: 'Vegetarian', cal: '380 kcal' },
    { id: '5', name: 'Dark Molten Lava Cake', cat: 'desserts', price: 10, tag: 'Sweet Finish', cal: '440 kcal' },
    { id: '6', name: 'Pistachio Gelato Crunch', cat: 'desserts', price: 9, tag: 'House Special', cal: '320 kcal' },
  ];

  const filteredMenu = menuItems.filter(item => menuTab === 'all' || item.cat === menuTab);

  const addToCart = (id: string) => {
    setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price * Number(qty) : 0);
  }, 0);

  // Influencer Data
  const creatorVideos = [
    { title: 'Building a 7-Figure Tech Startup in 30 Days', views: '240K views', length: '18:42', tag: 'Startup' },
    { title: 'My Minimalist Desk Setup & Developer Workflow (2026)', views: '185K views', length: '12:15', tag: 'Productivity' },
    { title: 'Coding a Full-Stack Web App Live from Scratch', views: '310K views', length: '45:10', tag: 'Coding' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0b1120] border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto my-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-[#0d1527]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {project.iconType === 'gym' && <Dumbbell className="w-5 h-5" />}
              {project.iconType === 'restaurant' && <Utensils className="w-5 h-5" />}
              {project.iconType === 'creator' && <Video className="w-5 h-5" />}
              {project.iconType !== 'gym' && project.iconType !== 'restaurant' && project.iconType !== 'creator' && <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">{project.title}</h3>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-slate-400">{project.category}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8 flex-1">
          {/* ============================================================ */}
          {/* 1. GYM WEBSITE DEMO VIEW */}
          {/* ============================================================ */}
          {project.iconType === 'gym' && (
            <div className="space-y-8">
              {/* Hero Banner inside preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-900/40 via-orange-900/30 to-slate-900 border border-red-500/30 relative overflow-hidden">
                <div className="relative z-10 space-y-3 max-w-xl">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono-code border border-red-500/30">
                    TRANSFORM YOUR PHYSIQUE
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                    IronForge Performance & Athletic Club
                  </h4>
                  <p className="text-sm text-slate-300">
                    State-of-the-art strength equipment, Olympic lifting zones, functional turf, and elite coaching.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setPassClaimed(true)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{passClaimed ? '✓ 1-Day Pass Confirmed!' : 'Claim Free 1-Day Pass'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Membership Pricing Matrix */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-bold text-white font-display">Membership Plans</h5>
                    <p className="text-xs text-slate-400">Transparent pricing with no hidden joining fees.</p>
                  </div>
                  <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-code">
                    <button
                      onClick={() => setGymBilling('monthly')}
                      className={`px-3 py-1 rounded-md transition-all ${gymBilling === 'monthly' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400'}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setGymBilling('annual')}
                      className={`px-3 py-1 rounded-md transition-all ${gymBilling === 'annual' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400'}`}
                    >
                      Annual (-20%)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-mono-code text-slate-400">STARTER</span>
                      <div className="text-2xl font-black text-white font-display">
                        ${gymBilling === 'monthly' ? '39' : '32'}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-slate-400">Gym floor access during off-peak hours.</p>
                      <div className="pt-2 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Standard Gym Access</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Locker & Shower Access</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900/90 border-2 border-red-500/40 relative flex flex-col justify-between shadow-lg shadow-red-500/10">
                    <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold text-white uppercase">
                      Most Popular
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-mono-code text-red-400">PRO ATHLETE</span>
                      <div className="text-2xl font-black text-white font-display">
                        ${gymBilling === 'monthly' ? '69' : '55'}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-slate-400">24/7 unlimited access + sauna and class pass.</p>
                      <div className="pt-2 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 24/7 All-Access</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Group HIIT & Yoga</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Infrared Sauna & Recovery</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-mono-code text-purple-400">ELITE COACHING</span>
                      <div className="text-2xl font-black text-white font-display">
                        ${gymBilling === 'monthly' ? '129' : '105'}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-slate-400">Personal trainer guidance + customized nutrition plan.</p>
                      <div className="pt-2 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Everything in Pro</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 4x 1-on-1 PT Sessions/mo</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Custom Macro Coaching</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive BMI Tool in Gym Demo */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-400" />
                  <h5 className="text-sm font-bold text-white">Live Gym Tool: Interactive BMI Calculator</h5>
                </div>
                <form onSubmit={handleCalcBMI} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Height (cm)</label>
                    <input
                      type="number"
                      value={gymHeight}
                      onChange={e => setGymHeight(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono-code text-slate-400">Weight (kg)</label>
                    <input
                      type="number"
                      value={gymWeight}
                      onChange={e => setGymWeight(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition-colors"
                  >
                    Calculate BMI
                  </button>
                </form>
                {bmiResult && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs flex items-center justify-between">
                    <span className="text-slate-300">Your Body Mass Index (BMI): <strong className="text-red-400 text-sm">{bmiResult}</strong></span>
                    <span className="text-emerald-400 font-medium">Optimal Athletic Target</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. RESTAURANT WEBSITE DEMO VIEW */}
          {/* ============================================================ */}
          {project.iconType === 'restaurant' && (
            <div className="space-y-8">
              {/* Header Promo */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-slate-900 border border-amber-500/30 space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono-code border border-amber-500/30">
                  CONTEMPORARY CULINARY DINING
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Aura & Flame Bistro
                </h4>
                <p className="text-sm text-slate-300">
                  Artisanal wood-fired cuisine, organic ingredients, and curated craft cocktails.
                </p>
              </div>

              {/* Menu & Cart System */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Menu Items */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h5 className="text-base font-bold text-white font-display">Digital Culinary Menu</h5>
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-code">
                      <button
                        onClick={() => setMenuTab('all')}
                        className={`px-2.5 py-1 rounded-md ${menuTab === 'all' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setMenuTab('mains')}
                        className={`px-2.5 py-1 rounded-md ${menuTab === 'mains' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
                      >
                        Mains
                      </button>
                      <button
                        onClick={() => setMenuTab('specialty')}
                        className={`px-2.5 py-1 rounded-md ${menuTab === 'specialty' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
                      >
                        Specialty
                      </button>
                      <button
                        onClick={() => setMenuTab('desserts')}
                        className={`px-2.5 py-1 rounded-md ${menuTab === 'desserts' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
                      >
                        Desserts
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredMenu.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h6 className="font-bold text-white text-xs">{item.name}</h6>
                            <span className="text-amber-400 font-bold text-xs">${item.price}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{item.tag}</span>
                            <span className="text-[10px] text-slate-500">{item.cal}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: WhatsApp Takeout Cart */}
                <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>Takeout Order Cart</span>
                      </div>
                      <span className="text-[11px] font-mono-code text-slate-400">
                        {Object.values(cartItems).reduce((a: number, b: number) => a + b, 0)} items
                      </span>
                    </div>

                    {Object.keys(cartItems).length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">Your order cart is empty. Click "+ Add to Order" to test the WhatsApp cart workflow.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {Object.entries(cartItems).map(([id, qty]) => {
                          const item = menuItems.find(m => m.id === id);
                          if (!item) return null;
                          return (
                            <div key={id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
                              <span className="text-slate-300 truncate max-w-[120px]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(id)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                                <span className="font-mono-code text-white">{qty}</span>
                                <button onClick={() => addToCart(id)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Total:</span>
                      <span className="text-amber-400 text-sm font-mono-code">${totalCartPrice}</span>
                    </div>
                    <a
                      href={`https://wa.me/918699979370?text=${encodeURIComponent(`Hello GSJ / Aura & Flame! I'd like to place an order for: ${Object.entries(cartItems).map(([id, qty]) => { const item = menuItems.find(m => m.id === id); return `${qty}x ${item?.name || ''}`; }).join(', ')} - Total: $${totalCartPrice}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all ${totalCartPrice === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Order via WhatsApp ($ {totalCartPrice})</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Table Booking Demo */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Table Reservation Engine</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Simulate booking a dinner table at the bistro.</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={resGuests}
                    onChange={e => setResGuests(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6+ Party</option>
                  </select>
                  <button
                    onClick={() => setResConfirmed(true)}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors"
                  >
                    {resConfirmed ? '✓ Table Reserved!' : 'Reserve Table'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. YOUTUBER / CREATOR PORTAL DEMO VIEW */}
          {/* ============================================================ */}
          {project.iconType === 'creator' && (
            <div className="space-y-8">
              {/* Creator Hero Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900 border border-purple-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-xl">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-purple-300">
                        KM
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-extrabold text-white font-display">Kairo Media</h4>
                        <span className="p-0.5 rounded-full bg-blue-500 text-white"><Check className="w-3 h-3" /></span>
                      </div>
                      <p className="text-xs text-slate-400">Tech Entrepreneur, Developer & Content Creator</p>
                      <p className="text-[11px] font-mono-code text-purple-300 mt-0.5">380K Subscribers • 42M Channel Views</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById('sponsor-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Brand Collaboration</span>
                  </button>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-500/20">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center">
                    <div className="text-lg font-black text-purple-400 font-display">380K+</div>
                    <div className="text-[10px] text-slate-400">YouTube Subs</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center">
                    <div className="text-lg font-black text-pink-400 font-display">1.4M</div>
                    <div className="text-[10px] text-slate-400">Monthly Impressions</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center">
                    <div className="text-lg font-black text-cyan-400 font-display">68%</div>
                    <div className="text-[10px] text-slate-400">US / EU Demographics</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center">
                    <div className="text-lg font-black text-emerald-400 font-display">8.4%</div>
                    <div className="text-[10px] text-slate-400">Avg Engagement Rate</div>
                  </div>
                </div>
              </div>

              {/* Video Showcase Grid */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-400" />
                  <span>Featured Videos & Case Studies</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {creatorVideos.map((vid, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        activeVideoIndex === idx
                          ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/20'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="h-24 rounded-lg bg-slate-950 flex items-center justify-center relative overflow-hidden group">
                        <div className="w-8 h-8 rounded-full bg-purple-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono-code text-white">
                          {vid.length}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <h6 className="text-xs font-bold text-white line-clamp-2">{vid.title}</h6>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{vid.views}</span>
                          <span className="text-purple-400">{vid.tag}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Sponsorship Form */}
              <div id="sponsor-form" className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">Brand Sponsorship Proposal Engine</h5>
                    <p className="text-xs text-slate-400">Simulate how sponsors submit video and newsletter inquiries.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono-code border border-purple-500/20">
                    Sponsor Funnel
                  </span>
                </div>

                {brandSponsorSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h6 className="text-sm font-bold text-white">Sponsorship Inquiry Received!</h6>
                    <p className="text-xs text-slate-300">Media kit and rate card automatically dispatched to your brand email.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      setBrandSponsorSubmitted(true);
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <div>
                      <label className="text-[11px] font-mono-code text-slate-400">Company / Brand Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Supabase, Notion, NordVPN"
                        required
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono-code text-slate-400">Campaign Deliverable</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white">
                        <option>60s Dedicated Video Integration</option>
                        <option>30s Mid-Roll Integration</option>
                        <option>Newsletter Spotlight + Tweet Thread</option>
                        <option>Full Product Review Video</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        Submit Brand Sponsorship Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Project Details Footer */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-mono-code text-slate-400 uppercase tracking-wider">
              Project Architecture & Key Features
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {project.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 bg-[#0d1527] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono-code text-cyan-400">{project.duration}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Interactive Preview
          </button>
        </div>
      </div>
    </div>
  );
};
