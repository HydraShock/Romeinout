import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MapPin, Star, X } from 'lucide-react';
import RouteStepCard from './RouteStepCard';
import RouteTimelineMarker from './RouteTimelineMarker';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function ItineraryDrawer({ open, onClose, tourTitle, stops = [] }) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const normalizedStops = useMemo(
    () =>
      stops.map((stop, index) => ({
        ...stop,
        index: stop.index || index + 1,
        isStart: Boolean(stop.isStart || index === 0),
        isMustSee: Boolean(stop.isMustSee),
      })),
    [stops]
  );
  const mustSeeCount = useMemo(
    () => normalizedStops.filter((stop) => stop.isMustSee).length,
    [normalizedStops]
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setHasScrolled(false);
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const container = drawerRef.current;
      if (!container) {
        return;
      }

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Chiudi percorso"
            className="itinerary-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
          />

          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="itinerary-drawer-title"
            className="itinerary-drawer"
            initial={{ x: '100%', scale: 0.985 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ x: '100%', scale: 0.99 }}
            transition={{
              type: 'spring',
              stiffness: 290,
              damping: 27,
              mass: 0.96,
            }}
          >
            <header
              className={`itinerary-header ${hasScrolled ? 'itinerary-header-scrolled' : ''}`}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Chiudi percorso"
                className="itinerary-close-btn"
              >
                <X className="itinerary-close-icon" strokeWidth={2.4} />
              </button>

              <h3 id="itinerary-drawer-title" className="itinerary-title">
                Percorso del Tour
              </h3>
              <p className="itinerary-subtitle">{tourTitle}</p>

              <div className="itinerary-stats">
                <span className="itinerary-stat">
                  <MapPin className="itinerary-stat-icon" strokeWidth={2.3} />
                  {normalizedStops.length} tappe
                </span>
                <span className="itinerary-stat">
                  <Star className="itinerary-stat-icon itinerary-stat-icon-star" strokeWidth={2.2} />
                  {mustSeeCount} imperdibili
                </span>
              </div>
            </header>

            <div
              className="itinerary-body"
              onScroll={(event) => {
                setHasScrolled(event.currentTarget.scrollTop > 6);
              }}
            >
              {normalizedStops.map((step, index) => (
                <div key={`${step.name}-${step.index}-${index}`} className="itinerary-row">
                  <RouteTimelineMarker
                    isFirst={index === 0}
                    isLast={index === normalizedStops.length - 1}
                    isStart={step.isStart}
                  />
                  <RouteStepCard step={step} index={index} />
                </div>
              ))}
            </div>

            <footer className="itinerary-footer">
              <button
                type="button"
                onClick={onClose}
                className="itinerary-close-cta"
              >
                Chiudi Percorso
              </button>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
