import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';

type NavItem = {
  id: 'tour' | 'esperienze' | 'galleria';
  href: string;
  label: string;
};

type IndicatorState = {
  left: number;
  width: number;
  visible: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'tour', href: '#tour', label: 'Tour' },
  { id: 'esperienze', href: '#tour', label: 'Esperienze' },
  { id: 'galleria', href: '#galleria', label: 'Galleria' },
];

const SCROLL_OFFSET = 96;

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

  if (window.location.hash === '#galleria') {
    return 'galleria';
  }

  return 'tour';
}

export default function NavbarMarbleLuxury() {
  const [isDesktop, setIsDesktop] = useState(getDesktop);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem['id']>(getActiveItemFromHash);
  const [hoveredItem, setHoveredItem] = useState<NavItem['id'] | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorState>({ left: 0, width: 0, visible: false });

  const linksRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<NavItem['id'], HTMLAnchorElement | null>>({
    tour: null,
    esperienze: null,
    galleria: null,
  });

  const targetItem = hoveredItem ?? activeItem;

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

  return (
    <header
      className={`marble-nav-root ${isScrolled ? 'is-scrolled' : ''} ${
        prefersReducedMotion ? 'is-reduced-motion' : ''
      }`}
    >
      <div className="marble-nav-frame">
        <nav className="marble-nav-pill" aria-label="Main navigation">
          <span className="marble-nav-veins" aria-hidden="true" />
          <span className="marble-nav-grain" aria-hidden="true" />
          <span className="marble-nav-light" aria-hidden="true" />
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
                {item.label}
              </a>
            ))}
          </div>

          <div className="marble-nav-actions">
            <a href="#prenota" className="marble-nav-cta" onClick={handleCtaClick}>
              <span className="marble-nav-cta-label">Prenota Ora</span>
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
            {NAV_ITEMS.map((item) => (
              <a
                key={`mobile-${item.id}`}
                href={item.href}
                className={`marble-nav-mobile-link ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={(event) => handleLinkClick(event, item, true)}
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
