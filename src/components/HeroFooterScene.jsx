import {
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroFooterScene.css';

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

const SOCIALS = [
  { href: '#home', label: 'Facebook', icon: Facebook },
  { href: '#home', label: 'Instagram', icon: Instagram },
  { href: '#home', label: 'Twitter', icon: Twitter },
  { href: '#home', label: 'YouTube', icon: Youtube },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Termini e Condizioni', href: '/termini-e-condizioni' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

export default function HeroFooterScene() {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const heroImageSrc = `${base}/assets/tuktuk-hero.webp`;
  const skylineImageSrc = `${base}/assets/rome-skyline-night.webp`;

  return (
    <footer id="contatti" className="hero-footer-scene">
      <div className="hero-footer-bg" aria-hidden="true">
        <div className="hero-footer-skyline-photo">
          <img src={skylineImageSrc} alt="" loading="lazy" />
        </div>
        <div className="hero-footer-gradient" />
        <div className="hero-footer-glows" />
        <div className="hero-footer-vignette" />
        <div className="hero-footer-noise" />
        <div className="hero-footer-particles" />
      </div>

      <div className="hero-footer-container">
        <div className="hero-footer-stage">
          <article className="hero-footer-card">
            <div className="hero-footer-card-copy">
              <p className="hero-footer-kicker">Tour privati a Roma</p>
              <h2>Scopri Roma in Tuk Tuk</h2>

              <div className="hero-footer-mobile-vehicle" aria-hidden="true">
                <span className="hero-footer-mobile-vehicle-shadow" />
                <img
                  src={heroImageSrc}
                  alt=""
                  loading="lazy"
                  className="hero-footer-tuktuk"
                />
              </div>

              <p className="hero-footer-lead">
                Vivi la citta eterna da una prospettiva speciale: itinerari esclusivi, guida locale e
                fermate iconiche in totale comfort.
              </p>

              <div className="hero-footer-actions">
                <a
                  href="#prenota"
                  className="hero-footer-btn hero-footer-btn-primary"
                >
                  Prenota un Tour
                </a>
                <a
                  href="mailto:info@tuktukroma.it"
                  className="hero-footer-btn hero-footer-btn-secondary"
                >
                  Contattaci
                </a>
              </div>
            </div>
          </article>

          <div className="hero-footer-vehicle-row" aria-hidden="true">
            <div className="hero-footer-fog" />
            <div className="hero-footer-vehicle hero-footer-vehicle-mask">
              <div className="hero-footer-float">
                <span className="hero-footer-vehicle-shadow" />
                <span className="hero-footer-headlight" />
                <img
                  src={heroImageSrc}
                  alt="Illustrazione Tuk Tuk Roma"
                  loading="lazy"
                  className="hero-footer-tuktuk"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer-links-wrap">
          <div className="hero-footer-links-grid">
            <section className="hero-footer-pane hero-footer-brand-pane">
              <div className="hero-footer-brand-head">
                <span className="hero-footer-brand-icon">
                  TT
                </span>
                <div>
                  <p className="hero-footer-brand-kicker">
                    Rome sunset rides
                  </p>
                  <h3>RomeInOut</h3>
                </div>
              </div>

              <p className="hero-footer-brand-text">
                Scopri Roma in modo unico e indimenticabile con i nostri tour in tuk tuk.
                Esperienza, professionalita e passione in ogni percorso.
              </p>

              <div className="hero-footer-socials" aria-label="Social links">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`hero-footer-social-link${label === 'Instagram' ? ' hero-footer-social-link-instagram' : ''}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </section>

            <section className="hero-footer-pane">
              <h4>
                <ChevronRight size={17} />
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

            <section className="hero-footer-pane">
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

            <section className="hero-footer-pane">
              <h4>
                <Clock3 size={17} />
                Orari
              </h4>
              <ul className="hero-footer-hours-list">
                {OPENING_HOURS.map((item) => (
                  <li key={item.day}>
                    <span>{item.day}</span>
                    <strong>{item.hours}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="hero-footer-legal-separator" />
          <div className="hero-footer-legal">
            <p className="hero-footer-signature" aria-label="Copyright 2026 RomeInOut. Designed by Francesco Buttarazzi Iaia">
              <span className="hero-footer-signature-secondary">{'\u00A9'} 2026 RomeInOut</span>
              <span className="hero-footer-signature-divider" aria-hidden="true">.</span>
              <span className="hero-footer-signature-primary">Designed by</span>
              <span className="hero-footer-signature-name-wrap">
                <span className="hero-footer-signature-symbol" aria-hidden="true">{'\u2726'}</span>
                <span className="hero-footer-signature-name">Francesco Buttarazzi Iaia</span>
                <a
                  href="https://www.instagram.com/francesco.iaia_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @francesco.iaia_"
                  className="hero-footer-signature-ig"
                >
                  <Instagram size={13} aria-hidden="true" />
                </a>
              </span>
            </p>
            <div className="hero-footer-legal-links">
              {LEGAL_LINKS.map((item) => (
                <Link key={item.label} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-footer-bottom-fade" aria-hidden="true" />
    </footer>
  );
}

