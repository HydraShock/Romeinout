import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageProvider';

type NavItem = {
  id: 'tour' | 'galleria' | 'contattaci';
  href: string;
  labelKey: 'nav.tours' | 'nav.gallery' | 'nav.contact';
};

type IndicatorState = {
  left: number;
  width: number;
  visible: boolean;
};

type DustParticle = {
  id: string;
  left: number;
  top: number;
  size: number;
  blur: number;
  opacity: number;
  duration: number;
  delay: number;
  variant: 1 | 2 | 3;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'tour', href: '#tour', labelKey: 'nav.tours' },
  { id: 'galleria', href: '#galleria', labelKey: 'nav.gallery' },
  { id: 'contattaci', href: '#contattaci', labelKey: 'nav.contact' },
];

const SCROLL_OFFSET = 96;
const LIGHT_REST_X = 0.72;
const LIGHT_REST_Y = 0.34;
const LIGHT_EASE = 0.082;

const DUST_PARTICLES: DustParticle[] = [
  { id: 'd1', left: 8, top: 24, size: 3, blur: 11, opacity: 0.052, duration: 24, delay: -5, variant: 1 },
  { id: 'd2', left: 16, top: 72, size: 4, blur: 13, opacity: 0.064, duration: 28, delay: -16, variant: 2 },
  { id: 'd3', left: 27, top: 42, size: 2, blur: 9, opacity: 0.046, duration: 20, delay: -2, variant: 3 },
  { id: 'd4', left: 36, top: 62, size: 5, blur: 14, opacity: 0.072, duration: 26, delay: -11, variant: 1 },
  { id: 'd5', left: 48, top: 31, size: 3, blur: 10, opacity: 0.05, duration: 22, delay: -8, variant: 2 },
  { id: 'd6', left: 58, top: 76, size: 6, blur: 16, opacity: 0.078, duration: 30, delay: -19, variant: 3 },
  { id: 'd7', left: 67, top: 22, size: 2, blur: 8, opacity: 0.044, duration: 19, delay: -9, variant: 1 },
  { id: 'd8', left: 78, top: 56, size: 4, blur: 12, opacity: 0.058, duration: 25, delay: -14, variant: 2 },
  { id: 'd9', left: 86, top: 34, size: 3, blur: 9, opacity: 0.047, duration: 21, delay: -6, variant: 3 },
  { id: 'd10', left: 93, top: 68, size: 5, blur: 15, opacity: 0.07, duration: 27, delay: -12, variant: 1 },
];

function getDesktop() {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth >= 768;
}

function getActiveItemFromHash(): NavItem['id'] {
  if (typeof window === 'undefined') {
    return 'tour';
  }

  if (window.location.hash === '#galleria') return 'galleria';
  if (window.location.hash === '#contattaci') return 'contattaci';
  return 'tour';
}

