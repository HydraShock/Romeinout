import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'tour', href: '#tour', label: 'Tour' },
  { id: 'esperienze', href: '#tour', label: 'Esperienze' },
  { id: 'galleria', href: '#galleria', label: 'Galleria' },
  { id: 'contatti', href: '#contatti', label: 'Contatti' },
];

const ACTIVE_PILL_TRANSITION = {
  type: 'spring',
  stiffness: 520,
  damping: 36,
  mass: 0.62,
};

const NAV_SCROLL_OFFSET = 96;

function getIsDesktop() {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth >= 900;
}

export default function Navbar() {
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('tour');
  const [hoveredItem, setHoveredItem] = useState(null);

  const { scrollY } = useScroll();
  const navScale = useTransform(scrollY, [0, 220], [1, 0.94]);
  const navY = useTransform(scrollY, [0, 220], [0, -5]);
  const navPadY = useTransform(scrollY, [0, 220], [10, 7]);
  const navPadX = useTransform(scrollY, [0, 220], [16, 12]);
  const blurPx = useTransform(scrollY, [0, 220], [18, 26]);
  const bgAlpha = useTransform(scrollY, [0, 220], [0.72, 0.84]);
  const borderAlpha = useTransform(scrollY, [0, 220], [0.34, 0.56]);
  const depthAlpha = useTransform(scrollY, [0, 220], [0.18, 0.33]);
  const glowAlpha = useTransform(scrollY, [0, 220], [0.2, 0.3]);

  const navBg = useMotionTemplate`rgba(255,255,255,${bgAlpha})`;
  const navBorder = useMotionTemplate`rgba(255,255,255,${borderAlpha})`;
  const navBlur = useMotionTemplate`blur(${blurPx}px)`;
  const navShadow = useMotionTemplate`0 14px 30px rgba(19,28,43,${depthAlpha}), 0 0 28px rgba(255,136,40,${glowAlpha})`;

  useEffect(() => {
    const syncViewport = () => {
      const desktop = getIsDesktop();
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
      }
    };

    syncViewport();
    window.addEventListener('resize', syncViewport, { passive: true });
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const smoothScrollToHash = (hash) => {
    if (typeof window === 'undefined') {
      return;
    }

    const normalizedHash = hash && hash.startsWith('#') ? hash : `#${hash || ''}`;
    const target = document.querySelector(normalizedHash);

    if (!target) {
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top - NAV_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    if (window.history?.pushState) {
      window.history.pushState(null, '', normalizedHash);
    } else {
      window.location.hash = normalizedHash;
    }
  };

  const handleNavClick = (event, { itemId, href, closeMobile = false } = {}) => {
    event.preventDefault();

    if (itemId) {
      setActiveItem(itemId);
    }
    if (closeMobile) {
      setMobileOpen(false);
    }

    smoothScrollToHash(href);
  };

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      const match = NAV_ITEMS.find((item) => item.href === hash);
      if (match) {
        setActiveItem(match.id);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  return (
    <div
      className="fixed left-1/2 top-[14px] z-[120] w-[min(1080px,calc(100%-24px))] -translate-x-1/2"
      style={{
        position: 'fixed',
        left: '50%',
        top: 14,
        transform: 'translateX(-50%)',
        width: 'min(1080px, calc(100% - 24px))',
        zIndex: 120,
      }}
    >
      <motion.nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderRadius: 999,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: navBorder,
          backgroundColor: navBg,
          backdropFilter: navBlur,
          boxShadow: navShadow,
          scale: navScale,
          y: navY,
          paddingTop: navPadY,
          paddingBottom: navPadY,
          paddingLeft: navPadX,
          paddingRight: navPadX,
        }}
        className="rounded-full border bg-white/70 backdrop-blur-xl"
      >
        <a
          href="#home"
          onClick={(event) => handleNavClick(event, { itemId: 'tour', href: '#home', closeMobile: true })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: '#1d2433',
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              fontSize: 16,
              background: 'linear-gradient(145deg, #ffb30f, #f79500)',
              boxShadow: '0 9px 18px rgba(203,117,14,0.32)',
            }}
            aria-hidden="true"
          >
            {'\u{1F6FA}'}
          </span>
          <strong
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.58rem,2.1vw,2rem)',
              lineHeight: 1,
              color: '#f26700',
            }}
          >
            RomeInOut
          </strong>
        </a>

        {isDesktop ? (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGroup id="premium-navbar">
              {NAV_ITEMS.map((item) => {
                const isActive = activeItem === item.id;
                const isHighlighted = isActive || hoveredItem === item.id;

                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, { itemId: item.id, href: item.href })}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem((current) => (current === item.id ? null : current))}
                    whileHover={{ y: -2, color: '#f07a00' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.58 }}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 44,
                      padding: '0 15px',
                      borderRadius: 999,
                      textDecoration: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1.04rem',
                      fontWeight: 600,
                      color: '#455268',
                      overflow: 'hidden',
                    }}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="active-nav-pill"
                        transition={ACTIVE_PILL_TRANSITION}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.65)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.64)',
                        }}
                      />
                    ) : null}

                    <span style={{ position: 'relative', zIndex: 2 }}>{item.label}</span>

                    <motion.span
                      style={{
                        position: 'absolute',
                        left: 15,
                        right: 15,
                        bottom: 8,
                        height: 2,
                        borderRadius: 999,
                        background: '#ff7e00',
                        transformOrigin: '0% 50%',
                        scaleX: isHighlighted ? 1 : 0,
                      }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    />
                  </motion.a>
                );
              })}
            </LayoutGroup>

            <motion.a
              href="#prenota"
              onClick={(event) => handleNavClick(event, { href: '#prenota' })}
              whileHover={{ y: -1.5, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 330, damping: 20, mass: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 46,
                borderRadius: 999,
                padding: '0 22px',
                textDecoration: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(90deg, #ff9000 0%, #e21b00 100%)',
                boxShadow: '0 12px 24px rgba(210,68,7,0.36), 0 0 18px rgba(255,128,0,0.28)',
              }}
            >
              Prenota Ora
            </motion.a>
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
            <motion.a
              href="#prenota"
              onClick={(event) => handleNavClick(event, { href: '#prenota', closeMobile: true })}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 40,
                padding: '0 15px',
                borderRadius: 999,
                textDecoration: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '0.96rem',
                color: '#fff',
                background: 'linear-gradient(90deg, #ff9000 0%, #e21b00 100%)',
                boxShadow: '0 10px 18px rgba(210,68,7,0.32)',
              }}
            >
              Prenota
            </motion.a>

            <button
              type="button"
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              style={{
                width: 40,
                height: 40,
                border: '1px solid rgba(245,135,16,0.35)',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.68)',
                color: '#ff8a00',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </motion.nav>

      <AnimatePresence>
        {!isDesktop && mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              marginTop: 10,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 16px 34px rgba(13,20,33,0.22), 0 0 22px rgba(255,139,33,0.2)',
              backdropFilter: 'blur(18px)',
              overflow: 'hidden',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={`mobile-${item.id}`}
                href={item.href}
                onClick={(event) =>
                  handleNavClick(event, { itemId: item.id, href: item.href, closeMobile: true })
                }
                style={{
                  display: 'block',
                  padding: '13px 16px',
                  textDecoration: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: activeItem === item.id ? '#ef7600' : '#455268',
                  borderBottom: '1px solid rgba(207,214,225,0.62)',
                }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
