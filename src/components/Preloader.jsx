import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const ROUTE_PATH =
  'M 24 154 C 152 52, 304 216, 484 118 C 652 48, 830 188, 986 94';

const STOPS = [
  { x: 56, y: 144, at: 0.06 },
  { x: 166, y: 90, at: 0.16 },
  { x: 278, y: 145, at: 0.28 },
  { x: 392, y: 152, at: 0.39 },
  { x: 504, y: 122, at: 0.51 },
  { x: 618, y: 99, at: 0.63 },
  { x: 736, y: 134, at: 0.74 },
  { x: 852, y: 132, at: 0.86 },
  { x: 946, y: 102, at: 0.95 },
];

function getTravelDurationMs(totalDuration, reducedMotion) {
  const normalizedTotal = Number.isFinite(totalDuration) ? totalDuration : 1600;
  const constrainedTotal = Math.min(Math.max(normalizedTotal, 1200), 2600);

  if (reducedMotion) {
    return 220;
  }

  return Math.max(840, constrainedTotal - 320);
}

export default function Preloader({ onFinish, duration = 1600 }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState('running');
  const [imageIndex, setImageIndex] = useState(0);
  const finishCalledRef = useRef(false);

  const travelMs = getTravelDurationMs(duration, reduceMotion);
  const travelSeconds = travelMs / 1000;

  const imageSources = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return Array.from(
      new Set([`${base}/tuktuk.webp`, '/tuktuk.webp', `${base}/tuktuk-cursor.webp`, '/tuktuk-cursor.webp'])
    );
  }, []);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    let exitTimerId;
    if (reduceMotion) {
      exitTimerId = window.setTimeout(() => {
        setPhase('exit');
      }, travelMs + 40);
    } else {
      exitTimerId = window.setTimeout(() => {
        setPhase('exit');
      }, travelMs + 120);
    }

    return () => {
      window.clearTimeout(exitTimerId);
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [reduceMotion, travelMs]);

  const handleOverlayAnimationComplete = () => {
    if (phase !== 'exit' || finishCalledRef.current) {
      return;
    }
    finishCalledRef.current = true;
    onFinish?.();
  };

  return (
    <motion.div
      className="tt-preloader-overlay"
      aria-live="polite"
      aria-label="Preparando il tuo tour"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={
        phase === 'exit'
          ? { opacity: 0, scale: 0.988, filter: 'blur(1px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{
        duration: phase === 'exit' ? 0.33 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={handleOverlayAnimationComplete}
    >
      <div className="tt-preloader-bg" aria-hidden="true" />
      <div className="tt-preloader-blob" aria-hidden="true" />
      <div className="tt-preloader-noise" aria-hidden="true" />

      <div className="tt-preloader-shell">
        <motion.p
          className="tt-preloader-title"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.1, ease: 'easeOut' }}
        >
          Preparando il tuo tour...
        </motion.p>

        <div className="tt-preloader-route-wrap" aria-hidden="true">
          <svg viewBox="0 0 1010 230" className="tt-preloader-route-svg" preserveAspectRatio="none">
            <path d={ROUTE_PATH} className="tt-preloader-route-path" />
          </svg>

          {STOPS.map((stop, index) => (
            <motion.span
              key={`stop-${stop.at}`}
              className="tt-preloader-stop"
              style={{
                left: `${(stop.x / 1010) * 100}%`,
                top: `${(stop.y / 230) * 100}%`,
              }}
              initial={{
                scale: 1,
                backgroundColor: '#f8ece0',
                borderColor: '#e6c69b',
                boxShadow: '0 0 0 rgba(255, 143, 37, 0)',
              }}
              animate={
                reduceMotion
                  ? {
                      opacity: 0.86,
                    }
                  : {
                      scale: [1, 1, 1.35, 1],
                      backgroundColor: ['#f8ece0', '#f8ece0', '#ff8d1a', '#ff8d1a'],
                      borderColor: ['#e6c69b', '#e6c69b', '#ffac4a', '#ffac4a'],
                      boxShadow: [
                        '0 0 0 rgba(255, 143, 37, 0)',
                        '0 0 0 rgba(255, 143, 37, 0)',
                        '0 0 14px rgba(255, 143, 37, 0.55), 0 0 26px rgba(255, 143, 37, 0.34)',
                        '0 0 10px rgba(255, 143, 37, 0.3), 0 0 16px rgba(255, 143, 37, 0.2)',
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : {
                      duration: Math.max(0.42, travelSeconds * 0.22),
                      delay: Math.max(0, stop.at * travelSeconds - 0.02),
                      ease: [0.2, 0.9, 0.3, 1],
                    }
              }
            />
          ))}

          {!reduceMotion ? (
            <>
              <motion.span
                className="tt-preloader-trail tt-preloader-trail-far"
                style={{
                  offsetPath: `path("${ROUTE_PATH}")`,
                  offsetRotate: 'auto',
                }}
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: ['0%', '88%'] }}
                transition={{ duration: travelSeconds, ease: 'easeInOut' }}
              />
              <motion.span
                className="tt-preloader-trail tt-preloader-trail-near"
                style={{
                  offsetPath: `path("${ROUTE_PATH}")`,
                  offsetRotate: 'auto',
                }}
                initial={{ offsetDistance: '2%' }}
                animate={{ offsetDistance: ['2%', '92%'] }}
                transition={{ duration: travelSeconds, ease: [0.22, 1, 0.36, 1] }}
              />
            </>
          ) : null}

          <motion.img
            src={imageSources[imageIndex]}
            alt=""
            className="tt-preloader-tuktuk"
            draggable={false}
            style={{
              offsetPath: `path("${ROUTE_PATH}")`,
              offsetRotate: 'auto',
            }}
            initial={{ offsetDistance: reduceMotion ? '50%' : '4%' }}
            animate={{ offsetDistance: reduceMotion ? '50%' : ['4%', '96%'] }}
            transition={{
              duration: reduceMotion ? 0.01 : travelSeconds,
              ease: reduceMotion ? 'linear' : [0.22, 1, 0.36, 1],
            }}
            onError={() => {
              setImageIndex((current) => {
                if (current >= imageSources.length - 1) {
                  return current;
                }
                return current + 1;
              });
            }}
          />
        </div>

        <motion.div
          className="tt-preloader-progress-track"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.18, ease: 'easeOut' }}
        >
          <motion.span
            className="tt-preloader-progress-fill"
            initial={{ scaleX: reduceMotion ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0.01 : travelSeconds, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
