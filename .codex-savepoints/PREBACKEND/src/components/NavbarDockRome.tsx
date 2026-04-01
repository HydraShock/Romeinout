import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import './NavbarDockRome.css';

type NavItem = {
  id: 'tour' | 'esperienze' | 'galleria';
  href: string;
  label: string;
};

type RouteStyle = {
  left: number;
  width: number;
  visible: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'tour', href: '#tour', label: 'Tour' },
  { id: 'esperienze', href: '#tour', label: 'Esperienze' },
  { id: 'galleria', href: '#galleria', label: 'Galleria' },
];

const NAV_SCROLL_OFFSET = 96;

function getDesktopState() {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth >= 768;
}

function getActiveFromHash(): NavItem['id'] {
  if (typeof window === 'undefined') {
    return 'tour';
  }

  const hash = window.location.hash;
  if (hash === '#galleria') {
    return 'galleria';
  }

  return 'tour';
}

export default function NavbarDockRome() {
  const [isDesktop, setIsDesktop] = useState(getDesktopState);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem['id']>(getActiveFromHash);
  const [hoveredItem, setHoveredItem] = useState<NavItem['id'] | null>(null);
  const [routeStyle, setRouteStyle] = useState<RouteStyle>({ left: 0, width: 0, visible: false });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  const linksRailRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<NavItem['id'], HTMLAnchorElement | null>>({
    tour: null,
    esperienze: null,
    galleria: null,
  });

  const targetIndicatorId = hoveredItem ?? activeItem;

  const updateRouteIndicator = useCallback((itemId: NavItem['id'] | null) => {
    if (typeof window === 'undefined' || window.innerWidth < 768 || !itemId) {
      setRouteStyle((current) => ({ ...current, visible: false }));
      return;
    }

    const rail = linksRailRef.current;
    const target = linkRefs.current[itemId];

    if (!rail || !target) {
      return;
    }

    const railRect = rail.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    setRouteStyle({
      left: targetRect.left - railRect.left,
      width: targetRect.width,
      visible: true,
    });
  }, []);

  const smoothScrollToHash = useCallback(
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

      const top = window.scrollY + target.getBoundingClientRect().top - NAV_SCROLL_OFFSET;
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setPrefersReducedMotion(media.matches);

    syncMotion();
    media.addEventListener('change', syncMotion);

    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncDesktop = () => {
      const desktop = getDesktopState();
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
      }
    };

    syncDesktop();
    window.addEventListener('resize', syncDesktop, { passive: true });

    return () => window.removeEventListener('resize', syncDesktop);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === '#galleria') {
        setActiveItem('galleria');
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    updateRouteIndicator(targetIndicatorId);

    if (typeof window === 'undefined') {
      return undefined;
    }

    const onResize = () => updateRouteIndicator(targetIndicatorId);
    window.addEventListener('resize', onResize, { passive: true });

    return () => window.removeEventListener('resize', onResize);
  }, [targetIndicatorId, updateRouteIndicator]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const rail = linksRailRef.current;
    if (!rail) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateRouteIndicator(targetIndicatorId);
    });

    observer.observe(rail);
    NAV_ITEMS.forEach((item) => {
      const node = linkRefs.current[item.id];
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [targetIndicatorId, updateRouteIndicator]);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, item: NavItem, closeMobile = false) => {
      event.preventDefault();
      setActiveItem(item.id);
      if (closeMobile) {
        setMobileOpen(false);
      }
      smoothScrollToHash(item.href);
    },
    [smoothScrollToHash]
  );

  const handleLogoClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setActiveItem('tour');
      smoothScrollToHash('#home');
    },
    [smoothScrollToHash]
  );

  const handleCtaClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setMobileOpen(false);
      smoothScrollToHash('#prenota');
    },
    [smoothScrollToHash]
  );

  const ctaStyle = useMemo(
    () =>
      ({
        '--mx': `${magnet.x.toFixed(2)}px`,
        '--my': `${magnet.y.toFixed(2)}px`,
      }) as CSSProperties,
    [magnet.x, magnet.y]
  );

  return (
    <header
      className={`navdock-root ${isScrolled ? 'is-scrolled' : ''} ${prefersReducedMotion ? 'is-reduced' : ''}`}
    >
      <div className="navdock-shell">
        <div className="navdock-border">
          <nav className="navdock-pill" aria-label="Main navigation">
            <div className="navdock-skyline" aria-hidden="true">
              <svg viewBox="0 0 960 120" role="img" focusable="false">
                <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 98 H950" />
                  <path d="M56 98 v-24 h44 v24" />
                  <path d="M70 74 c0-18 20-30 42-30 22 0 42 12 42 30" />
                  <path d="M220 98 v-20 h28 v20" />
                  <path d="M262 98 v-26 h34 v26" />
                  <path d="M336 98 v-18 h24 v18" />
                  <path d="M500 98 v-38 h30 v38" />
                  <path d="M515 60 c0-30 24-52 52-52s52 22 52 52" />
                  <path d="M670 98 v-24 h30 v24" />
                  <path d="M726 98 v-18 h22 v18" />
                  <path d="M784 98 v-28 h34 v28" />
                </g>
              </svg>
            </div>

            <a
              className="navdock-brand"
              href="#home"
              onClick={handleLogoClick}
              aria-label="Vai alla sezione Home"
            >
              <span className="navdock-brand-icon" aria-hidden="true">
                {'\u{1F6FA}'}
              </span>
              <span className="navdock-brand-text">RomeInOut</span>
            </a>

            <div className="navdock-links" ref={linksRailRef} aria-label="Navigazione sezione">
              <span className="navdock-route-base" aria-hidden="true" />
              <span className="navdock-route-shimmer" aria-hidden="true" />
              <span
                className={`navdock-route-dot ${routeStyle.visible && isDesktop ? 'is-visible' : ''}`}
                aria-hidden="true"
                style={{ left: `${routeStyle.left + routeStyle.width / 2}px` }}
              />

              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  ref={(node) => {
                    linkRefs.current[item.id] = node;
                  }}
                  href={item.href}
                  className={`navdock-link ${activeItem === item.id ? 'is-active' : ''}`}
                  onClick={(event) => handleNavClick(event, item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="navdock-actions">
              <a
                href="#prenota"
                className="navdock-cta"
                onClick={handleCtaClick}
                onMouseMove={(event) => {
                  if (prefersReducedMotion || !isDesktop || window.innerWidth < 1024) {
                    return;
                  }

                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
                  const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

                  setMagnet({
                    x: Math.max(-1, Math.min(1, x)) * 2.4,
                    y: Math.max(-1, Math.min(1, y)) * 1.8,
                  });
                }}
                onMouseLeave={() => setMagnet({ x: 0, y: 0 })}
                style={ctaStyle}
              >
                <span className="navdock-cta-label">Prenota Ora</span>
                <span className="navdock-cta-arrow" aria-hidden="true">
                  {'\u2192'}
                </span>
              </a>

              <button
                type="button"
                className={`navdock-menu-btn ${mobileOpen ? 'is-open' : ''}`}
                aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
                aria-expanded={mobileOpen}
                aria-controls="navdock-mobile-panel"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>

        {!isDesktop && mobileOpen ? (
          <div className="navdock-mobile-panel" id="navdock-mobile-panel">
            {NAV_ITEMS.map((item) => (
              <a
                key={`mobile-${item.id}`}
                href={item.href}
                className={`navdock-mobile-link ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={(event) => handleNavClick(event, item, true)}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
