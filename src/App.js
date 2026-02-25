import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import { BackgroundGradient } from './components/ui/background-gradient.jsx';
import AuroraShader from './components/ui/AuroraShader';
import Cursor from './components/ui/Cursor';
import ItineraryDrawer from './components/ItineraryDrawer';
import NavbarMarbleLuxury from './components/NavbarMarbleLuxury';
import HeroFooterScene from './components/HeroFooterScene';
import BackgroundArtLayer from './components/BackgroundArtLayer';
import HeroAtmosphere from './components/HeroAtmosphere';
import CtaMarbleTriptych from './components/CtaMarbleTriptych';
import { useLanguage } from './components/LanguageProvider';

const heroRomeImages = [
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=900&q=80',
];
const heroAuroraColorStops = ['#080808', '#d4984a', '#191919'];
const sharedFooterMapImageStyle = { '--footer-map-image': "url('/assets/rome-skyline-night.webp')" };
const sharedCtaImageStyle = { '--footer-map-image': "url('/assets/rename.png')" };

const tours = [
  {
    id: 'classico',
    title: 'Roma \n Da Romano',
    price: 89,
    duration: '3 ore',
    capacity: '1-4 persone',
    rating: 5,
    description: 'Esplora i monumenti piu iconici di Roma',
    stops: ['Colosseo', 'Pantheon', 'Piazza Venezia'],
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'completo',
    title: 'Roma Mangia Prega Ama',
    price: 149,
    duration: '5 ore',
    capacity: '1-4 persone',
    rating: 5.0,
    popular: true,
    description: "L'esperienza definitiva della citta eterna",
    stops: ['Santa Maria Maggiore', 'San Pietro in Vincoli'],
    image:
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
  },
];

const tourItineraryById = {
  classico: [
    { name: 'Santa Maria Maggiore', isStart: true, isMustSee: false },
    { name: 'Colosseo', isMustSee: true },
    { name: 'Arco di Costantino', isMustSee: false },
    { name: 'Circo Massimo', isMustSee: false },
    { name: 'Giardino degli Aranci', isMustSee: false },
    { name: "Castel Sant'Angelo", isMustSee: true },
    { name: 'Pantheon', isMustSee: true },
    { name: 'Piazza Venezia', isMustSee: true },
    { name: 'Rientro', isMustSee: false },
  ],
  completo: [
    { name: 'Santa Maria Maggiore', isStart: true, isMustSee: true },
    { name: 'San Pietro in Vincoli', isMustSee: true },
    { name: 'Basilica di Santa Maria Sopra Minerva', isMustSee: false },
    { name: "Sant'Ivo in Sapienza", isMustSee: true },
    { name: "Sant'Agone", isMustSee: false },
    { name: 'San Luigi dei Francesi', isMustSee: false },
    { name: 'Chiesa Nuova', isMustSee: false },
    { name: 'Santa Maria in Trastevere', isMustSee: true },
    { name: 'Basilica di Santa Pudenziana', isMustSee: false },
  ],
};

const availableTimes = [
  '09:00 - 11:30',
  '11:45 - 14:20',
  '15:00 - 17:30',
];
const bookingTourOptions = [
  {
    id: 'roma-mangia-prega-ama',
    title: 'Roma tour mangia prega ama',
    price: 79,
    rating: 4.8,
    duration: '2.5 ore',
    capacity: '1-4 persone',
    description: 'Tra vicoli iconici, sapori romani e scorci indimenticabili.',
    stops: ['Fontana di Trevi', 'Piazza di Spagna', 'Pantheon'],
    image:
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'when-in-rome',
    title: 'A Roma fai come i Romani',
    price: 149,
    rating: 5.0,
    duration: '5 ore',
    capacity: '1-4 persone',
    popular: true,
    description: "L'esperienza completa per vivere Roma come un locale.",
    stops: ['Vaticano', 'Colosseo', 'Centro Storico', 'Trastevere'],
    image:
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
  },
];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
const FALLBACK_PAYMENT_MODE = (process.env.REACT_APP_PAYMENT_MODE || 'mock').toLowerCase();
const FALLBACK_CHECKOUT_PROVIDER = FALLBACK_PAYMENT_MODE === 'paypal' ? 'paypal' : 'mock';
const FALLBACK_PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';
const PAYPAL_SCRIPT_ID = 'paypal-sdk-js';
const PAYPAL_CURRENCY = 'EUR';
const BOOKING_TOTAL_STEPS = 7;
const HERO_SCROLL_OFFSET = 96;
const availabilityNetworkErrorMessage =
  "Impossibile raggiungere l'API disponibilita. Avvia il backend con \"npm run server\" e verifica che PostgreSQL sia attivo.";

