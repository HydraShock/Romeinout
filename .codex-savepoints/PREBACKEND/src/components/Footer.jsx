import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react';
import './Footer.css';

const ROAD_PATH =
  'M 20 94 C 190 28, 372 136, 556 78 C 736 24, 934 128, 1132 72 C 1268 34, 1388 66, 1460 48';

const ROAD_BULBS = [
  { cx: 88, cy: 76, hero: false },
  { cx: 214, cy: 56, hero: false },
  { cx: 338, cy: 82, hero: true },
  { cx: 472, cy: 96, hero: false },
  { cx: 608, cy: 66, hero: true },
  { cx: 752, cy: 54, hero: false },
  { cx: 886, cy: 92, hero: false },
  { cx: 1022, cy: 84, hero: true },
  { cx: 1152, cy: 60, hero: false },
  { cx: 1286, cy: 52, hero: false },
];

const SOCIALS = [
  { href: '#home', label: 'Facebook', icon: Facebook },
  { href: '#home', label: 'Instagram', icon: Instagram },
  { href: '#home', label: 'Twitter', icon: Twitter },
  { href: '#home', label: 'YouTube', icon: Youtube },
];

const QUICK_LINKS = [
  { label: 'Roma Da Romano', href: '#tour' },
  { label: 'Roma Mangia Prega Ama', href: '#tour' },
  { label: 'Galleria', href: '#galleria' },
  { label: 'Dove Siamo?', href: '#contatti' },
];

const CONTACTS = [
  { text: 'Via Cavour 134', icon: MapPin, href: 'https://maps.google.com/?q=Via+Cavour+134+Roma' },
  { text: '00184 Roma, Italia', icon: MapPin, href: 'https://maps.google.com/?q=Via+Cavour+134+Roma' },
  { text: '+39 375 605 1114', icon: Phone, href: 'tel:+393756051114' },
  { text: 'info@tuktukroma.it', icon: Mail, href: 'mailto:info@tuktukroma.it' },
];

const OPENING_HOURS = [
  { day: 'Lun - Ven', hours: '07:00 - 23:00' },
  { day: 'Sabato', hours: '07:00 - 23:00' },
  { day: 'Domenica', hours: '07:00 - 23:00' },
];

