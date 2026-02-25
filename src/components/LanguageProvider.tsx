import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import Toast from './Toast';

const STORAGE_KEY = 'site_lang';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'] as const;
const NON_TRANSLATABLE_SELECTOR = 'script, style, noscript, iframe, code, pre, [data-no-translate="true"]';

const TRANSLATIONS = {
  en: {
    'nav.tours': 'Tours',
    'nav.experiences': 'Experiences',
    'nav.gallery': 'Gallery',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact Us',
    'nav.bookNow': 'Book Now',
    'lang.english': 'English',
    'lang.italian': 'Italian',
  },
  it: {
    'nav.tours': 'Tour',
    'nav.experiences': 'Esperienze',
    'nav.gallery': 'Galleria',
    'nav.pricing': 'Prezzi',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatti',
    'nav.bookNow': 'Prenota Ora',
    'lang.english': 'Inglese',
    'lang.italian': 'Italiano',
  },
} as const;

const IT_TO_EN_TEXT_REPLACEMENTS: Record<string, string> = {
  'Vivi Roma in modo unico': 'Experience Rome in a unique way',
  'Scopri la citta in modo comodo, panoramico e senza stress.': 'Discover the city in a comfortable, panoramic and stress-free way.',
  'Scopri i tour': 'Explore tours',
  'PI\u00D9 POPOLARE': 'MOST POPULAR',
  'Roma Da Romano': 'Rome Like a Roman',
  'Roma \n Da Romano': 'Rome Like a Roman',
  'Roma Mangia Prega Ama': 'Rome Eat Pray Love',
  'A Roma fai come i Romani': 'When in Rome do as the Romans do',
  'Roma tour mangia prega ama': 'Rome eat pray love tour',
  "L'esperienza definitiva della citta eterna": 'The ultimate experience of the eternal city',
  "L'esperienza completa per vivere Roma come un locale.": 'The complete experience to live Rome like a local.',
  'Tra vicoli iconici, sapori romani e scorci indimenticabili.': 'Through iconic alleys, Roman flavors and unforgettable views.',
  'Esplora i monumenti piu iconici di Roma': 'Explore the most iconic monuments of Rome',
  '3 ore': '3 hours',
  '5 ore': '5 hours',
  '2.5 ore': '2.5 hours',
  '1-4 persone': '1-4 people',
  'Turisti Felici': 'Happy Tourists',
  'Tour Disponibili': 'Available Tours',
  'Valutazione Media': 'Average Rating',
  'I Nostri Tour': 'Our Tours',
  'I Nostri ': 'Our ',
  "Scegli l'esperienza perfetta per te e scopri Roma come mai prima d'ora": 'Choose the perfect experience for you and discover Rome like never before',
  'Percorso del Tour': 'Tour Route',
  'Chiudi percorso': 'Close route',
  'Chiudi Percorso': 'Close Route',
  'Tappa': 'Stop',
  'Partenza': 'Start',
  'tappe totali': 'total stops',
  'tappe': 'stops',
  'imperdibili': 'must-sees',
  'Imperdibile': 'Must-see',
  'A partire da': 'Starting from',
  'Vedi percorso': 'View route',
  'Scegli la Fascia Oraria': 'Choose Time Slot',
  'Aggiornamento disponibilita in corso...': 'Updating availability...',
  'Scegli il Tour': 'Choose Tour',
  'Scegli il ': 'Choose ',
  'INSERISCI I TUOI DATI': 'ENTER YOUR DETAILS',
  'INSERISCI I TUOI ': 'ENTER YOUR ',
  'DATI': 'DETAILS',
  'Aggiungi i dati del cliente e il numero ospiti prima della conferma.': 'Add customer details and the number of guests before confirmation.',
  'Nome': 'First Name',
  'Cognome': 'Last Name',
  'Cellulare': 'Phone',
  'Numero Ospiti': 'Number of Guests',
  'I bambini non pagano.': 'Children do not pay.',
  'Conferma la tua Prenotazione': 'Confirm your Booking',
  'Conferma la tua ': 'Confirm your ',
  'Rivedi i dettagli prima del pagamento.': 'Review details before payment.',
  'Data': 'Date',
  'Orario': 'Time',
  'Cliente': 'Customer',
  'Contatti': 'Contacts',
  'Prezzo Totale': 'Total Price',
  'Procedi al Pagamento': 'Proceed to Payment',
  'Pagamento': 'Payment',
  'Seleziona il metodo di pagamento per completare la prenotazione.': 'Select the payment method to complete the booking.',
  'Pagamento simulato (ambiente test)': 'Simulated payment (test environment)',
  'Paga in sicurezza con PayPal': 'Pay securely with PayPal',
  'Totale:': 'Total:',
  'Ambiente pagamento: TEST (mock + PayPal sandbox).': 'Payment environment: TEST (mock + PayPal sandbox).',
  'Caricamento checkout PayPal in corso...': 'Loading PayPal checkout...',
  'Pagamento in corso...': 'Payment in progress...',
  'Conferma Pagamento Test': 'Confirm Test Payment',
  'Pagamento completato': 'Payment completed',
  'Prenotazione Confermata': 'Booking Confirmed',
  'Confermata': 'Confirmed',
  'Il tuo tour e stato prenotato con successo. Abbiamo bloccato lo slot selezionato.': 'Your tour has been booked successfully. We reserved your selected slot.',
  'Ospiti': 'Guests',
  'Riferimento Pagamento': 'Payment Reference',
  'Metodo:': 'Method:',
  'Conferma:': 'Confirmation:',
  'Totale Pagato': 'Total Paid',
  'Nuova Prenotazione': 'New Booking',
  'La Nostra Galleria': 'Our Gallery',
  'La Nostra ': 'Our ',
  'Scopri la bellezza di Roma attraverso gli occhi dei nostri tour': 'Discover the beauty of Rome through our tours',
  'Dove Siamo?': 'Where Are We?',
  'Dove ': 'Where ',
  'Siamo': 'Are We',
  'Venite a trovarci! Siamo aperti dalle 7:00 alle 23:00': 'Come visit us! We are open from 7:00 to 23:00',
  'Mappa sede Tuk Tuk Roma - Via Cavour 134': 'Tuk Tuk Roma office map - Via Cavour 134',
  '00184 Roma, Italia': '00184 Rome, Italy',
  'Vieni a Trovarci!': 'Come Visit Us!',
  'Cancellazione Gratuita': 'Free Cancellation',
  'Esperienza Personalizzata': 'Personalized Experience',
  'Miglior Prezzo Garantito': 'Best Price Guaranteed',
  'Tour privati a Roma': 'Private tours in Rome',
  'Scopri Roma in Tuk Tuk': 'Discover Rome by Tuk Tuk',
  'Vivi la citta eterna da una prospettiva speciale: itinerari esclusivi, guida locale e fermate iconiche in totale comfort.': 'Experience the eternal city from a special perspective: exclusive itineraries, local guide, and iconic stops in total comfort.',
  'Prenota un Tour': 'Book a Tour',
  'Contattaci': 'Contact Us',
  'Rome sunset rides': 'Rome sunset rides',
  'Scopri Roma in modo unico e indimenticabile con i nostri tour in tuk tuk. Esperienza, professionalita e passione in ogni percorso.': 'Discover Rome in a unique and unforgettable way with our tuk tuk tours. Experience, professionalism and passion in every route.',
  'Link Veloci': 'Quick Links',
  'Orari': 'Hours',
  'Lun - Ven': 'Mon - Fri',
  'Sabato': 'Saturday',
  'Domenica': 'Sunday',
  'Informativa sulla privacy': 'Privacy Policy',
  'Termini e Condizioni': 'Terms and Conditions',
  'Politica sui cookie': 'Cookie Policy',
  'Recensioni Tour': 'Tour reviews',
  'Turisti felici': 'Happy tourists',
  'Vantaggi tour': 'Tour benefits',
  'Lingua': 'Language',
  'Link social': 'Social links',
  'Progettato da': 'Designed by',
  'Pronti a Vivere Roma?': 'Ready to Experience Rome?',
  'la magia della citt\u00E0 eterna': 'the magic of the eternal city',
  'la magia della citta eterna': 'the magic of the eternal city',
  'Prenota il Tuo ': 'Book Your ',
  'Prenota il Tuo Tour': 'Book Your Tour',
  'Chiama Ora': 'Call Now',
  'Telefono': 'Phone',
  'Inserisci un nome valido (almeno 2 caratteri).': 'Enter a valid first name (at least 2 characters).',
  'Inserisci un cognome valido (almeno 2 caratteri).': 'Enter a valid last name (at least 2 characters).',
  'Inserisci un numero di cellulare valido.': 'Enter a valid phone number.',
  'Inserisci un indirizzo email valido.': 'Enter a valid email address.',
  'Numero ospiti non valido.': 'Invalid number of guests.',
  'Seleziona un tour prima di continuare.': 'Select a tour before continuing.',
  'Seleziona una data prima di continuare.': 'Select a date before continuing.',
  'Le prenotazioni sono disponibili da domani in poi.': 'Bookings are available starting tomorrow.',
  'Disponibilita non ancora caricata. Attendi un attimo e riprova.': 'Availability not loaded yet. Wait a moment and try again.',
  'Seleziona un orario disponibile prima di continuare.': 'Select an available time before continuing.',
  'Completa correttamente i dati cliente prima di continuare.': 'Complete customer details correctly before continuing.',
  'Completa correttamente i dati cliente prima del pagamento.': 'Complete customer details correctly before payment.',
  'Completa prima i dati della prenotazione.': 'Complete booking details first.',
  'Lo slot selezionato non e piu disponibile. Scegline un altro.': 'The selected slot is no longer available. Choose another one.',
  'Completa data, orario, tour e dati cliente prima di andare al pagamento.': 'Complete date, time, tour and customer details before payment.',
  'Errore durante il pagamento.': 'Payment error.',
  'Errore durante il pagamento PayPal.': 'PayPal payment error.',
  'Impossibile creare la prenotazione.': 'Unable to create booking.',
  'Pagamento non completato.': 'Payment not completed.',
  'Impossibile avviare il checkout PayPal.': 'Unable to start PayPal checkout.',
  'Intent PayPal non disponibile. Riprova.': 'PayPal intent unavailable. Please try again.',
  'Pagamento PayPal non completato.': 'PayPal payment not completed.',
  'Errore durante il checkout PayPal.': 'PayPal checkout error.',
  'PayPal non disponibile su questo dispositivo/browser.': 'PayPal is not available on this device/browser.',
  'Impossibile caricare il checkout PayPal.': 'Unable to load PayPal checkout.',
  'Impossibile caricare PayPal SDK.': 'Unable to load PayPal SDK.',
  'PayPal SDK caricato ma non inizializzato.': 'PayPal SDK loaded but not initialized.',
  'PayPal non configurato: manca il Client ID.': 'PayPal not configured: missing Client ID.',
  'PayPal non configurato sul server.': 'PayPal is not configured on the server.',
  'PayPal SDK non disponibile in questo ambiente.': 'PayPal SDK is not available in this environment.',
  'Configurazione pagamento non disponibile.': 'Payment configuration unavailable.',
  'Configurazione pagamenti non raggiungibile. Uso impostazioni locali.': 'Unable to reach payment configuration. Using local defaults.',
  'Vai alla home': 'Go to home',
  'Navigazione principale': 'Main navigation',
  'Apri menu': 'Open menu',
  'Chiudi menu': 'Close menu',
  'Impossibile raggiungere l\'API disponibilita. Avvia il backend con "npm run server" e verifica che PostgreSQL sia attivo.': 'Unable to reach the availability API. Start the backend with "npm run server" and make sure PostgreSQL is active.',
  'Foto di Roma': 'Photos of Rome',
  'Roma scorcio': 'Rome view',
  'Galleria Roma': 'Rome Gallery',
  'Illustrazione del Pantheon': 'Pantheon illustration',
  'Illustrazione del Colosseo': 'Colosseum illustration',
  'Illustrazione Tuk Tuk Roma': 'Tuk Tuk Rome illustration',
  'Rientro': 'Return',
  'Vaticano': 'The Vatican',
  'Centro Storico': 'Historic Center',
  'Fontana di Trevi': 'Trevi Fountain',
  'Piazza di Spagna': 'Spanish Steps',
  'Lun': 'Mon',
  'Mar': 'Tue',
  'Mer': 'Wed',
  'Gio': 'Thu',
  'Ven': 'Fri',
  'Sab': 'Sat',
  'Dom': 'Sun',
  'Galleria': 'Gallery',
  'Prenota Ora': 'Book Now',
  'Prenota ora il tuo tour in tuk tuk e scopri': 'Book your tuk tuk tour now and discover',
  'Scopri Roma in modo unico e indimenticabile con i nostri tour in tuk tuk.': 'Discover Rome in a unique and unforgettable way with our tuk tuk tours.',
  'Esperienza, professionalita e passione in ogni percorso.': 'Experience, professionalism and passion in every route.',
  'Vivi la citta eterna da una prospettiva speciale: itinerari esclusivi, guida locale e': 'Experience the eternal city from a special perspective: exclusive itineraries, local guide and',
  'fermate iconiche in totale comfort.': 'iconic stops in total comfort.',
  'Impossibile caricare disponibilita': 'Unable to load availability',
  'Disponibilita temporaneamente non raggiungibile. Riprovo tra pochi secondi.': 'Availability temporarily unavailable. Retrying in a few seconds.',
  'Indietro': 'Back',
  'Avanti': 'Next',
  'Percorso': 'Route',
  'Prenotazione': 'Booking',
  'Conferma': 'Confirm',
};

