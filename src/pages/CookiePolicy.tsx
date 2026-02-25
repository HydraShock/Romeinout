import { Link } from 'react-router-dom';
import '../App.css';
import './LegalPages.css';
import NavbarMarbleLuxury from '../components/NavbarMarbleLuxury';
import BackgroundArtLayer from '../components/BackgroundArtLayer';
import HeroFooterScene from '../components/HeroFooterScene';
import Cursor from '../components/ui/Cursor';

export default function CookiePolicy() {
  const updatedAt = new Date().toLocaleDateString('it-IT');

  return (
    <div className="page legal-page">
      <BackgroundArtLayer />
      <Cursor />
      <NavbarMarbleLuxury />

      <main className="legal-main" data-no-translate="true">
        <section className="legal-hero">
          <div className="legal-container">
            <h1 className="legal-title">Cookie Policy di RomeInOut</h1>
            <p className="legal-subtitle">
              Questa informativa descrive i cookie utilizzati sul sito RomeInOut, le finalita del loro utilizzo
              e le opzioni disponibili per la gestione del consenso.
            </p>
            <p className="legal-meta">Ultimo aggiornamento: {updatedAt}</p>
          </div>
        </section>

        <section className="legal-content">
          <div className="legal-container legal-container-narrow">
            <ol className="legal-sections">
              <li className="legal-section">
                <h2>1. Cosa sono i Cookie</h2>
                <p>I cookie sono piccoli file di testo memorizzati sul dispositivo dell&apos;utente durante la navigazione.</p>
              </li>

              <li className="legal-section">
                <h2>2. Tipologie di Cookie Utilizzati</h2>
                <p>a) Cookie Tecnici</p>
                <p>Necessari al funzionamento del sito (es. gestione sessione, prenotazioni).</p>
                <p>b) Cookie Analitici</p>
                <p>Utilizzati per analizzare il traffico e migliorare il sito.</p>
                <p>c) Cookie di Terze Parti</p>
                <p>Potrebbero essere utilizzati cookie di PayPal o altri servizi integrati.</p>
              </li>

              <li className="legal-section">
                <h2>3. Base Giuridica</h2>
                <ul>
                  <li>Cookie tecnici - legittimo interesse</li>
                  <li>Cookie analitici/marketing - consenso</li>
                </ul>
              </li>

              <li className="legal-section">
                <h2>4. Gestione del Consenso</h2>
                <p>Al primo accesso viene mostrato un banner per:</p>
                <ul>
                  <li>Accettare tutti i cookie</li>
                  <li>Rifiutare</li>
                  <li>Personalizzare le preferenze</li>
                </ul>
                <p>Il consenso puo essere revocato in qualsiasi momento.</p>
              </li>

              <li className="legal-section">
                <h2>5. Disabilitazione tramite Browser</h2>
                <p>E possibile disabilitare i cookie tramite le impostazioni del proprio browser.</p>
              </li>

              <li className="legal-section">
                <h2>6. Tabella Esempio Cookie</h2>
                <div className="legal-table-wrap">
                  <table className="legal-table" aria-label="Tabella esempio cookie">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tipologia</th>
                        <th>Durata</th>
                        <th>Finalita</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>session_id</td>
                        <td>Tecnico</td>
                        <td>Sessione</td>
                        <td>Gestione prenotazioni</td>
                      </tr>
                      <tr>
                        <td>_paypal</td>
                        <td>Terza parte</td>
                        <td>Variabile</td>
                        <td>Pagamento</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            </ol>

            <div className="legal-bottom">
              <p className="legal-contact">
                Per chiarimenti sui cookie:{' '}
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