export default function NavbarMarbleLuxury() {
  const { t } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(getDesktop);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem['id']>(getActiveItemFromHash);
  const [hoveredItem, setHoveredItem] = useState<NavItem['id'] | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorState>({ left: 0, width: 0, visible: false });

  const linksRef = useRef<HTMLDivElement | null>(null);
  const navPillRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<NavItem['id'], HTMLAnchorElement | null>>({
    tour: null,
    galleria: null,
    contattaci: null,
  });
  const lightTargetRef = useRef({ x: LIGHT_REST_X, y: LIGHT_REST_Y });
  const lightCurrentRef = useRef({ x: LIGHT_REST_X, y: LIGHT_REST_Y });

  const targetItem = hoveredItem ?? activeItem;
  const depthEnabled = isDesktop && !prefersReducedMotion;

  const moveIndicator = useCallback((itemId: NavItem['id'] | null) => {
    if (!itemId || typeof window === 'undefined' || window.innerWidth < 768) {
      setIndicator((current) => ({ ...current, visible: false }));
      return;
    }

    const rail = linksRef.current;
    const itemNode = itemRefs.current[itemId];

    if (!rail || !itemNode) {
      return;
    }

    const railBox = rail.getBoundingClientRect();
    const itemBox = itemNode.getBoundingClientRect();

    setIndicator({
      left: itemBox.left - railBox.left,
      width: itemBox.width,
      visible: true,
    });
  }, []);

  const scrollToHash = useCallback(
    (hash: string) => {
      if (typeof window === 'undefined') {
        return;
      }

      const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`;
      const target = document.querySelector(normalizedHash);

      if (!target) {
        window.location.hash = normalizedHash;
        return;
      }

      const top = window.scrollY + target.getBoundingClientRect().top - SCROLL_OFFSET;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      if (window.history?.pushState) {
        window.history.pushState(null, '', normalizedHash);
      } else {
        window.location.hash = normalizedHash;
      }
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(media.matches);

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncViewport = () => {
      const desktop = getDesktop();
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
      }
    };

    syncViewport();
    window.addEventListener('resize', syncViewport, { passive: true });

    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncHash = () => {
      setActiveItem(getActiveItemFromHash());
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    moveIndicator(targetItem);

    if (typeof window === 'undefined') {
      return undefined;
    }

    const onResize = () => moveIndicator(targetItem);
    window.addEventListener('resize', onResize, { passive: true });

    return () => window.removeEventListener('resize', onResize);
  }, [targetItem, moveIndicator]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const rail = linksRef.current;
    if (!rail) {
      return undefined;
    }

    const observer = new ResizeObserver(() => moveIndicator(targetItem));

    observer.observe(rail);
    NAV_ITEMS.forEach((item) => {
      const node = itemRefs.current[item.id];
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [targetItem, moveIndicator]);

  const handleLogoClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setActiveItem('tour');
      scrollToHash('#home');
    },
    [scrollToHash]
  );

  const handleLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, item: NavItem, closeMobile = false) => {
      event.preventDefault();
      setActiveItem(item.id);
      if (closeMobile) {
        setMobileOpen(false);
      }
      scrollToHash(item.href);
    },
    [scrollToHash]
  );

  const handleCtaClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setMobileOpen(false);
      scrollToHash('#prenota');
    },
    [scrollToHash]
  );

  const indicatorStyle = useMemo(
    () =>
      ({
        left: `${indicator.left + indicator.width / 2}px`,
      }) as CSSProperties,
    [indicator.left, indicator.width]
  );

  const setLightVars = useCallback((x: number, y: number) => {
    const navPill = navPillRef.current;
    if (!navPill) {
      return;
    }

    navPill.style.setProperty('--lx', x.toFixed(4));
    navPill.style.setProperty('--ly', y.toFixed(4));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!depthEnabled) {
      lightTargetRef.current.x = LIGHT_REST_X;
      lightTargetRef.current.y = LIGHT_REST_Y;
      lightCurrentRef.current.x = LIGHT_REST_X;
      lightCurrentRef.current.y = LIGHT_REST_Y;
      setLightVars(LIGHT_REST_X, LIGHT_REST_Y);
      return undefined;
    }

    let rafId = 0;

    const update = () => {
      const target = lightTargetRef.current;
      const current = lightCurrentRef.current;

      current.x += (target.x - current.x) * LIGHT_EASE;
      current.y += (target.y - current.y) * LIGHT_EASE;

      setLightVars(current.x, current.y);
      rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(rafId);
  }, [depthEnabled, setLightVars]);

  const handlePillMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!depthEnabled) {
        return;
      }

      const box = event.currentTarget.getBoundingClientRect();

      if (box.width <= 0 || box.height <= 0) {
        return;
      }

      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;

      lightTargetRef.current.x = Math.min(1, Math.max(0, x));
      lightTargetRef.current.y = Math.min(1, Math.max(0, y));
    },
    [depthEnabled]
  );

  const handlePillMouseLeave = useCallback(() => {
    lightTargetRef.current.x = LIGHT_REST_X;
    lightTargetRef.current.y = LIGHT_REST_Y;
  }, []);

  return (
    <header
      className={`marble-nav-root ${isScrolled ? 'is-scrolled' : ''} ${
        prefersReducedMotion ? 'is-reduced-motion' : ''
      } ${depthEnabled ? 'is-depth-enabled' : 'is-depth-disabled'}`}
    >
      <div className="marble-nav-frame">
        <nav
          ref={navPillRef}
          className="marble-nav-pill"
          aria-label="Main navigation"
          onMouseMove={handlePillMouseMove}
          onMouseLeave={handlePillMouseLeave}
        >
          <span className="marble-nav-veins" aria-hidden="true" />
          <span className="marble-nav-grain" aria-hidden="true" />
          <span className="marble-nav-light" aria-hidden="true" />
          <span className="marble-nav-depth-spot" aria-hidden="true" />
          <span className="marble-nav-depth-vignette" aria-hidden="true" />
          <span className="marble-nav-dust" aria-hidden="true">
            {DUST_PARTICLES.map((particle) => (
              <span
                key={particle.id}
                className={`marble-nav-dust-particle marble-nav-dust-particle-v${particle.variant}`}
                style={
                  {
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    opacity: particle.opacity,
                    filter: `blur(${particle.blur}px)`,
                    animationDuration: `${particle.duration}s`,
                    animationDelay: `${particle.delay}s`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
          <span className="marble-nav-hover-sweep" aria-hidden="true" />
          <span className="marble-nav-corner marble-nav-corner-tl" aria-hidden="true" />
          <span className="marble-nav-corner marble-nav-corner-tr" aria-hidden="true" />
          <span className="marble-nav-corner marble-nav-corner-bl" aria-hidden="true" />
          <span className="marble-nav-corner marble-nav-corner-br" aria-hidden="true" />
          <span className="marble-nav-bottom-glow" aria-hidden="true" />

          <a href="#home" className="marble-nav-brand" onClick={handleLogoClick} aria-label="Vai alla home">
            <span className="marble-nav-brand-icon" aria-hidden="true">
              {'\u{1F6FA}'}
            </span>
            <span className="marble-nav-brand-text">RomeInOut</span>
          </a>

          <div className="marble-nav-links" ref={linksRef}>
            <span className="marble-nav-route-line" aria-hidden="true" />
            <span
              className={`marble-nav-route-dot ${indicator.visible && isDesktop ? 'is-visible' : ''}`}
              style={indicatorStyle}
              aria-hidden="true"
            />

            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                ref={(node) => {
                  itemRefs.current[item.id] = node;
                }}
                className={`marble-nav-link ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={(event) => handleLinkClick(event, item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {t(item.labelKey)}
              </a>
            ))}
          </div>

          <div className="marble-nav-actions">
            {isDesktop ? <LanguageSwitcher isScrolled={isScrolled} /> : null}

            <a href="#prenota" className="marble-nav-cta" onClick={handleCtaClick}>
              <span className="marble-nav-cta-seal" aria-hidden="true" />
              <span className="marble-nav-cta-label">{t('nav.bookNow')}</span>
              <span aria-hidden="true">{'\u2192'}</span>
            </a>

            <button
              type="button"
              className={`marble-nav-menu-btn ${mobileOpen ? 'is-open' : ''}`}
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobileOpen}
              aria-controls="marble-nav-mobile"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        {!isDesktop && mobileOpen ? (
          <div className="marble-nav-mobile" id="marble-nav-mobile">
            <div className="marble-nav-mobile-lang">
              <LanguageSwitcher isScrolled={isScrolled} inDrawer />
            </div>

            <a href="#prenota" className="marble-nav-mobile-cta" onClick={handleCtaClick}>
              <span className="marble-nav-mobile-cta-label">{t('nav.bookNow')}</span>
              <span aria-hidden="true">{'\u2192'}</span>
            </a>

            {NAV_ITEMS.map((item) => (
              <a
                key={`mobile-${item.id}`}
                href={item.href}
                className={`marble-nav-mobile-link ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={(event) => handleLinkClick(event, item, true)}
              >
                {t(item.labelKey)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