export type Lang = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof (typeof TRANSLATIONS)['en'];

const SUPPORTED_LANGS: Lang[] = ['en', 'it'];
const EN_TO_IT_TEXT_REPLACEMENTS: Record<string, string> = Object.entries(IT_TO_EN_TEXT_REPLACEMENTS).reduce(
  (accumulator, [itText, enText]) => {
    if (!accumulator[enText]) {
      accumulator[enText] = itText;
    }
    return accumulator;
  },
  {} as Record<string, string>
);

type LanguageContextValue = {
  lang: Lang;
  setLang: (nextLang: Lang) => void;
  t: (key: TranslationKey) => string;
  translateText: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function normalizeToSupportedLang(rawLang: string): Lang | null {
  const normalized = String(rawLang || '').trim().toLowerCase().slice(0, 2);
  return SUPPORTED_LANGS.includes(normalized as Lang) ? (normalized as Lang) : null;
}

function applyTextReplacementMap(input: string, replacementMap: Record<string, string>) {
  let output = input;
  const entries = Object.entries(replacementMap).sort((a, b) => b[0].length - a[0].length);

  entries.forEach(([sourceText, targetText]) => {
    if (!sourceText || !output.includes(sourceText)) {
      return;
    }
    output = output.split(sourceText).join(targetText);
  });

  return output;
}

function translateRawText(input: string, targetLang: Lang) {
  if (!input) {
    return input;
  }

  if (targetLang === 'en') {
    return applyTextReplacementMap(input, IT_TO_EN_TEXT_REPLACEMENTS);
  }

  return applyTextReplacementMap(input, EN_TO_IT_TEXT_REPLACEMENTS);
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [lang, setLangState] = useState<Lang>('en');
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedLang = normalizeToSupportedLang(stored);
      if (storedLang) {
        setLangState(storedLang);
        return;
      }
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const detected = normalizeToSupportedLang(window.navigator.language || '');
    if (!detected) {
      window.localStorage.setItem(STORAGE_KEY, 'en');
      setLangState('en');
      return;
    }

    setLangState(detected);
    window.localStorage.setItem(STORAGE_KEY, detected);

    const readable = detected === 'it' ? 'Italian' : 'English';
    setToastMessage(`Language set to ${readable} \u{1F310}`);
    setToastOpen(true);
  }, []);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLang);
    }
  }, []);

  const t = useCallback((key: TranslationKey) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
  }, [lang]);

  const translateText = useCallback((text: string) => {
    return translateRawText(text, lang);
  }, [lang]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const translateTextNode = (node: Text) => {
      const sourceValue = node.nodeValue || '';
      if (!sourceValue.trim()) {
        return;
      }

      const parentElement = node.parentElement;
      if (!parentElement || parentElement.closest(NON_TRANSLATABLE_SELECTOR)) {
        return;
      }

      const translatedValue = translateRawText(sourceValue, lang);
      if (translatedValue !== sourceValue) {
        node.nodeValue = translatedValue;
      }
    };

    const translateElementAttributes = (element: Element) => {
      if (element.closest(NON_TRANSLATABLE_SELECTOR)) {
        return;
      }

      TRANSLATABLE_ATTRIBUTES.forEach((attributeName) => {
        const currentValue = element.getAttribute(attributeName);
        if (!currentValue) {
          return;
        }

        const translatedValue = translateRawText(currentValue, lang);
        if (translatedValue !== currentValue) {
          element.setAttribute(attributeName, translatedValue);
        }
      });
    };

    const translateSubtree = (rootNode: Node) => {
      if (rootNode.nodeType === Node.TEXT_NODE) {
        translateTextNode(rootNode as Text);
        return;
      }

      if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const rootElement = rootNode as Element;
      translateElementAttributes(rootElement);

      const textWalker = document.createTreeWalker(rootElement, window.NodeFilter.SHOW_TEXT);
      let textNode = textWalker.nextNode() as Text | null;
      while (textNode) {
        translateTextNode(textNode);
        textNode = textWalker.nextNode() as Text | null;
      }

      rootElement.querySelectorAll('*').forEach((element) => {
        translateElementAttributes(element);
      });
    };

    translateSubtree(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateTextNode(mutation.target as Text);
          return;
        }

        if (mutation.type === 'attributes') {
          translateElementAttributes(mutation.target as Element);
          return;
        }

        mutation.addedNodes.forEach((addedNode) => {
          translateSubtree(addedNode);
        });
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      translateText,
    }),
    [lang, setLang, t, translateText]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <Toast
        open={toastOpen}
        message={toastMessage}
        durationMs={2200}
        onClose={() => setToastOpen(false)}
      />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve essere usato dentro LanguageProvider.');
  }
  return context;
}
