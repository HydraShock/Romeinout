import { useEffect, useState } from 'react';
import './CookieBanner.css';

const STORAGE_KEY = 'cookieConsent';

function CookieIconFallback() {
  return (
    <svg viewBox="0 0 72 72" className="cookie-banner-icon" aria-hidden="true">
      <defs>
        <radialGradient id="cookieFill" cx="36%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="48%" stopColor="#F3C765" />
          <stop offset="100%" stopColor="#B8781A" />
        </radialGradient>
        <linearGradient id="cookieStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8D88E" />
          <stop offset="100%" stopColor="#9A5A15" />
        </linearGradient>
      </defs>
      <path
        d="M36 7c16 0 29 13 29 29S52 65 36 65 7 52 7 36c0-2 1-4 3-4 4 0 7-3 7-7 0-4 3-7 7-7 4 0 7-3 7-7 0-2 2-4 5-4Z"
        fill="url(#cookieFill)"
        stroke="url(#cookieStroke)"
        strokeWidth="2.4"
      />
      <circle cx="23" cy="23" r="4.3" fill="#8A4E19" />
      <circle cx="43" cy="21" r="5.6" fill="#7A4214" />
      <circle cx="20" cy="42" r="5.2" fill="#8D531F" />
      <circle cx="36" cy="37" r="6.2" fill="#7A3E12" />
      <circle cx="49" cy="45" r="4.7" fill="#915522" />
    </svg>
  );
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedConsent = window.localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (!showBanner || typeof window === 'undefined') {
      return;
    }

    const frameId = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frameId);
  }, [showBanner]);

  const saveConsent = (value: 'accepted' | 'rejected') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setEntered(false);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    console.log('Cookie customize placeholder');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-banner-shell">
      <aside role="dialog" aria-label="Cookie consent banner" className={`cookie-banner ${entered ? 'is-visible' : ''}`}>
        <span aria-hidden="true" className="cookie-banner-marble" />

        <div className="cookie-banner-content">
          <div className="cookie-banner-copy-wrap">
            <div className="cookie-banner-icon-wrap">
              <CookieIconFallback />
            </div>

            <div className="cookie-banner-copy">
              <h3>I nostri partner utilizzano cookie</h3>
              <p>
                I nostri partner usano i cookie per fornirci informazioni sul marketing e sito. Scopri di piu e
                personalizza le tue preferenze oppure accetta di continuare la navigazione. Leggi la nostra{' '}
                <a href="/cookie-policy">Cookie Policy</a> e <a href="/privacy-policy">Privacy Policy</a>.
              </p>
            </div>
          </div>

          <div className="cookie-banner-actions">
            <button type="button" onClick={() => saveConsent('rejected')} className="cookie-banner-btn cookie-banner-btn-secondary">
              Rifiuta
            </button>

            <button type="button" onClick={handleCustomize} className="cookie-banner-btn cookie-banner-btn-customize">
              Personalizza...
            </button>

            <button type="button" onClick={() => saveConsent('accepted')} className="cookie-banner-btn cookie-banner-btn-primary">
              <span>Accetta -&gt;</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