export default function Footer() {
  const [cartImageFailed, setCartImageFailed] = useState(false);
  const cartSrc = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return `${base}/tuktuk.webp`;
  }, []);

  return (
    <footer id="contatti" className="rs-footer">
      <div className="rs-footer-bg" aria-hidden="true">
        <div className="rs-footer-vignette" />
        <div className="rs-footer-light-leaks" />
        <div className="rs-footer-noise" />

        <svg viewBox="0 0 1440 280" className="rs-footer-skyline" preserveAspectRatio="none">
          <path
            d="M0 214h120l14-28 18 9 16-36 20 55h74l17-46 24 8 10-22 12 60h96l18-22h44l16-28
              20 13 17-42 18 79h71l13-50 23 18 11-36 18 68h79l13-20h42l14-32 20 10 16-48 16 90h80
              l12-38 24 11 10-20 14 47h188v66H0z"
            fill="currentColor"
          />
          <path
            d="M286 214v-34h21v-18h18v18h20v34M302 214v-70h9v-9h4v9h9v70"
            fill="currentColor"
          />
          <path
            d="M944 214v-26h18v-16h14v16h17v26M950 214v-50h5v-8h7v8h5v50"
            fill="currentColor"
          />
          <ellipse cx="736" cy="194" rx="72" ry="26" fill="currentColor" />
          <rect x="673" y="194" width="126" height="20" fill="currentColor" />
          <rect x="694" y="172" width="84" height="22" rx="6" fill="currentColor" />
          <ellipse cx="736" cy="172" rx="42" ry="22" fill="currentColor" />
        </svg>

        <div className="rs-footer-road">
          <svg viewBox="0 0 1460 130" className="rs-footer-road-svg">
            <defs>
              <filter id="rsRoadGlow" x="-30%" y="-120%" width="160%" height="320%">
                <feGaussianBlur stdDeviation="4.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path d={ROAD_PATH} className="rs-footer-road-path-glow" />
            <path d={ROAD_PATH} className="rs-footer-road-path-dotted" />

            {ROAD_BULBS.map((bulb, index) => (
              <circle
                key={`${bulb.cx}-${bulb.cy}`}
                cx={bulb.cx}
                cy={bulb.cy}
                r={bulb.hero ? 4.2 : 3.1}
                filter="url(#rsRoadGlow)"
                className={`rs-footer-road-bulb ${bulb.hero ? 'hero' : ''}`}
                style={{ '--pulse-delay': `${index * 0.25}s` }}
              />
            ))}
          </svg>

          <div
            className="rs-footer-road-cart-track"
            style={{
              offsetPath: `path("${ROAD_PATH}")`,
              WebkitOffsetPath: `path("${ROAD_PATH}")`,
            }}
          >
            <div className="rs-footer-road-cart">
              <span className="rs-footer-road-headlight" />
              {cartImageFailed ? (
                <span className="rs-footer-road-fallback">TT</span>
              ) : (
                <img
                  src={cartSrc}
                  alt=""
                  className="rs-footer-road-cart-image"
                  onError={() => setCartImageFailed(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rs-footer-shell">
        <div className="rs-footer-grid">
          <section className="rs-footer-card rs-footer-brand-card">
            <div className="rs-footer-brand-head">
              <span className="rs-footer-brand-icon">TT</span>
              <div>
                <p className="rs-footer-brand-kicker">Rome sunset rides</p>
                <h3>RomeInOut</h3>
              </div>
            </div>

            <p className="rs-footer-brand-text">
              Scopri Roma in modo unico e indimenticabile con i nostri tour in tuk tuk. Esperienza,
              professionalita e passione in ogni percorso.
            </p>

            <div className="rs-footer-cta-row">
              <a href="#prenota" className="rs-footer-cta rs-footer-cta-primary">
                Book a Tour
              </a>
              <a href="mailto:info@tuktukroma.it" className="rs-footer-cta rs-footer-cta-secondary">
                Contattaci
              </a>
            </div>

            <form className="rs-footer-newsletter" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="footer-newsletter" className="rs-footer-newsletter-field">
                <input
                  id="footer-newsletter"
                  type="email"
                  autoComplete="email"
                  placeholder="Ricevi itinerari e offerte"
                />
              </label>
              <button type="submit">
                <Send size={15} />
                Iscriviti
              </button>
            </form>

            <div className="rs-footer-socials" aria-label="Social links">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} aria-label={label} className="rs-footer-social-pill">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </section>

          <div className="rs-footer-right-column">
            <section className="rs-footer-card rs-footer-info-card rs-footer-card-links">
              <h4>
                <MapPin size={17} />
                Link Veloci
              </h4>
              <ul>
                {QUICK_LINKS.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>
                      <ChevronRight size={15} />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rs-footer-card rs-footer-info-card rs-footer-card-offset">
              <h4>
                <Mail size={17} />
                Contatti
              </h4>
              <ul>
                {CONTACTS.map(({ text, icon: Icon, href }) => (
                  <li key={text}>
                    <a href={href}>
                      <Icon size={15} />
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rs-footer-card rs-footer-info-card rs-footer-card-hours">
              <h4>
                <Clock3 size={17} />
                Orari
              </h4>
              <ul className="rs-footer-hours-list">
                {OPENING_HOURS.map((item) => (
                  <li key={item.day}>
                    <span>{item.day}</span>
                    <strong>{item.hours}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="rs-footer-legal">
          <div className="rs-footer-legal-separator" />
          <div className="rs-footer-legal-row">
            <p>{'\u00A9'} 2026 RomeInOut. Created by Francesco Buttarazzi Iaia</p>
            <div className="rs-footer-legal-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/termini-e-condizioni">Termini e Condizioni</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
