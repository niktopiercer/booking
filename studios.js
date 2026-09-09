/**
 * studios.js — NIKTO Body Piercer | Dati Studi
 * =============================================
 * QUESTO È L'UNICO FILE CHE IL TOOL ESTERNO DEVE MODIFICARE.
 *
 * Per aggiungere uno studio: aggiungi un oggetto all'array STUDIOS_DATA.
 * Per disattivare uno studio: imposta active: false (non comparirà nel sito).
 * Per eliminare uno studio: rimuovi l'oggetto dall'array.
 * Per modificare un calLink: aggiorna solo il campo calLink del servizio interessato.
 *
 * I dati comuni dei servizi (titolo, descrizione, durata) sono in SERVICES_CONFIG
 * in app.js e NON devono essere modificati qui — sono fissi per tutti gli studi.
 */

// =============================================================================
// STUDIOS_DATA — Array degli studi attivi e disattivati
// =============================================================================
// Ogni studio è un oggetto con questi campi:
//
//   id        {string}  — Identificatore univoco (usato come chiave interna e DOM)
//   active    {boolean} — true = mostrato nel sito | false = nascosto
//   name      {string}  — Nome completo dello studio
//   location  {string}  — Città (es. "Schio", "Verona")
//   address   {string}  — Indirizzo testuale completo
//   mapsLink  {string}  — URL Google Maps
//   logo      {string}  — Path relativo dell'immagine logo (da ./assets/studios/)
//   initial   {string}  — Lettera iniziale per il placeholder grafico se il logo manca
//
//   services  {object}  — Oggetto con i 3 servizi standard. Per ogni servizio:
//     calLink {string}  — Il solo campo variabile: il link Cal.eu per questo studio+servizio
//                         Formato tipico: "username/nome-evento"
//                         Es: "nikto/nuovo-piercing-katrame"
// =============================================================================
const STUDIOS_DATA = [
  // ---------------------------------------------------------------------------
  // STUDIO: KATRAME Tattoo Studio — Schio
  // ---------------------------------------------------------------------------
  {
    id: "katrame",
    active: true,
    name: "KATRAME Tattoo Studio",
    location: "Schio",
    address: "Via B. Brandellero, 22 — Schio (VI)",
    mapsLink: "https://maps.app.goo.gl/ysLJ8ofrnhig9Zx47",
    logo: "./assets/studios/katrame.jpg",
    initial: "K",
    services: {
      "nuovo-piercing": { calLink: "nikto/nuovo-piercing-katrame" },
      "cambio-gioiello": { calLink: "nikto/cambio-gioiello-katrame" },
      "controllo-consulenza": { calLink: "nikto/controllo-consulenza-katrame" }
    }
  },
  // ---------------------------------------------------------------------------
  // STUDIO: ARCANUM — Bottega d'Arte — Verona
  // ---------------------------------------------------------------------------
  {
    id: "arcanum",
    active: true,
    name: "ARCANUM — Bottega d'Arte",
    location: "Verona",
    address: "Via della Valverde, 57 — Verona (VR)",
    mapsLink: "https://maps.app.goo.gl/piqkG35yF49akjNy6",
    logo: "./assets/studios/arcanum.jpg",
    initial: "A",
    services: {
      "nuovo-piercing": { calLink: "nikto/nuovo-piercing-arcanum" },
      "cambio-gioiello": { calLink: "nikto/cambio-gioiello-arcanum" },
      "controllo-consulenza": { calLink: "nikto/controllo-consulenza-arcanum" }
    }
  },
  // ---------------------------------------------------------------------------
  // STUDIO: PIGMENTO  Tattoo Lab — Castelgomberto
  // ---------------------------------------------------------------------------
  {
    id: "pigmento",
    active: true,
    name: "PIGMENTO  Tattoo Lab",
    location: "Castelgomberto",
    address: "Via Verdi, 40F — Castelgomberto (VI)",
    mapsLink: "https://maps.app.goo.gl/jUfcUZKQgTKRL2yn9",
    logo: "./assets/studios/pigmento",
    initial: "P",
    services: {
      "nuovo-piercing": { calLink: "nikto/nuovo-piercing-pigmento-tattoo-castelgomberto" },
      "cambio-gioiello": { calLink: "nikto/cambio-rimozione-o-acquisto-gioiello-pigmento-tattoo-castelgomberto" },
      "controllo-consulenza": { calLink: "nikto/controllo-piercing-e-consulenza-pigmento-tattoo-castelgomberto" }
    }
  },
  // ---------------------------------------------------------------------------
  // STUDIO: DEVI  Tattoo — Levico Terme
  // ---------------------------------------------------------------------------
  {
    id: "devi",
    active: true,
    name: "DEVI  Tattoo",
    location: "Levico Terme",
    address: "Via Guglielmo Marconi, 8 — Levico Terme (TN)",
    mapsLink: "https://maps.app.goo.gl/a4TseForyH48pFn76",
    logo: "./assets/studios/devi",
    initial: "D",
    services: {
      "nuovo-piercing": { calLink: "nikto/nuovo-piercing-devi-tattoo-levico" },
      "cambio-gioiello": { calLink: "nikto/cambio-rimozione-o-acquisto-gioiello-devi-tattoo-levico" },
      "controllo-consulenza": { calLink: "nikto/controllo-piercing-e-consulenza-devi-tattoo-levico" }
    }
  }
];
