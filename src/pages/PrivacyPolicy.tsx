import { Link } from 'react-router-dom';
import '../App.css';
import './LegalPages.css';
import NavbarMarbleLuxury from '../components/NavbarMarbleLuxury';
import BackgroundArtLayer from '../components/BackgroundArtLayer';
import HeroFooterScene from '../components/HeroFooterScene';
import Cursor from '../components/ui/Cursor';

export default function PrivacyPolicy() {
  return (
    <div className="page legal-page">
      <BackgroundArtLayer />
      <Cursor />
      <NavbarMarbleLuxury />

      <main className="legal-main" data-no-translate="true">
        <section className="legal-hero">
          <div className="legal-container">
            <h1 className="legal-title">Privacy Policy di RomeInOut</h1>
            <p className="legal-subtitle">
              La presente informativa e resa ai sensi del Regolamento (UE) 2016/679 (&quot;GDPR&quot;) e descrive le modalita
              di trattamento dei dati personali degli utenti che utilizzano il sito web di RomeInOut.
            </p>
            <p className="legal-meta">Ultimo aggiornamento: 24/02/2026</p>
          </div>
        </section>

        <section className="legal-content">
          <div className="legal-container legal-container-narrow">
            <ol className="legal-sections">
              <li className="legal-section">
                <h2>1. Titolare del Trattamento</h2>
                <p>Il Titolare del trattamento e:</p>
                <p>
                  Davide Nuccetelli
                  <br />
                  Via Cavour 134
                  <br />
                  Roma, Italia
                  <br />
                  Email:{' '}
                  <a className="legal-link" href="mailto:info@romeinout.it">
                    info@romeinout.it
                  </a>
                  <br />
                  P.IVA: [INSERIRE P.IVA]
                </p>
              </li>

              <li className="legal-section">
                <h2>2. Tipologie di Dati Raccolti</h2>
                <p>Attraverso il sito vengono raccolti i seguenti dati personali:</p>
                <p>a) Dati identificativi e di contatto</p>
                <ul>
                  <li>Nome</li>
                  <li>Cognome</li>
                  <li>Email</li>
                  <li>Numero di telefono</li>
                </ul>
                <p>b) Dati di prenotazione</p>
                <ul>
                  <li>Giorno del tour</li>
                  <li>Orario del tour</li>
                </ul>
                <p>c) Dati di pagamento</p>
                <p>I pagamenti possono essere gestiti tramite PayPal o bonifico bancario. RomeInOut non conserva direttamente i dati delle carte di pagamento dell&apos;utente.</p>
                <p>d) Dati tecnici</p>
                <ul>
                  <li>Indirizzo IP</li>
                  <li>Dati di navigazione</li>
                  <li>Log di sistema</li>
                  <li>Informazioni sul browser e dispositivo</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>3. Finalita del Trattamento</h2>
                <p>I dati sono trattati per le seguenti finalita:</p>
                <ul>
                  <li>Gestione delle prenotazioni dei tour</li>
                  <li>Comunicazioni relative al servizio prenotato</li>
                  <li>Adempimenti fiscali e amministrativi</li>
                  <li>Sicurezza del sito e prevenzione abusi</li>
                  <li>Eventuale invio di comunicazioni promozionali (solo previo consenso)</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>4. Base Giuridica del Trattamento</h2>
                <p>Il trattamento e fondato su:</p>
                <ul>
                  <li>Esecuzione di un contratto (art. 6.1.b GDPR)</li>
                  <li>Adempimento obblighi legali (art. 6.1.c GDPR)</li>
                  <li>Legittimo interesse del titolare (art. 6.1.f GDPR)</li>
                  <li>Consenso dell&apos;interessato per attivita marketing (art. 6.1.a GDPR)</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>5. Modalita del Trattamento</h2>
                <p>
                  Il trattamento avviene mediante strumenti informatici e telematici, adottando misure tecniche e organizzative adeguate a
                  garantire la sicurezza dei dati.
                </p>
              </li>

              <li className="legal-section">
                <h2>6. Conservazione dei Dati</h2>
                <p>I dati personali sono conservati per il tempo necessario a:</p>
                <ul>
                  <li>Gestire la prenotazione</li>
                  <li>Adempiere agli obblighi fiscali e contabili</li>
                  <li>Tutelare eventuali diritti in sede giudiziaria</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>7. Comunicazione a Terzi</h2>
                <p>I dati possono essere comunicati a:</p>
                <ul>
                  <li>PayPal e/o istituti bancari (gestione pagamenti)</li>
                  <li>Provider hosting</li>
                  <li>Consulenti fiscali / commercialista</li>
                  <li>Autorita competenti ove richiesto</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>8. Trasferimento Dati Extra UE</h2>
                <p>
                  Alcuni servizi terzi (es. PayPal) potrebbero comportare trasferimento di dati verso Paesi extra UE.
                  Tali trasferimenti avvengono nel rispetto delle garanzie previste dal GDPR.
                </p>
              </li>

              <li className="legal-section">
                <h2>9. Diritti dell&apos;Interessato</h2>
                <p>Ai sensi degli artt. 15-22 GDPR, l&apos;utente ha diritto di:</p>
                <ul>
                  <li>Accedere ai propri dati</li>
                  <li>Rettificarli</li>
                  <li>Cancellarli</li>
                  <li>Limitarne il trattamento</li>
                  <li>Opporsi al trattamento</li>
                  <li>Richiedere portabilita dei dati</li>
                </ul>
                <p>
                  Le richieste possono essere inviate a:{' '}
                  <a className="legal-link" href="mailto:info@romeinout.it">
                    info@romeinout.it
                  </a>
                </p>
              </li>

              <li className="legal-section">
                <h2>10. Reclamo</h2>
                <p>E possibile proporre reclamo al Garante per la Protezione dei Dati Personali.</p>
              </li>
            </ol>

            <div className="legal-bottom">
              <p className="legal-contact">
                Per richieste privacy:{' '}
                <a href="mailto:info@romeinout.it">
                  info@romeinout.it
                </a>
              </p>
              <Link className="legal-back-link" to="/">
                Torna alla Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HeroFooterScene />
    </div>
  );
}