function toDateKey(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toMonthKey(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getStartOfDay(dateValue = new Date()) {
  return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
}

function getTomorrowStart(dateValue = new Date()) {
  const tomorrow = getStartOfDay(dateValue);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function sanitizeCustomerText(value, maxLength) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function isValidCustomerEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidCustomerPhone(value) {
  return /^[0-9+\s().-]{6,25}$/.test(value);
}

function formatEurAmount(value, locale = 'it-IT') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return locale === 'it-IT' ? '0,00' : '0.00';
  }
  return amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const galleryImages = [
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=1200&q=80',
];

function TourShowcaseCard({ tour, onViewRoute }) {
  const itineraryStops = tourItineraryById[tour.id] || [];
  const totalStops = itineraryStops.length > 0 ? itineraryStops.length : tour.stops.length;
  const mustSeeCount = itineraryStops.filter((stop) => stop.isMustSee).length;
  const previewPointCount = Math.min(totalStops, 6);
  const remainingStops = Math.max(totalStops - previewPointCount, 0);

  return (
    <article className={`tour-showcase-card ${tour.popular ? 'popular' : ''}`}>
      {tour.popular ? <span className="popular-badge">{"PI\u00D9 POPOLARE"}</span> : null}
      <div className="tour-image-wrap">
        <img src={tour.image} alt={tour.title} />
        <span className="tour-rating">
          <span className="rating-star">{"\u2605"}</span>
          {tour.rating}
        </span>
      </div>

      <div className="tour-body">
        <h3>{tour.title}</h3>
        <p>{tour.description}</p>

        <div className="tour-tags">
          {tour.stops.map((stop) => (
            <span key={stop}>{stop}</span>
          ))}
        </div>

        <div className="tour-meta">
          <span>
            <i>{"\u25F7"}</i> {tour.duration}
          </span>
          <span>
            <i>{"\u{1F465}"}</i> {tour.capacity}
          </span>
        </div>

        <div className="tour-divider" />

        <button type="button" className="tour-route-preview" onClick={() => onViewRoute(tour)}>
          <div className="tour-route-head">
            <span className="tour-route-title">
              <span className="tour-route-title-icon">{"\u{1F4CD}"}</span>
              Percorso
            </span>
            <span className="tour-route-arrow">{"\u2192"}</span>
          </div>

          <div className="tour-route-track" aria-hidden="true">
            <span className="tour-route-track-line" />
            {Array.from({ length: previewPointCount }).map((_, index) => (
              <span
                key={`${tour.id}-dot-${index + 1}`}
                className={`tour-route-dot ${
                  index === Math.floor(previewPointCount / 2) || index === previewPointCount - 1
                    ? 'active'
                    : ''
                }`}
              />
            ))}
            {remainingStops > 0 ? <span className="tour-route-extra">+{remainingStops}</span> : null}
          </div>

          <div className="tour-route-meta-row">
            <span>{totalStops} tappe totali</span>
            <span className="tour-route-must-see">
              {"\u2605"} {mustSeeCount} imperdibili
            </span>
          </div>
        </button>

        <div className="tour-divider" />

        <div className="tour-footer-row tour-footer-row-after-route">
          <div>
            <small>A partire da</small>
            <strong>{"\u20AC"}{tour.price}</strong>
          </div>
          <button type="button" onClick={() => onViewRoute(tour)}>
            Vedi percorso <span>{"\u2192"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const { lang, translateText } = useLanguage();

  const [date, setDate] = useState(() => getTomorrowStart());
  const [timeSlot, setTimeSlot] = useState('');
  const [tourId, setTourId] = useState('');
  const [people, setPeople] = useState('2');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerFormError, setCustomerFormError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(date.getFullYear(), date.getMonth(), 1));
  const [stepMotion, setStepMotion] = useState('idle');
  const [availabilityByDate, setAvailabilityByDate] = useState({});
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityRetryTick, setAvailabilityRetryTick] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMode, setPaymentMode] = useState(FALLBACK_PAYMENT_MODE);
  const [paymentProviders, setPaymentProviders] = useState([FALLBACK_CHECKOUT_PROVIDER]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(FALLBACK_CHECKOUT_PROVIDER);
  const [paymentConfigError, setPaymentConfigError] = useState('');
  const [paypalClientId, setPaypalClientId] = useState(FALLBACK_PAYPAL_CLIENT_ID);
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);
  const [paypalSdkError, setPaypalSdkError] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [itineraryTour, setItineraryTour] = useState(null);
  const [isHeroGradientActive, setIsHeroGradientActive] = useState(false);
  const transitionTimersRef = useRef([]);
  const heroSectionRef = useRef(null);
  const heroGradientHostRef = useRef(null);
  const heroParallaxFrameRef = useRef(0);
  const heroParallaxTargetRef = useRef({ x: 0, y: 0 });
  const heroParallaxEnabledRef = useRef(false);
  const paypalButtonsRef = useRef(null);
  const paypalButtonsRenderedRef = useRef(false);
  const paypalIntentIdRef = useRef('');

  const smoothScrollToHash = useCallback((hash) => {
    if (typeof window === 'undefined') {
      return;
    }

    const normalizedHash = hash && hash.startsWith('#') ? hash : `#${hash || ''}`;
    const target = document.querySelector(normalizedHash);

    if (!target) {
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top - HERO_SCROLL_OFFSET;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    if (window.history?.pushState) {
      window.history.pushState(null, '', normalizedHash);
    } else {
      window.location.hash = normalizedHash;
    }
  }, []);

  const handleHeroCtaClick = useCallback(
    (event, hash) => {
      event.preventDefault();
      smoothScrollToHash(hash);
    },
    [smoothScrollToHash]
  );

  const resetHeroParallax = useCallback(() => {
    const heroElement = heroSectionRef.current;
    heroParallaxTargetRef.current = { x: 0, y: 0 };

    if (!heroElement) {
      return;
    }

    heroElement.style.setProperty('--hero-px', '0');
    heroElement.style.setProperty('--hero-py', '0');
    heroElement.style.setProperty('--hero-mx', '0.5');
    heroElement.style.setProperty('--hero-my', '0.5');
  }, []);

  const flushHeroParallax = useCallback(() => {
    heroParallaxFrameRef.current = 0;

    if (!heroParallaxEnabledRef.current) {
      resetHeroParallax();
      return;
    }

    const heroElement = heroSectionRef.current;
    if (!heroElement) {
      return;
    }

    const { x, y } = heroParallaxTargetRef.current;
    heroElement.style.setProperty('--hero-px', x.toFixed(4));
    heroElement.style.setProperty('--hero-py', y.toFixed(4));
    heroElement.style.setProperty('--hero-mx', ((x + 1) / 2).toFixed(4));
    heroElement.style.setProperty('--hero-my', ((y + 1) / 2).toFixed(4));
  }, [resetHeroParallax]);

  const scheduleHeroParallax = useCallback(() => {
    if (heroParallaxFrameRef.current || typeof window === 'undefined') {
      return;
    }
    heroParallaxFrameRef.current = window.requestAnimationFrame(flushHeroParallax);
  }, [flushHeroParallax]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mobileMql = window.matchMedia('(max-width: 767px)');
    const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerFineMql = window.matchMedia('(pointer: fine)');

    const updateParallaxAvailability = () => {
      heroParallaxEnabledRef.current = !mobileMql.matches && !reducedMotionMql.matches && pointerFineMql.matches;
      if (!heroParallaxEnabledRef.current) {
        resetHeroParallax();
      }
    };

    updateParallaxAvailability();
    mobileMql.addEventListener('change', updateParallaxAvailability);
    reducedMotionMql.addEventListener('change', updateParallaxAvailability);
    pointerFineMql.addEventListener('change', updateParallaxAvailability);

    return () => {
      mobileMql.removeEventListener('change', updateParallaxAvailability);
      reducedMotionMql.removeEventListener('change', updateParallaxAvailability);
      pointerFineMql.removeEventListener('change', updateParallaxAvailability);
      if (heroParallaxFrameRef.current) {
        window.cancelAnimationFrame(heroParallaxFrameRef.current);
        heroParallaxFrameRef.current = 0;
      }
    };
  }, [resetHeroParallax]);

  const updateHeroGradientPointer = useCallback((sectionElement, clientX, clientY, alpha) => {
    const gradientElement = heroGradientHostRef.current?.firstElementChild;
    if (!sectionElement || !gradientElement) {
      return;
    }

    const rect = sectionElement.getBoundingClientRect();
    gradientElement.style.setProperty('--mouse-x', `${clientX - rect.left}px`);
    gradientElement.style.setProperty('--mouse-y', `${clientY - rect.top}px`);
    gradientElement.style.setProperty('--pointer-alpha', alpha);
  }, []);

  const handleHeroMouseEnter = useCallback((event) => {
    setIsHeroGradientActive(true);
    updateHeroGradientPointer(event.currentTarget, event.clientX, event.clientY, '0.92');
    if (!heroParallaxEnabledRef.current) {
      resetHeroParallax();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    heroParallaxTargetRef.current = {
      x: Math.max(-1, Math.min(1, normalizedX)),
      y: Math.max(-1, Math.min(1, normalizedY)),
    };
    scheduleHeroParallax();
  }, [resetHeroParallax, scheduleHeroParallax, updateHeroGradientPointer]);

  const handleHeroMouseMove = useCallback((event) => {
    updateHeroGradientPointer(event.currentTarget, event.clientX, event.clientY, '1');
    if (!heroParallaxEnabledRef.current) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    heroParallaxTargetRef.current = {
      x: Math.max(-1, Math.min(1, normalizedX)),
      y: Math.max(-1, Math.min(1, normalizedY)),
    };
    scheduleHeroParallax();
  }, [scheduleHeroParallax, updateHeroGradientPointer]);

  const handleHeroMouseLeave = useCallback(() => {
    const gradientElement = heroGradientHostRef.current?.firstElementChild;
    if (gradientElement) {
      gradientElement.style.setProperty('--pointer-alpha', '0');
    }
    setIsHeroGradientActive(false);
    resetHeroParallax();
  }, [resetHeroParallax]);

  const selectedTour = useMemo(
    () => bookingTourOptions.find((tour) => tour.id === tourId),
    [tourId]
  );
  const itineraryStops = useMemo(() => {
    if (!itineraryTour) {
      return [];
    }

    const configured = tourItineraryById[itineraryTour.id] || [];
    const fallbackStops = itineraryTour.stops.map((name, index) => ({
      name,
      isMustSee: false,
      isStart: index === 0,
    }));
    const stops = configured.length > 0 ? configured : fallbackStops;

    return stops.map((stop, index) => ({
      index: stop.index || index + 1,
      name: stop.name,
      isMustSee: Boolean(stop.isMustSee),
      isStart: Boolean(stop.isStart || index === 0),
    }));
  }, [itineraryTour]);

  const todayStart = useMemo(() => getStartOfDay(new Date()), []);
  const firstBookableDate = useMemo(() => getTomorrowStart(todayStart), [todayStart]);

  const selectedDateKey = useMemo(() => toDateKey(date), [date]);
  const customerData = useMemo(
    () => ({
      firstName: sanitizeCustomerText(customerFirstName, 80),
      lastName: sanitizeCustomerText(customerLastName, 80),
      phone: sanitizeCustomerText(customerPhone, 40),
      email: sanitizeCustomerText(customerEmail, 160).toLowerCase(),
    }),
    [customerEmail, customerFirstName, customerLastName, customerPhone]
  );
  const customerDataReady = useMemo(
    () => (
      customerData.firstName.length >= 2
      && customerData.lastName.length >= 2
      && isValidCustomerPhone(customerData.phone)
      && isValidCustomerEmail(customerData.email)
    ),
    [customerData]
  );
  const bookingReady = Boolean(date && timeSlot && tourId && customerDataReady);
  const guests = Number(people);
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  const weekdays = lang === 'it' ? ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const selectedDateLabel = useMemo(
    () =>
      date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [date, locale]
  );
  const selectedDateLong = useMemo(
    () =>
      date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [date, locale]
  );

  const monthTitle = useMemo(
    () => calendarMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
    [calendarMonth, locale]
  );
  const monthKey = useMemo(() => toMonthKey(calendarMonth), [calendarMonth]);
  const selectedDayAvailability = availabilityByDate[selectedDateKey];

  const calendarDays = useMemo(() => {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const nextMonthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    const daysInMonth = Math.round((nextMonthStart - monthStart) / 86400000);
    const startOffset = (monthStart.getDay() + 6) % 7;
    const cells = Array.from({ length: startOffset + daysInMonth }, (_, index) => {
      if (index < startOffset) {
        return { key: `empty-${index}`, empty: true };
      }
      const dayNumber = index - startOffset + 1;
      const value = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNumber);
      const isPast = value < firstBookableDate;
      const dayKey = toDateKey(value);
      const dayAvailability = availabilityByDate[dayKey];
      const isSelected =
        value.getFullYear() === date.getFullYear() &&
        value.getMonth() === date.getMonth() &&
        value.getDate() === date.getDate();
      const isToday =
        value.getFullYear() === todayStart.getFullYear() &&
        value.getMonth() === todayStart.getMonth() &&
        value.getDate() === todayStart.getDate();
      const blockedByAvailability = dayAvailability
        ? dayAvailability.allSlotsFull
        : (availabilityLoading || Boolean(availabilityError));
      return {
        key: value.toISOString(),
        value,
        dayKey,
        dayNumber,
        isPast,
        isSelected,
        isToday,
        blockedByAvailability,
      };
    });

    const missing = (7 - (cells.length % 7)) % 7;
    return [...cells, ...Array.from({ length: missing }, (_, idx) => ({ key: `tail-${idx}`, empty: true }))];
  }, [availabilityByDate, availabilityError, availabilityLoading, calendarMonth, date, firstBookableDate, todayStart]);

  useEffect(() => {
    let cancelled = false;

    const loadAvailability = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 7000);

      try {
        setAvailabilityLoading(true);
        const response = await fetch(`${API_BASE_URL}/availability?month=${monthKey}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          let apiMessage = '';
          try {
            const errorPayload = await response.json();
            apiMessage = String(errorPayload?.message || '').trim();
          } catch (parseError) {
            apiMessage = '';
          }
          throw new Error(apiMessage || `Impossibile caricare disponibilita (HTTP ${response.status}).`);
        }
        const payload = await response.json();
        if (!cancelled) {
          setAvailabilityError('');
          setAvailabilityByDate(payload.days || {});
        }
      } catch (error) {
        if (!cancelled) {
          const errorMessage = String(error?.message || '').trim();
          const isNetworkError =
            error?.name === 'AbortError'
            || errorMessage.toLowerCase().includes('failed to fetch')
            || errorMessage.toLowerCase().includes('networkerror')
            || errorMessage.toLowerCase().includes('network request');
          setAvailabilityError(
            isNetworkError
              ? availabilityNetworkErrorMessage
              : (errorMessage || 'Disponibilita temporaneamente non raggiungibile. Riprovo tra pochi secondi.')
          );
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [monthKey, availabilityRetryTick]);

  useEffect(() => {
    if (!availabilityError) {
      return undefined;
    }
    const retryTimer = window.setTimeout(() => {
      setAvailabilityRetryTick((current) => current + 1);
    }, 2500);
    return () => {
      window.clearTimeout(retryTimer);
    };
  }, [availabilityError]);

  useEffect(() => {
    const selectedSlotStatus = selectedDayAvailability?.slots?.[timeSlot];
    if (timeSlot && selectedSlotStatus && !selectedSlotStatus.available) {
      setTimeSlot('');
    }
  }, [selectedDayAvailability, timeSlot]);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!customerFormError) {
      return;
    }
    if (customerDataReady && Number.isInteger(guests) && guests >= 1 && guests <= 8) {
      setCustomerFormError('');
    }
  }, [customerDataReady, customerFormError, guests]);

  useEffect(() => {
    let cancelled = false;

    const loadPaymentConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/payment-config`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || 'Configurazione pagamento non disponibile.');
        }

        const providers = Array.isArray(payload.providers)
          ? payload.providers
            .map((provider) => String(provider || '').trim().toLowerCase())
            .filter(Boolean)
          : [];
        const normalizedProviders = providers.length > 0 ? providers : [FALLBACK_CHECKOUT_PROVIDER];

        if (!cancelled) {
          setPaymentConfigError('');
          setPaymentMode(String(payload.mode || FALLBACK_PAYMENT_MODE).trim().toLowerCase() || FALLBACK_PAYMENT_MODE);
          setPaymentProviders(normalizedProviders);
          setPaypalClientId(String(payload.paypalClientId || FALLBACK_PAYPAL_CLIENT_ID || '').trim());
          setSelectedPaymentProvider((current) => (normalizedProviders.includes(current) ? current : normalizedProviders[0]));
        }
      } catch (error) {
        if (!cancelled) {
          setPaymentConfigError('Configurazione pagamenti non raggiungibile. Uso impostazioni locali.');
          setPaymentMode(FALLBACK_PAYMENT_MODE);
          setPaymentProviders([FALLBACK_CHECKOUT_PROVIDER]);
          setPaypalClientId(FALLBACK_PAYPAL_CLIENT_ID);
          setSelectedPaymentProvider(FALLBACK_CHECKOUT_PROVIDER);
        }
      }
    };

    loadPaymentConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  const bookingPayload = {
    tourId,
    tourName: selectedTour?.title || '',
    date: selectedDateKey,
    time: timeSlot,
    people,
    customer: customerData,
    amount: selectedTour?.price || 0,
    currency: 'EUR',
  };

  const clearStepTimers = useCallback(() => {
    transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    transitionTimersRef.current = [];
  }, []);

  const transitionToStep = useCallback((nextStep, direction) => {
    clearStepTimers();
    setStepMotion(direction === 'forward' ? 'out-left' : 'out-right');
    const outTimer = window.setTimeout(() => {
      setCurrentStep(nextStep);
      setStepMotion(direction === 'forward' ? 'in-left' : 'in-right');
      const inTimer = window.setTimeout(() => {
        setStepMotion('idle');
      }, 280);
      transitionTimersRef.current.push(inTimer);
    }, 170);
    transitionTimersRef.current.push(outTimer);
  }, [clearStepTimers]);

  const restartBookingFlow = () => {
    clearStepTimers();
    const tomorrow = getTomorrowStart();
    setDate(tomorrow);
    setCalendarMonth(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
    setTimeSlot('');
    setTourId('');
    setPeople('2');
    setCustomerFirstName('');
    setCustomerLastName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerFormError('');
    setCompletedBooking(null);
    setSelectedPaymentProvider(paymentProviders[0] || FALLBACK_CHECKOUT_PROVIDER);
    setPaypalSdkError('');
    setIsPaying(false);
    paypalIntentIdRef.current = '';
    setStepMotion('idle');
    setCurrentStep(1);
  };

  const validateCustomerStep = useCallback(() => {
    if (customerData.firstName.length < 2) {
      setCustomerFormError('Inserisci un nome valido (almeno 2 caratteri).');
      return false;
    }
    if (customerData.lastName.length < 2) {
      setCustomerFormError('Inserisci un cognome valido (almeno 2 caratteri).');
      return false;
    }
    if (!isValidCustomerPhone(customerData.phone)) {
      setCustomerFormError('Inserisci un numero di cellulare valido.');
      return false;
    }
    if (!isValidCustomerEmail(customerData.email)) {
      setCustomerFormError('Inserisci un indirizzo email valido.');
      return false;
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
      setCustomerFormError('Numero ospiti non valido.');
      return false;
    }
    setCustomerFormError('');
    return true;
  }, [customerData.email, customerData.firstName, customerData.lastName, customerData.phone, guests]);

  const goToTimeStep = () => {
    if (!date) {
      window.alert(translateText('Seleziona una data prima di continuare.'));
      return;
    }
    if (date < firstBookableDate) {
      window.alert(translateText('Le prenotazioni sono disponibili da domani in poi.'));
      return;
    }
    if (!selectedDayAvailability) {
      window.alert(availabilityError || translateText('Disponibilita non ancora caricata. Attendi un attimo e riprova.'));
      return;
    }
    transitionToStep(2, 'forward');
  };

  const goToTourStep = () => {
    if (!selectedDayAvailability) {
      window.alert(availabilityError || translateText('Disponibilita non ancora caricata. Attendi un attimo e riprova.'));
      return;
    }
    const slotAvailability = selectedDayAvailability?.slots?.[timeSlot];
    if (!timeSlot || !slotAvailability || !slotAvailability.available) {
      window.alert(translateText('Seleziona un orario disponibile prima di continuare.'));
      return;
    }
    transitionToStep(3, 'forward');
  };

  const goToCustomerStep = () => {
    if (!tourId) {
      window.alert(translateText('Seleziona un tour prima di continuare.'));
      return;
    }
    transitionToStep(4, 'forward');
  };

  const goToConfirmStep = () => {
    if (!validateCustomerStep()) {
      window.alert(translateText('Completa correttamente i dati cliente prima di continuare.'));
      return;
    }
    transitionToStep(5, 'forward');
  };

  const goToPaymentStep = () => {
    if (!bookingReady) {
      window.alert(translateText('Completa data, orario, tour e dati cliente prima di andare al pagamento.'));
      return;
    }
    setCompletedBooking(null);
    setPaypalSdkError('');
    setSelectedPaymentProvider((current) => (
      paymentProviders.includes(current)
        ? current
        : (paymentProviders[0] || FALLBACK_CHECKOUT_PROVIDER)
    ));
    transitionToStep(6, 'forward');
  };

  const validateCheckoutPrerequisites = useCallback(() => {
    if (!validateCustomerStep()) {
      window.alert(translateText('Completa correttamente i dati cliente prima del pagamento.'));
      return false;
    }
    if (!bookingReady) {
      window.alert(translateText('Completa prima i dati della prenotazione.'));
      return false;
    }
    const selectedSlotStatus = selectedDayAvailability?.slots?.[timeSlot];
    if (selectedSlotStatus && !selectedSlotStatus.available) {
      window.alert(translateText('Lo slot selezionato non e piu disponibile. Scegline un altro.'));
      return false;
    }
    return true;
  }, [bookingReady, selectedDayAvailability, timeSlot, translateText, validateCustomerStep]);

  const createBookingIntent = useCallback(async () => {
    const intentResponse = await fetch(`${API_BASE_URL}/booking-intents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: bookingPayload.date,
        timeSlot: bookingPayload.time,
        guests: Number(bookingPayload.people),
        tourId: bookingPayload.tourId || null,
        firstName: bookingPayload.customer.firstName,
        lastName: bookingPayload.customer.lastName,
        phone: bookingPayload.customer.phone,
        email: bookingPayload.customer.email,
      }),
    });

    const intentPayload = await intentResponse.json();
    if (!intentResponse.ok || !intentPayload?.intentId) {
      throw new Error(intentPayload.message || 'Impossibile creare la prenotazione.');
    }

    return intentPayload;
  }, [
    bookingPayload.customer.email,
    bookingPayload.customer.firstName,
    bookingPayload.customer.lastName,
    bookingPayload.customer.phone,
    bookingPayload.date,
    bookingPayload.people,
    bookingPayload.time,
    bookingPayload.tourId,
  ]);

  const confirmBookingIntent = useCallback(async ({ intentId, paymentProvider, paymentReference }) => {
    const confirmResponse = await fetch(`${API_BASE_URL}/bookings/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intentId,
        paymentProvider,
        paymentReference,
      }),
    });

    const confirmPayload = await confirmResponse.json();
    if (!confirmResponse.ok) {
      throw new Error(confirmPayload.message || 'Pagamento non completato.');
    }

    return confirmPayload;
  }, []);

  const refreshAvailabilityForCurrentMonth = useCallback(async () => {
    const refresh = await fetch(`${API_BASE_URL}/availability?month=${monthKey}`);
    if (refresh.ok) {
      const refreshedData = await refresh.json();
      setAvailabilityByDate(refreshedData.days || {});
    }
  }, [monthKey]);

  const handlePaymentSuccess = useCallback(async ({ confirmPayload, paymentProvider, paymentReference }) => {
    const totalAmountEur = Number(
      confirmPayload.totalPriceEur
      ?? (selectedTour ? selectedTour.price * Number(people) : 0)
    );
    setCompletedBooking({
      bookingId: confirmPayload.bookingId || null,
      paymentReference,
      paymentProvider: String(paymentProvider || '').toUpperCase(),
      confirmedAt: new Date().toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: selectedDateLong,
      time: bookingPayload.time,
      tour: selectedTour?.title || bookingPayload.tourName || '-',
      guests: Number(bookingPayload.people) || 0,
      customerName: `${customerData.firstName} ${customerData.lastName}`.trim(),
      customerPhone: customerData.phone,
      customerEmail: customerData.email,
      total: Number.isFinite(totalAmountEur) ? totalAmountEur : 0,
    });
    transitionToStep(7, 'forward');
    await refreshAvailabilityForCurrentMonth();
  }, [
    bookingPayload.people,
    bookingPayload.time,
    bookingPayload.tourName,
    customerData.email,
    customerData.firstName,
    customerData.lastName,
    customerData.phone,
    people,
    refreshAvailabilityForCurrentMonth,
    locale,
    selectedDateLong,
    selectedTour,
    transitionToStep,
  ]);

  const startCheckout = () => {
    if (selectedPaymentProvider !== 'mock') {
      window.alert(translateText('Seleziona PayPal e completa il checkout dal pulsante PayPal.'));
      return;
    }
    if (!validateCheckoutPrerequisites()) {
      return;
    }

    const pay = async () => {
      try {
        setIsPaying(true);
        const intentPayload = await createBookingIntent();
        const paymentReference = `MOCK_${Date.now()}`;
        const confirmPayload = await confirmBookingIntent({
          intentId: intentPayload.intentId,
          paymentProvider: 'mock',
          paymentReference,
        });
        await handlePaymentSuccess({
          confirmPayload,
          paymentProvider: 'mock',
          paymentReference,
        });
      } catch (error) {
        window.alert(error.message || translateText('Errore durante il pagamento.'));
      } finally {
        setIsPaying(false);
      }
    };

    pay();
  };

  const loadPayPalSdk = useCallback(async () => {
    if (typeof window === 'undefined') {
      throw new Error('PayPal SDK non disponibile in questo ambiente.');
    }
    if (!paypalClientId) {
      throw new Error('PayPal non configurato sul server.');
    }

    if (window.paypal?.Buttons) {
      return window.paypal;
    }

    const scriptSrc = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=${PAYPAL_CURRENCY}&intent=capture`;
    const existingScript = document.getElementById(PAYPAL_SCRIPT_ID);
    if (existingScript) {
      if (existingScript.getAttribute('data-client-id') === paypalClientId) {
        await new Promise((resolve, reject) => {
          existingScript.addEventListener('load', resolve, { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Impossibile caricare PayPal SDK.')), { once: true });
        });
        if (window.paypal?.Buttons) {
          return window.paypal;
        }
      } else {
        existingScript.remove();
      }
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = PAYPAL_SCRIPT_ID;
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute('data-client-id', paypalClientId);
      script.onload = resolve;
      script.onerror = () => reject(new Error('Impossibile caricare PayPal SDK.'));
      document.body.appendChild(script);
    });

    if (!window.paypal?.Buttons) {
      throw new Error('PayPal SDK caricato ma non inizializzato.');
    }

    return window.paypal;
  }, [paypalClientId]);

  useEffect(() => {
    if (selectedPaymentProvider !== 'paypal' || currentStep !== 6) {
      setPaypalSdkReady(false);
      setPaypalSdkError('');
      paypalIntentIdRef.current = '';
      paypalButtonsRenderedRef.current = false;
      if (paypalButtonsRef.current) {
        paypalButtonsRef.current.innerHTML = '';
      }
      return;
    }

    if (!paypalClientId) {
      setPaypalSdkReady(false);
      setPaypalSdkError('PayPal non configurato: manca il Client ID.');
      return;
    }

    let cancelled = false;
    let paypalButtonsInstance = null;
    const paypalButtonsHost = paypalButtonsRef.current;

    const mountPayPalButtons = async () => {
      try {
        setPaypalSdkError('');
        const paypal = await loadPayPalSdk();
        if (cancelled || !paypalButtonsHost) {
          return;
        }

        setPaypalSdkReady(true);
        paypalButtonsHost.innerHTML = '';
        paypalButtonsRenderedRef.current = false;

        paypalButtonsInstance = paypal.Buttons({
          style: {
            shape: 'pill',
            layout: 'horizontal',
            height: 48,
            label: 'paypal',
            tagline: false,
          },
          onClick: (_data, actions) => {
            if (!validateCheckoutPrerequisites()) {
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: async () => {
            const intentPayload = await createBookingIntent();
            paypalIntentIdRef.current = intentPayload.intentId;

            const orderResponse = await fetch(`${API_BASE_URL}/paypal/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ intentId: intentPayload.intentId }),
            });
            const orderPayload = await orderResponse.json();
            if (!orderResponse.ok || !orderPayload?.orderId) {
              paypalIntentIdRef.current = '';
              throw new Error(orderPayload.message || 'Impossibile avviare il checkout PayPal.');
            }
            return orderPayload.orderId;
          },
          onApprove: async (data) => {
            try {
              if (!paypalIntentIdRef.current) {
                throw new Error('Intent PayPal non disponibile. Riprova.');
              }
              setIsPaying(true);

              const captureResponse = await fetch(`${API_BASE_URL}/paypal/orders/${encodeURIComponent(data.orderID)}/capture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              const capturePayload = await captureResponse.json();
              if (!captureResponse.ok) {
                throw new Error(capturePayload.message || 'Pagamento PayPal non completato.');
              }

              const paymentReference = String(capturePayload.captureId || capturePayload.orderId || data.orderID || '').trim();
              const confirmPayload = await confirmBookingIntent({
                intentId: paypalIntentIdRef.current,
                paymentProvider: 'paypal',
                paymentReference,
              });
              await handlePaymentSuccess({
                confirmPayload,
                paymentProvider: 'paypal',
                paymentReference,
              });
              paypalIntentIdRef.current = '';
              setPaypalSdkError('');
            } catch (error) {
              setPaypalSdkError(error.message || translateText('Errore durante il pagamento PayPal.'));
              window.alert(error.message || translateText('Errore durante il pagamento PayPal.'));
            } finally {
              setIsPaying(false);
            }
          },
          onCancel: () => {
            paypalIntentIdRef.current = '';
            setIsPaying(false);
          },
          onError: (error) => {
            paypalIntentIdRef.current = '';
            const message = error?.message || 'Errore durante il checkout PayPal.';
            setPaypalSdkError(message);
          },
        });

        if (!paypalButtonsInstance || (paypalButtonsInstance.isEligible && !paypalButtonsInstance.isEligible())) {
          setPaypalSdkError('PayPal non disponibile su questo dispositivo/browser.');
          return;
        }

        await paypalButtonsInstance.render(paypalButtonsHost);
        if (!cancelled) {
          paypalButtonsRenderedRef.current = true;
        }
      } catch (error) {
        if (!cancelled) {
          setPaypalSdkReady(false);
          setPaypalSdkError(error.message || 'Impossibile caricare il checkout PayPal.');
        }
      }
    };

    mountPayPalButtons();

    return () => {
      cancelled = true;
      paypalButtonsRenderedRef.current = false;
      if (paypalButtonsHost) {
        paypalButtonsHost.innerHTML = '';
      }
      if (paypalButtonsInstance?.close) {
        paypalButtonsInstance.close();
      }
    };
  }, [
    confirmBookingIntent,
    createBookingIntent,
    currentStep,
    handlePaymentSuccess,
    loadPayPalSdk,
    paypalClientId,
    selectedPaymentProvider,
    translateText,
    validateCheckoutPrerequisites,
  ]);

  return (
    <>
      <div className="page">
        <BackgroundArtLayer />
        <Cursor />
        <NavbarMarbleLuxury />

      <section
        ref={heroSectionRef}
        className="hero"
        id="home"
        onMouseEnter={handleHeroMouseEnter}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div
          className="hero-bg-image"
          style={{ backgroundImage: "url('/images/rome-hero-sunset.webp')" }}
          aria-hidden="true"
        />
        <div className="hero-aurora-layer" aria-hidden="true">
          <AuroraShader
            className="hero-aurora-canvas"
            colorStops={heroAuroraColorStops}
            amplitude={1.12}
            blend={0.5}
            speed={0.7}
          />
        </div>
        <div className="hero-overlay-luxury" aria-hidden="true" />
        <div className="hero-overlay-glow" aria-hidden="true" />
        <div className="hero-overlay-noise" aria-hidden="true" />
        <HeroAtmosphere />
        <div
          ref={heroGradientHostRef}
          className={`hero-hover-gradient ${isHeroGradientActive ? 'active' : ''}`}
          aria-hidden="true"
        >
          <BackgroundGradientAnimation className="hero-hover-gradient-inner" />
        </div>
        <div className="hero-content hero-layout">
          <div className="hero-media-grid" aria-label="Foto di Roma">
            {heroRomeImages.map((image, index) => (
              <figure
                key={image}
                className={`hero-media-card hero-media-card-${index + 1}`}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const y = event.clientY - rect.top;
                  const tiltStrength = 13;
                  const rotateY = ((x / rect.width) * 2 - 1) * tiltStrength;
                  const rotateX = -((y / rect.height) * 2 - 1) * tiltStrength;
                  event.currentTarget.style.setProperty('--hero-rx', `${rotateX.toFixed(2)}deg`);
                  event.currentTarget.style.setProperty('--hero-ry', `${rotateY.toFixed(2)}deg`);
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.setProperty('--hero-rx', '0deg');
                  event.currentTarget.style.setProperty('--hero-ry', '0deg');
                }}
              >
                <img src={image} alt={`Roma scorcio ${index + 1}`} />
              </figure>
            ))}
          </div>
          <div className="hero-copy">
            <h1>
              <span className="hero-title-light">Roma</span>
              <br />
              <span className="hero-title-light">Tuk</span>
              <br />
              <span className="hero-title-accent">Tours</span>
            </h1>
            <span className="hero-title-streak" aria-hidden="true" />
            <h2>Vivi Roma in modo unico</h2>
            <p>
              Scopri la citta in modo comodo, panoramico e senza stress.
            </p>
            <div className="hero-actions">
              <a href="#prenota" className="hero-cta" onClick={(event) => handleHeroCtaClick(event, '#prenota')}>
                Prenota Ora <span>{"\u2192"}</span>
              </a>
              <a href="#tour" className="hero-cta hero-cta-alt" onClick={(event) => handleHeroCtaClick(event, '#tour')}>
                <span className="hero-cta-dot" aria-hidden="true">{"\u29BF"}</span> Scopri i tour
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat-item">
                <strong>10K+</strong>
                <small>Turisti Felici</small>
              </div>
              <div className="hero-stat-item">
                <strong>15+</strong>
                <small>Tour Disponibili</small>
              </div>
              <div className="hero-stat-item">
                <strong>4.9{"\u2605"}</strong>
                <small>Valutazione Media</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tours" id="tour">
        <h2>
          I Nostri <span>Tour</span>
        </h2>
        <p className="section-subtitle">
          Scegli l&#39;esperienza perfetta per te e scopri Roma come mai prima d&#39;ora
        </p>

        <div className="tour-grid">
          {tours.map((tour) => (
            <TourShowcaseCard
              key={tour.id}
              tour={tour}
              onViewRoute={() => {
                setItineraryTour(tour);
                setIsItineraryOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <section className="booking" id="prenota">
        <div className="booking-head-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3.8" y="5.2" width="16.4" height="14.6" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <path d="M3.8 9.4H20.2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3.1V6.3M16 3.1V6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 12.3H9.9M11.3 12.3H13.2M14.8 12.3H16.7M8 15.6H9.9M11.3 15.6H13.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <h2>
          Prenota il Tuo <span>Tour</span>
        </h2>
        <p>Scegli la data e l'orario perfetto per la tua esperienza indimenticabile a Roma</p>

        <ol className="booking-steps">
          {Array.from({ length: BOOKING_TOTAL_STEPS }, (_, index) => index + 1).map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 ? <li className={`booking-step-line ${currentStep >= step ? 'active' : ''}`} /> : null}
              <li className={`booking-step-dot ${currentStep >= step ? 'active' : ''}`}>{step}</li>
            </React.Fragment>
          ))}
        </ol>

        <div className={`booking-stage ${stepMotion !== 'idle' ? `booking-stage-${stepMotion}` : ''}`}>
          {currentStep === 1 ? (
            <div className="booking-stage-panel">
              <div className="booking-month-row">
                <button
                  type="button"
                  className="booking-month-arrow"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                >
                  {"\u2039"}
                </button>
                <h3>{monthTitle}</h3>
                <button
                  type="button"
                  className="booking-month-arrow"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                >
                  {"\u203A"}
                </button>
              </div>

              <div className="booking-calendar-card">
                <div className="booking-calendar-weekdays">
                  {weekdays.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>

                <div className="booking-calendar-grid">
                  {calendarDays.map((cell) => {
                    if (cell.empty) {
                      return <span key={cell.key} className="booking-day-empty" aria-hidden="true" />;
                    }
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        disabled={cell.isPast || cell.blockedByAvailability}
                        className={`booking-day ${cell.isPast ? 'past' : ''} ${cell.blockedByAvailability ? 'full' : ''} ${cell.isToday ? 'current' : ''} ${cell.isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setDate(cell.value);
                          setCalendarMonth(new Date(cell.value.getFullYear(), cell.value.getMonth(), 1));
                        }}
                      >
                        {cell.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="button" className="booking-primary-cta" onClick={goToTimeStep}>
                Avanti
              </button>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="booking-stage-panel">
              <div className="booking-selected-date">
                <span aria-hidden="true">{"\u{1F4C5}"}</span>
                <strong>{selectedDateLabel}</strong>
              </div>

                <div className="booking-time-card">
                  <h3 className="booking-strong-title">
                    Scegli la <span>Fascia Oraria</span>
                  </h3>
                <div className="booking-time-grid">
                  {availableTimes.map((time) => {
                    const slotAvailability = selectedDayAvailability?.slots?.[time];
                    const slotUnavailable = !slotAvailability || !slotAvailability.available;
                    return (
                      <button
                        type="button"
                        key={time}
                        disabled={slotUnavailable}
                        className={`booking-time-slot ${timeSlot === time ? 'selected' : ''} ${slotUnavailable ? 'unavailable' : ''}`}
                        onClick={() => setTimeSlot(time)}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {availabilityLoading ? <p className="booking-availability-error">Aggiornamento disponibilita in corso...</p> : null}
                {availabilityError ? <p className="booking-availability-error">{availabilityError}</p> : null}
              </div>

              <div className="booking-nav-row">
                <button type="button" className="booking-ghost-btn" onClick={() => transitionToStep(1, 'backward')}>
                  Indietro
                </button>
                <button type="button" className="booking-primary-cta" onClick={goToTourStep}>
                  Avanti
                </button>
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="booking-stage-panel">
              <div className="booking-tour-card">
                <h3 className="booking-strong-title">
                  Scegli il <span>Tour</span>
                </h3>
                <div className="booking-tour-grid">
                  {bookingTourOptions.map((tour) => (
                    <BackgroundGradient
                      key={tour.id}
                      containerClassName={`booking-tour-gradient ${tourId === tour.id ? 'selected' : ''}`}
                      className="booking-tour-gradient-content"
                    >
                      <button
                        type="button"
                        className={`booking-tour-option ${tourId === tour.id ? 'selected' : ''}`}
                        onClick={() => setTourId(tour.id)}
                      >
                        {tour.popular ? <span className="booking-tour-popular">{"PI\u00D9 POPOLARE"}</span> : null}
                        <div className="booking-tour-media">
                          <img src={tour.image} alt={tour.title} />
                          <span className="booking-tour-rating">
                            <span>{"\u2605"}</span>
                            {tour.rating}
                          </span>
                        </div>

                        <div className="booking-tour-content">
                          <span className="booking-tour-name">{tour.title}</span>
                          <p>{tour.description}</p>
                          <div className="booking-tour-tags">
                            {tour.stops.map((stop) => (
                              <span key={stop}>{stop}</span>
                            ))}
                          </div>
                          <div className="booking-tour-meta">
                            <span>{"\u25F7"} {tour.duration}</span>
                            <span>{"\u{1F465}"} {tour.capacity}</span>
                          </div>
                          <strong>EUR {tour.price}</strong>
                        </div>
                      </button>
                    </BackgroundGradient>
                  ))}
                </div>
              </div>

              <div className="booking-nav-row">
                <button type="button" className="booking-ghost-btn" onClick={() => transitionToStep(2, 'backward')}>
                  Indietro
                </button>
                <button type="button" className="booking-primary-cta" onClick={goToCustomerStep}>
                  Avanti
                </button>
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="booking-stage-panel">
              <div className="booking-customer-card">
                <div className="booking-confirm-icon" aria-hidden="true">
                  <span className="booking-confirm-icon-core">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.4" stroke="currentColor" strokeWidth="2.2" />
                      <path d="M8.2 15.6V14.8C8.2 13.4 9.3 12.3 10.7 12.3H13.3C14.7 12.3 15.8 13.4 15.8 14.8V15.6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                      <circle cx="12" cy="9" r="2.1" stroke="currentColor" strokeWidth="2.1" />
                    </svg>
                  </span>
                </div>
                <h3 className="booking-strong-title">
                  INSERISCI I TUOI <span>DATI</span>
                </h3>
                <p>Aggiungi i dati del cliente e il numero ospiti prima della conferma.</p>

                <div className="booking-customer-grid">
                  <label className="booking-customer-field">
                    <span>Nome</span>
                    <input
                      type="text"
                      value={customerFirstName}
                      onChange={(event) => setCustomerFirstName(event.target.value)}
                      placeholder="Mario"
                      autoComplete="given-name"
                    />
                  </label>
                  <label className="booking-customer-field">
                    <span>Cognome</span>
                    <input
                      type="text"
                      value={customerLastName}
                      onChange={(event) => setCustomerLastName(event.target.value)}
                      placeholder="Rossi"
                      autoComplete="family-name"
                    />
                  </label>
                  <label className="booking-customer-field">
                    <span>Cellulare</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="+39 333 123 4567"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="booking-customer-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      placeholder="cliente@email.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <div className="booking-confirm-row booking-guests-row">
                  <div className="icon">{"\u{1F465}"}</div>
                  <div>
                    <small>
                      Numero Ospiti <span className="booking-inline-gradient">(18+)</span>
                    </small>
                    <div className="booking-guests">
                      <button type="button" onClick={() => setPeople(String(Math.max(1, guests - 1)))}>
                        {"\u2212"}
                      </button>
                      <strong>{people}</strong>
                      <button type="button" onClick={() => setPeople(String(Math.min(8, guests + 1)))}>
                        +
                      </button>
                    </div>
                    <small className="booking-guests-note">I bambini non pagano.</small>
                  </div>
                </div>

                {customerFormError ? <p className="booking-customer-error">{customerFormError}</p> : null}
              </div>

              <div className="booking-nav-row">
                <button type="button" className="booking-ghost-btn" onClick={() => transitionToStep(3, 'backward')}>
                  Indietro
                </button>
                <button type="button" className="booking-primary-cta" onClick={goToConfirmStep}>
                  Avanti
                </button>
              </div>
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="booking-stage-panel">
              <div className="booking-confirm-card">
                <div className="booking-confirm-icon" aria-hidden="true">
                  <span className="booking-confirm-icon-core">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5.5 12.8L10.1 17.2L18.6 7.8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <h3 className="booking-strong-title">
                  Conferma la tua <span>Prenotazione</span>
                </h3>
                <p>Rivedi i dettagli prima del pagamento.</p>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F4C5}"}</div>
                  <div>
                    <small>Data</small>
                    <strong>{selectedDateLong}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u25F7"}</div>
                  <div>
                    <small>Orario</small>
                    <strong>{timeSlot || '-'}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F464}"}</div>
                  <div>
                    <small>Cliente</small>
                    <strong>{`${customerData.firstName} ${customerData.lastName}`}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u260E"}</div>
                  <div>
                    <small>Contatti</small>
                    <strong>{customerData.phone}</strong>
                    <small>{customerData.email}</small>
                  </div>
                </div>

                {selectedTour ? (
                  <div className="booking-confirm-row">
                    <div className="icon">{"\u{1F695}"}</div>
                    <div>
                      <small>Tour</small>
                      <strong>{selectedTour.title}</strong>
                    </div>
                  </div>
                ) : null}

                {selectedTour ? (
                  <div className="booking-confirm-row">
                    <div className="icon">{"\u20AC"}</div>
                    <div>
                      <small>Prezzo Totale ({people} ospiti)</small>
                      <strong>EUR {selectedTour.price * Number(people)}</strong>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="booking-nav-row">
                <button type="button" className="booking-ghost-btn" onClick={() => transitionToStep(4, 'backward')}>
                  Indietro
                </button>
                <button type="button" className="booking-primary-cta" onClick={goToPaymentStep}>
                  Procedi al Pagamento
                </button>
              </div>
            </div>
          ) : null}

          {currentStep === 6 ? (
            <div className="booking-stage-panel">
              <div className="booking-payment-card">
                <div className="booking-payment-icon" aria-hidden="true">
                  <span>P</span>
                </div>
                <h3>Pagamento</h3>
                <p>Seleziona il metodo di pagamento per completare la prenotazione.</p>
                <div className="booking-payment-methods">
                  {paymentProviders.map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className={`booking-paypal-method booking-payment-method ${selectedPaymentProvider === provider ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedPaymentProvider(provider);
                        setPaypalSdkError('');
                      }}
                      disabled={isPaying}
                    >
                      <span className="pp-badge">{provider === 'mock' ? 'TEST' : 'PayPal'}</span>
                      <strong>
                        {provider === 'mock'
                          ? 'Pagamento simulato (ambiente test)'
                          : 'Paga in sicurezza con PayPal'}
                      </strong>
                      <small>
                        Totale: EUR {formatEurAmount(selectedTour ? selectedTour.price * Number(people) : 0, locale)}
                      </small>
                    </button>
                  ))}
                </div>
                {paymentConfigError ? <p className="booking-availability-error">{paymentConfigError}</p> : null}
                {paymentMode === 'mock' ? <p className="booking-availability-error">Ambiente pagamento: TEST (mock + PayPal sandbox).</p> : null}
                {selectedPaymentProvider === 'paypal' && paypalSdkError ? <p className="booking-availability-error">{paypalSdkError}</p> : null}
                {selectedPaymentProvider === 'paypal' && !paypalSdkError && !paypalSdkReady ? (
                  <p className="booking-availability-error">Caricamento checkout PayPal in corso...</p>
                ) : null}
              </div>

              <div className={`booking-nav-row ${selectedPaymentProvider === 'paypal' ? 'booking-nav-row-paypal' : ''}`}>
                <button type="button" className="booking-ghost-btn" onClick={() => transitionToStep(5, 'backward')} disabled={isPaying}>
                  Indietro
                </button>
                {selectedPaymentProvider === 'paypal' ? (
                  <div className="booking-paypal-buttons-shell">
                    <div ref={paypalButtonsRef} className="booking-paypal-buttons" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="booking-primary-cta booking-paypal-btn"
                    onClick={startCheckout}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Pagamento in corso...' : 'Conferma Pagamento Test'}
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {currentStep === 7 ? (
            <div className="booking-stage-panel booking-stage-panel-success">
              <div className="booking-confirm-card booking-success-card">
                <div className="booking-confirm-icon booking-success-icon" aria-hidden="true">
                  <span className="booking-confirm-icon-core">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5.5 12.8L10.1 17.2L18.6 7.8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <span className="booking-success-pill">Pagamento completato</span>
                <h3 className="booking-strong-title">
                  Prenotazione <span>Confermata</span>
                </h3>
                <p>Il tuo tour e stato prenotato con successo. Abbiamo bloccato lo slot selezionato.</p>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F4C5}"}</div>
                  <div>
                    <small>Data</small>
                    <strong>{completedBooking?.date || selectedDateLong}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u25F7"}</div>
                  <div>
                    <small>Orario</small>
                    <strong>{completedBooking?.time || timeSlot || '-'}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F695}"}</div>
                  <div>
                    <small>Tour</small>
                    <strong>{completedBooking?.tour || selectedTour?.title || '-'}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F464}"}</div>
                  <div>
                    <small>Cliente</small>
                    <strong>{completedBooking?.customerName || `${customerData.firstName} ${customerData.lastName}`.trim()}</strong>
                    <small>{completedBooking?.customerPhone || customerData.phone} | {completedBooking?.customerEmail || customerData.email}</small>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F465}"}</div>
                  <div>
                    <small>Ospiti</small>
                    <strong>{completedBooking?.guests || Number(people) || 0}</strong>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u{1F4B3}"}</div>
                  <div>
                    <small>Riferimento Pagamento</small>
                    <strong>{completedBooking?.paymentReference || '-'}</strong>
                    <small>
                      Metodo: {completedBooking?.paymentProvider || selectedPaymentProvider.toUpperCase()} | Conferma: {completedBooking?.confirmedAt || '-'}
                    </small>
                  </div>
                </div>

                <div className="booking-confirm-row">
                  <div className="icon">{"\u20AC"}</div>
                  <div>
                    <small>Totale Pagato</small>
                    <strong>EUR {formatEurAmount(completedBooking?.total, locale)}</strong>
                  </div>
                </div>
              </div>

              <div className="booking-nav-row booking-nav-row-success">
                <button type="button" className="booking-primary-cta" onClick={restartBookingFlow}>
                  Nuova Prenotazione
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="gallery-showcase" id="galleria">
        <h2>
          La Nostra <span>Galleria</span>
        </h2>
        <p>Scopri la bellezza di Roma attraverso gli occhi dei nostri tour</p>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <figure key={image} className="gallery-card">
              <img src={image} alt={`Galleria Roma ${index + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      <section
        className="footer-cta ctaSection"
        id="contattaci"
        style={sharedCtaImageStyle}
      >
        <BackgroundGradientAnimation className="gradient-demo-bg ctaBg">
          <div className="gradient-demo-overlay">
            <CtaMarbleTriptych />
          </div>
        </BackgroundGradientAnimation>
      </section>

        <section
          className="footer-map-section"
          aria-labelledby="footer-map-title"
          style={sharedFooterMapImageStyle}
        >
          <aside className="footer-map-feature footer-map-feature-reviews" aria-label="Tour reviews">
            <figure className="footer-map-feature-art">
              <img src="/bg/details/rome-detail-pantheon.png" alt="Illustrazione del Pantheon" />
            </figure>
          </aside>

          <aside className="footer-map-feature footer-map-feature-tourists" aria-label="Happy tourists">
            <figure className="footer-map-feature-art">
              <img src="/bg/details/rome-detail-colosseo.png" alt="Illustrazione del Colosseo" />
            </figure>
          </aside>

        

          <div className="footer-map-head">
            <h3 id="footer-map-title">
              Dove <span>Siamo</span>?
            </h3>
            <p>Venite a trovarci! Siamo aperti dalle 7:00 alle 23:00</p>
          </div>

          <div className="footer-map-shell">
            <iframe
              title="Mappa sede Tuk Tuk Roma - Via Cavour 134"
              src="https://maps.google.com/maps?q=Via%20Cavour%20134%2C%20Roma&t=&z=16&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            
            
            <a
              className="footer-map-cta"
              href="https://maps.google.com/?q=Via+Cavour+134+Roma"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Vieni a Trovarci!</span>
              <span className="footer-map-cta-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 16V9.5c0-1.4 1.1-2.5 2.5-2.5h9c1.4 0 2.5 1.1 2.5 2.5V16" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" />
                  <circle cx="15.5" cy="16.5" r="1.5" fill="currentColor" />
                </svg>
              </span>
            </a>

            <div className="footer-map-dots" aria-hidden="true">
              <span className="active" />
              <span />
              <span />
            </div>
          </div>

          <div className="footer-map-benefits" aria-label="Tour benefits">
            <span>
              <i>✓</i> Cancellazione Gratuita
            </span>
            <span>
              <i>◎</i> Esperienza Personalizzata
            </span>
            <span>
              <i>↗</i> Miglior Prezzo Garantito
            </span>
          </div>
        </section>

      <HeroFooterScene />

      <ItineraryDrawer
        open={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        tourTitle={itineraryTour?.title || 'Roma Da Romano'}
        stops={itineraryStops}
      />
      </div>
    </>
  );
}

export default App;


  
