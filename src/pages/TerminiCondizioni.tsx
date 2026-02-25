import { Link } from 'react-router-dom';
import '../App.css';
import './LegalPages.css';
import NavbarMarbleLuxury from '../components/NavbarMarbleLuxury';
import BackgroundArtLayer from '../components/BackgroundArtLayer';
import HeroFooterScene from '../components/HeroFooterScene';
import Cursor from '../components/ui/Cursor';

export default function TerminiCondizioni() {
  return (
    <div className="page legal-page">
      <BackgroundArtLayer />
      <Cursor />
      <NavbarMarbleLuxury />

      <main className="legal-main" data-no-translate="true">
        <section className="legal-hero">
          <div className="legal-container">
            <h1 className="legal-title">Termini e Condizioni di RomeInOut</h1>
            <p className="legal-subtitle">
              Condizioni generali applicabili alle prenotazioni dei tour RomeInOut tramite sito web.
            </p>
            <p className="legal-meta">Ultimo aggiornamento: 24/02/2026</p>
          </div>
        </section>

        <section className="legal-content">
          <div className="legal-container legal-container-narrow">
            <ol className="legal-sections">
              <li className="legal-section">
                <h2>1. Oggetto del Servizio</h2>
                <p>RomeInOut offre tour turistici in Tuk Tuk nella citta di Roma.</p>
              </li>

              <li className="legal-section">
                <h2>2. Prenotazione</h2>
                <p>La prenotazione avviene tramite il sito web.</p>
                <p>L&apos;utente fornisce nome, cognome, email, telefono, giorno e orario del tour.</p>
                <p>La prenotazione si considera confermata solo al completamento del pagamento.</p>
              </li>

              <li className="legal-section">
                <h2>3. Pagamenti</h2>
                <p>I pagamenti sono effettuati tramite PayPal.</p>
                <p>RomeInOut non conserva dati di pagamento.</p>
              </li>

              <li className="legal-section">
                <h2>4. Politica di Cancellazione</h2>
                <p>Le cancellazioni devono essere comunicate via email.</p>
                <p>[INSERIRE POLITICA: es. rimborso totale fino a 48h prima]</p>
              </li>

              <li className="legal-section">
                <h2>5. Responsabilita del Cliente</h2>
                <p>Il cliente deve presentarsi puntualmente nel luogo concordato.</p>
                <p>Eventuali ritardi potrebbero comportare riduzione della durata del tour.</p>
              </li>

              <li className="legal-section">
                <h2>6. Limitazione di Responsabilita</h2>
                <p>RomeInOut non e responsabile per:</p>
                <ul>
                  <li>Eventi di forza maggiore</li>
                  <li>Chiusure straordinarie di monumenti</li>
                  <li>Condizioni meteo avverse</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>7. Condizioni Meteo</h2>
                <p>In caso di condizioni meteo avverse il tour puo essere riprogrammato.</p>
              </li>

              <li className="legal-section">
                <h2>8. Modifiche al Servizio</h2>
                <p>RomeInOut si riserva il diritto di modificare percorsi o orari per esigenze organizzative.</p>
              </li>

              <li className="legal-section">
                <h2>9. Proprieta Intellettuale</h2>
                <p>Contenuti, immagini e marchi presenti sul sito sono di proprieta di RomeInOut.</p>
              </li>

              <li className="legal-section">
                <h2>10. Legge Applicabile</h2>
                <p>Il presente contratto e regolato dalla legge italiana.</p>
              </li>

              <li className="legal-section">
                <h2>11. Foro Competente</h2>
                <p>Per qualsiasi controversia e competente il Foro di Roma.</p>
              </li>
            </ol>

            <div className="legal-bottom">
              <p className="legal-contact">
                Per assistenza contrattuale:{' '}
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
