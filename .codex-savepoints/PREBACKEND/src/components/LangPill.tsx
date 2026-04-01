import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type LangPillProps = {
  value?: string;
  onClick: () => void;
  className?: string;
  active?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'onClick'>;

const LangPill = forwardRef<HTMLButtonElement, LangPillProps>(function LangPill(
  { value = 'EN', onClick, className, active = false, ...buttonProps },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn('language-switcher-trigger', active ? 'is-active' : '', className)}
      {...buttonProps}
    >
      <span className="language-switcher-trigger-inner">
        <svg
          className="language-switcher-globe"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.8 2.6 2.8 15.4 0 18" />
          <path d="M12 3c-2.8 2.6-2.8 15.4 0 18" />
          <path d="M5 7.5c2.2 1.2 11.8 1.2 14 0" />
          <path d="M5 16.5c2.2-1.2 11.8-1.2 14 0" />
        </svg>
        <span className="language-switcher-code">{value}</span>
        <svg className="language-switcher-caret" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 4.5h10L7 10.5 2 4.5Z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
});

export default LangPill;
