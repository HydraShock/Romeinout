import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .cursor-hover, input[type="button"], input[type="submit"]';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function Cursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const imageSources = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return Array.from(
      new Set(
        [
          `${base}/tuktuk-cursor.webp`,
          '/tuktuk-cursor.webp',
          `${base}/tuktuk.webp`,
          '/tuktuk.webp',
        ].filter(Boolean)
      )
    );
  }, []);

  const targetX = useMotionValue(-120);
  const targetY = useMotionValue(-120);
  const cursorX = useSpring(targetX, { stiffness: 640, damping: 36, mass: 0.26 });
  const cursorY = useSpring(targetY, { stiffness: 640, damping: 36, mass: 0.26 });

  const speedRaw = useMotionValue(0);
  const speed = useSpring(speedRaw, { stiffness: 230, damping: 28, mass: 0.5 });
  const tilt = useMotionValue(0);
  const hoverScale = useMotionValue(1);
  const hoverRotate = useMotionValue(0);

  const tiltSpring = useSpring(tilt, { stiffness: 220, damping: 22, mass: 0.4 });
  const speedBoost = useTransform(speed, [0, 2.5], [1, 1.12]);
  const scaleTarget = useTransform([hoverScale, speedBoost], ([h, boost]) => h * boost);
  const scaleSpring = useSpring(scaleTarget, { stiffness: 260, damping: 26, mass: 0.52 });
  const rotation = useTransform([tiltSpring, hoverRotate], ([lean, hover]) => lean + hover);

  const pointerFrameRef = useRef(0);
  const latestPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const prevPointerRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false);
      return undefined;
    }

    const pointerFine = window.matchMedia('(pointer: fine)');
    const anyPointerFine = window.matchMedia('(any-pointer: fine)');
    const hoverCapable = window.matchMedia('(hover: hover)');
    const anyHoverCapable = window.matchMedia('(any-hover: hover)');
    const updateEnabled = () => {
      const hasFinePointer = pointerFine.matches || anyPointerFine.matches;
      const hasHover = hoverCapable.matches || anyHoverCapable.matches;
      const likelyDesktop = !('ontouchstart' in window);
      setEnabled(hasFinePointer || hasHover || likelyDesktop);
    };
    updateEnabled();

    pointerFine.addEventListener('change', updateEnabled);
    anyPointerFine.addEventListener('change', updateEnabled);
    hoverCapable.addEventListener('change', updateEnabled);
    anyHoverCapable.addEventListener('change', updateEnabled);
    return () => {
      pointerFine.removeEventListener('change', updateEnabled);
      anyPointerFine.removeEventListener('change', updateEnabled);
      hoverCapable.removeEventListener('change', updateEnabled);
      anyHoverCapable.removeEventListener('change', updateEnabled);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    setImageFailed(false);
    setImageIndex(0);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    document.documentElement.classList.add('custom-cursor-hidden');
    return () => {
      document.documentElement.classList.remove('custom-cursor-hidden');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const resetHover = () => {
      hoverScale.set(1);
      hoverRotate.set(0);
    };

    const onPointerOver = (event) => {
      if (event.target?.closest(INTERACTIVE_SELECTOR)) {
        hoverScale.set(1.16);
        hoverRotate.set(6);
      }
    };

    const onPointerOut = (event) => {
      const leavingInteractive = event.target?.closest(INTERACTIVE_SELECTOR);
      const enteringInteractive = event.relatedTarget?.closest?.(INTERACTIVE_SELECTOR);
      if (leavingInteractive && !enteringInteractive) {
        resetHover();
      }
    };

    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    return () => {
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerout', onPointerOut);
      resetHover();
    };
  }, [enabled, hoverRotate, hoverScale]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const applyPointer = () => {
      pointerFrameRef.current = 0;

      const next = latestPointerRef.current;
      const prev = prevPointerRef.current;
      const dt = Math.max(1, next.time - prev.time);
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

      targetX.set(next.x);
      targetY.set(next.y);
      speedRaw.set(clamp(velocity, 0, 2.5));
      tilt.set(clamp((dx / dt) * 7.4, -14, 14));

      prevPointerRef.current = next;
    };

    const onPointerMove = (event) => {
      latestPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      };
      if (!pointerFrameRef.current) {
        pointerFrameRef.current = window.requestAnimationFrame(applyPointer);
      }
    };

    const onPointerLeave = () => {
      targetX.set(-120);
      targetY.set(-120);
      speedRaw.set(0);
      tilt.set(0);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      if (pointerFrameRef.current) {
        window.cancelAnimationFrame(pointerFrameRef.current);
        pointerFrameRef.current = 0;
      }
    };
  }, [enabled, speedRaw, targetX, targetY, tilt]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        willChange: 'transform',
        x: cursorX,
        y: cursorY,
        scale: scaleSpring,
        rotate: rotation,
      }}
    >
      <img
        src={imageSources[imageIndex]}
        className="w-[60px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)]"
        alt=""
        draggable="false"
        loading="eager"
        decoding="sync"
        onLoad={() => setImageFailed(false)}
        onError={() => {
          if (imageIndex < imageSources.length - 1) {
            setImageIndex((prev) => prev + 1);
            return;
          }
          setImageFailed(true);
        }}
        style={{
          position: 'absolute',
          left: -26,
          top: -16,
          width: 60,
          height: 34,
          objectFit: 'contain',
          maxWidth: 'none',
          maxHeight: 'none',
          userSelect: 'none',
          opacity: imageFailed ? 0 : 1,
          filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.25))',
        }}
      />

      {imageFailed ? (
        <div
          style={{
            position: 'absolute',
            left: -12,
            top: -12,
            width: 24,
            height: 24,
            display: 'grid',
            placeItems: 'center',
            color: '#ff7a00',
            fontSize: 16,
            lineHeight: 1,
            textShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          {'\u{1F6FA}'}
        </div>
      ) : null}
    </motion.div>
  );
}
