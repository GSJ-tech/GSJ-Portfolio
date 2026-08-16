import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Check, X, Sliders, ChevronRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const CONSENT_STORAGE_KEY = 'gsj_cookie_consent_v1';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  performance: boolean;
  timestamp: string;
}

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    performance: true,
    timestamp: ''
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        // Delay showing banner slightly for smooth UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        setPreferences(JSON.parse(saved));
      }
    } catch {
      setIsVisible(true);
    }

    // Listen for custom event to open preferences from footer
    const handleOpen = () => {
      setShowModal(true);
      setIsVisible(true);
    };
    window.addEventListener('gsj_open_cookie_preferences', handleOpen);
    return () => window.removeEventListener('gsj_open_cookie_preferences', handleOpen);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const data = { ...prefs, timestamp: new Date().toISOString() };
    setPreferences(data);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
    setIsVisible(false);
    setShowModal(false);
    trackEvent('pageview', 'consent_updated', 'privacy', { analyticsAllowed: prefs.analytics });
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      performance: true,
      timestamp: ''
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      performance: false,
      timestamp: ''
    });
  };

  if (!isVisible && !showModal) return null;

  return (
    <>
      {/* Floating Bottom Toast Banner */}
      {!showModal && (
        <aside 
          aria-label="Cookie and Privacy Consent" 
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Privacy &amp; Cookie Consent
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use cookies and privacy-friendly telemetry to analyze traffic, enhance demo performance, and personalize interactions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors border border-slate-700"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Manage Cookie Preferences"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Detailed Modal Settings */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-display">Cookie & Privacy Preferences</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Essential */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Strictly Necessary Cookies</div>
                  <p className="text-slate-400 mt-0.5">Required for core website navigation, admin authentication, and security.</p>
                </div>
                <span className="text-[11px] font-mono-code font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-md">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Product Analytics & Telemetry</div>
                  <p className="text-slate-400 mt-0.5">Helps us evaluate demo usage, popular stack inquiries, and UI engagement.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={e => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* Performance */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Performance & Local Cache</div>
                  <p className="text-slate-400 mt-0.5">Stores your demo cart items, theme preferences, and onboarding progress.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={e => setPreferences(p => ({ ...p, performance: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => saveConsent(preferences)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
