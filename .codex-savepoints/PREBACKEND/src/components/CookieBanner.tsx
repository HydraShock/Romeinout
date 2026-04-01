import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookieConsent';

function CookieIconFallback() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16 drop-shadow-[0_10px_18px_rgba(104,61,16,0.35)]" aria-hidden="true">
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
  const [cookieImageError, setCookieImageError] = useState(false);

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
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-3">
      <aside
        role="dialog"
        aria-label="Cookie consent banner"
        className={[
          'relative overflow-hidden rounded-3xl border-2 border-[#D4A85F] ring-1 ring-[#E7C27D]/60',
          'bg-gradient-to-br from-white/75 via-white/60 to-[#f3e6d8]/70 backdrop-blur-xl',
          'shadow-[0_35px_80px_-35px_rgba(60,30,10,0.65)] shadow-inner',
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:border before:border-[#F1D29B]/40 before:content-['']",
          'transform transition-all duration-500 ease-out',
          entered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"
          style={{
            backgroundImage: 'url("/textures/marble-base.webp"), url("/textures/marble-veins.webp")',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
          }}
        />

        <div className="relative flex items-center justify-between gap-8 px-8 py-6 max-lg:flex-col max-lg:items-start max-lg:gap-6">
          <div className="flex items-start gap-5">
            <div className="shrink-0 pt-1">
              {!cookieImageError ? (
                <img
                  src="/assets/cookie-gold.png"
                  alt="Cookie"
                  className="h-16 w-16 object-contain drop-shadow-[0_10px_18px_rgba(104,61,16,0.35)]"
                  onError={() => setCookieImageError(true)}
                />
              ) : (
                <CookieIconFallback />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#2B201A]">I nostri partner utilizzano cookie</h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                I nostri partner usano i cookie per fornirci informazioni sul marketing e sito. Scopri di piu e
                personalizza le tue preferenze oppure accetta di continuare la navigazione. Leggi la nostra{' '}
                <a href="/cookie-policy" className="font-semibold text-[#C17F2C] hover:underline">
                  Cookie Policy
                </a>{' '}
                e{' '}
                <a href="/privacy-policy" className="font-semibold text-[#C17F2C] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 max-lg:w-full max-lg:flex-wrap">
            <button
              type="button"
              onClick={() => saveConsent('rejected')}
              className="rounded-full border border-[#E2C8A3] bg-white/60 px-6 py-3 text-[#3a2a1f] transition duration-200 hover:bg-white/80"
            >
              Rifiuta
            </button>

            <button
              type="button"
              onClick={handleCustomize}
              className="rounded-full border border-[#d6b88f] bg-[#f6ebdd]/75 px-6 py-3 text-[#3a2a1f] transition duration-200 hover:bg-[#fff4e7]"
            >
              Personalizza...
            </button>

            <button
              type="button"
              onClick={() => saveConsent('accepted')}
              className="rounded-full bg-gradient-to-r from-[#D6A94E] via-[#F0C87A] to-[#C7922E] px-6 py-3 font-semibold text-white shadow-[0_12px_30px_-12px_rgba(214,169,78,0.8)] transition duration-200 hover:brightness-105 active:translate-y-[1px]"
            >
              <span className="inline-flex items-center gap-2">
                Accetta
                <span aria-hidden="true">→</span>
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
