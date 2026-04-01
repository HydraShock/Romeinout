import { type MouseEvent, useEffect, useRef, useState } from 'react';
import styles from './CtaMarbleTriptych.module.css';

type CopyTarget = 'phone' | 'email' | null;

interface CtaMarbleTriptychProps {
  onBookTour?: () => void;
  bookHref?: string;
  className?: string;
}

const PHONE_LABEL = '+39 375 605 1114';
const PHONE_LINK = 'tel:+393756051114';
const EMAIL = 'info@tuktukroma.it';

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="3.5" y="4.5" width="17" height="16" rx="2.75" stroke="currentColor" strokeWidth="1.9" />
    <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.9" />
    <path d="M8 2.7V6.4M16 2.7V6.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M7.8 13.2H10.2M13.8 13.2H16.2M7.8 16.5H10.2M13.8 16.5H16.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M6.8 4.5l2.7 3.8c.4.5.3 1.1-.1 1.6l-1.2 1.2a13.1 13.1 0 0 0 4.7 4.7l1.2-1.2c.4-.4 1.1-.5 1.6-.1l3.8 2.7c.6.4.7 1.2.2 1.8l-1.7 1.7c-.5.5-1.2.7-1.9.5-2.7-.7-5.6-2.4-8.2-5s-4.3-5.5-5-8.2c-.2-.7 0-1.4.5-1.9L5 4.3c.6-.5 1.4-.4 1.8.2z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="6" y="5.8" width="12" height="14.2" rx="2.4" stroke="currentColor" strokeWidth="1.9" />
    <path d="M9.2 4.8h5.6a1.4 1.4 0 0 1 1.4 1.4v1.1h-8.4V6.2a1.4 1.4 0 0 1 1.4-1.4z" stroke="currentColor" strokeWidth="1.9" />
    <path d="M10 11.3h4M10 14.3h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CopyButton = ({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) => (
  <button type="button" className={styles.copyBtn} onClick={onClick} aria-label="Copia contatto">
    <span className={styles.copyIcon}>
      <ClipboardIcon />
    </span>
    <span>Copia</span>
    <span className={`${styles.copyTip} ${copied ? styles.copyTipVisible : ''}`} role="status" aria-live="polite">
      Copiato!
    </span>
  </button>
);

export default function CtaMarbleTriptych({
  onBookTour,
  bookHref = '/prenota',
  className = '',
}: CtaMarbleTriptychProps) {
  const [copied, setCopied] = useState<CopyTarget>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    },
    []
  );

  const showCopiedState = (target: Exclude<CopyTarget, null>) => {
    setCopied(target);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopied(null), 1300);
  };

  const copyValue = async (value: string, target: Exclude<CopyTarget, null>) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (typeof document !== 'undefined') {
        const helper = document.createElement('textarea');
        helper.value = value;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
      }
      showCopiedState(target);
    } catch {
      // Ignore clipboard errors to avoid blocking CTA usage.
    }
  };

  const handleBookClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onBookTour) return;
    event.preventDefault();
    onBookTour();
  };

  return (
    <section className={`${styles.ctaWrap} ${className}`}>
      <div className={styles.bgSoft} />
      <figure className={`${styles.sideSticker} ${styles.sideStickerLeft}`} aria-hidden="true">
        <img src="/bg/details/rome-detail-colosseo.png" alt="" />
      </figure>
      <div className={styles.triptych}>
        <div className={`${styles.sidePanel} ${styles.left}`} aria-hidden="true" />
        <div className={`${styles.sidePanel} ${styles.right}`} aria-hidden="true" />

        <div className={styles.mainPanel}>
          <span className={styles.liveBadge}>{'Disponibilit\u00e0 Live'}</span>
          <div className={styles.iconBadge}>
            <CalendarIcon />
          </div>

          <h2>Pronti a Vivere Roma?</h2>
          <p>
            Prenota ora il tuo tour in tuk tuk e scopri
            <br />
            {'la magia della citt\u00e0 eterna'}
          </p>

          <div className={styles.actions}>
            <a href={bookHref} className={styles.primaryBtn} onClick={handleBookClick}>
              Prenota il Tuo Tour
            </a>
            <a href={PHONE_LINK} className={styles.secondaryBtn}>
              Chiama Ora
            </a>
          </div>
          <div className={styles.metaRow}>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>
                <PhoneIcon />
              </span>
              <div className={styles.contactBody}>
                <span className={styles.contactLabel}>Chiama</span>
                <a href={PHONE_LINK} className={styles.contactValue}>
                  {PHONE_LABEL}
                </a>
              </div>
              <CopyButton copied={copied === 'phone'} onClick={() => copyValue(PHONE_LABEL, 'phone')} />
            </div>

            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>
                <MailIcon />
              </span>
              <div className={styles.contactBody}>
                <span className={styles.contactLabel}>Scrivi</span>
                <a href={`mailto:${EMAIL}`} className={styles.contactValue}>
                  {EMAIL}
                </a>
              </div>
              <CopyButton copied={copied === 'email'} onClick={() => copyValue(EMAIL, 'email')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
