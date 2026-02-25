import { useEffect } from 'react';

type ToastProps = {
  open: boolean;
  message: string;
  durationMs?: number;
  onClose: () => void;
};

export default function Toast({ open, message, durationMs = 2200, onClose }: ToastProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [durationMs, onClose, open]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        'fixed bottom-4 left-4 z-[220] pointer-events-none transition-all duration-300',
        open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      ].join(' ')}
    >
      <div className="max-w-[300px] rounded-xl border border-white/12 bg-[#140A18]/72 px-4 py-2.5 text-sm text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        {message}
      </div>
    </div>
  );
}

