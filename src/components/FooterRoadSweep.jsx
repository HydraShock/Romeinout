import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const DEFAULT_ROUTE_PATH =
  'M 18 70 C 180 12, 360 120, 530 62 C 690 12, 870 100, 1030 46 C 1140 10, 1230 48, 1320 28';

const DEFAULT_DOT_POSITIONS = [8, 17, 28, 40, 55, 66, 78, 90];

const FIRST_SWEEP_DELAY_MS = 1200;

export default function FooterRoadSweep({
  routePath = DEFAULT_ROUTE_PATH,
  dotPositions = DEFAULT_DOT_POSITIONS,
  sweepInterval = 10000,
  sweepDuration = 2500,
}) {
  const reduceMotion = useReducedMotion();
  const [isSweeping, setIsSweeping] = useState(false);
  const [runId, setRunId] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const tuktukSrc = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return `${base}/tuktuk.webp`;
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    let destroyed = false;
    let hideTimerId;

    const startSweep = () => {
      if (destroyed) {
        return;
      }
      setRunId((current) => current + 1);
      setIsSweeping(true);

      window.clearTimeout(hideTimerId);
      hideTimerId = window.setTimeout(() => {
        if (!destroyed) {
          setIsSweeping(false);
        }
      }, sweepDuration);
    };

    const firstSweepId = window.setTimeout(startSweep, FIRST_SWEEP_DELAY_MS);
    const intervalId = window.setInterval(startSweep, sweepInterval);

    return () => {
      destroyed = true;
      window.clearTimeout(firstSweepId);
      window.clearTimeout(hideTimerId);
      window.clearInterval(intervalId);
    };
  }, [reduceMotion, sweepDuration, sweepInterval]);

  const sweepTransition = {
    duration: sweepDuration / 1000,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div className="cfooter-route" aria-hidden="true">
      <svg viewBox="0 0 1340 120" className="cfooter-route-svg" preserveAspectRatio="none">
        <path d={routePath} className="cfooter-route-line-glow" />
        <path d={routePath} className="cfooter-route-line" />
      </svg>

      {dotPositions.map((left) => (
        <span key={left} className="cfooter-route-dot" style={{ left: `${left}%` }} />
      ))}

      <AnimatePresence>
        {!reduceMotion && isSweeping ? (
          <>
            <motion.span
              key={`trail-far-${runId}`}
              className="cfooter-route-sweep-trail cfooter-route-sweep-trail-far"
              style={{
                offsetPath: `path("${routePath}")`,
                offsetRotate: 'auto',
              }}
              initial={{ opacity: 0, offsetDistance: '0%' }}
              animate={{ opacity: [0, 0.52, 0], offsetDistance: ['0%', '100%'] }}
              exit={{ opacity: 0 }}
              transition={sweepTransition}
            />
            <motion.span
              key={`trail-near-${runId}`}
              className="cfooter-route-sweep-trail cfooter-route-sweep-trail-near"
              style={{
                offsetPath: `path("${routePath}")`,
                offsetRotate: 'auto',
              }}
              initial={{ opacity: 0, offsetDistance: '0%' }}
              animate={{ opacity: [0, 0.7, 0], offsetDistance: ['0%', '100%'] }}
              exit={{ opacity: 0 }}
              transition={sweepTransition}
            />

            <motion.span
              key={`tuktuk-${runId}`}
              className="cfooter-route-sweep-tuktuk"
              style={{
                offsetPath: `path("${routePath}")`,
                offsetRotate: 'auto',
              }}
              initial={{ opacity: 0, offsetDistance: '0%' }}
              animate={{ opacity: [0, 1, 1, 0], offsetDistance: ['0%', '100%'] }}
              exit={{ opacity: 0 }}
              transition={sweepTransition}
            >
              {imageFailed ? (
                '\u{1F6FA}'
              ) : (
                <img
                  src={tuktukSrc}
                  alt=""
                  className="cfooter-route-sweep-img"
                  onError={() => setImageFailed(true)}
                />
              )}
            </motion.span>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
