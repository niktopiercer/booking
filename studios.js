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
  // STUDIO: KATRAME Tattoo Studio — Schio (VI)
  // ---------------------------------------------------------------------------
  {
    id:       "katrame",
    active:   true,
    name:     "KATRAME Tattoo Studio",
    location: "Schio",
    address:  "Via B. Brandellero, 22 — Schio (VI)",
    mapsLink: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4778b3ab4d72869f:0xc989f142444135aa",
    logo:     "./assets/studios/katrame.jpg",
    initial:  "K",
    services: {
      "nuovo-piercing":       { calLink: "nikto/nuovo-piercing-katrame" },
      "cambio-gioiello":      { calLink: "nikto/cambio-gioiello-katrame" },
      "controllo-consulenza": { calLink: "nikto/controllo-consulenza-katrame" }
    }
  },

  // ---------------------------------------------------------------------------
  // STUDIO: ARCANUM — Bottega d'Arte — Verona (VR)
  // ---------------------------------------------------------------------------
  {
    id:       "arcanum",
    active:   true,
    name:     "ARCANUM — Bottega d'Arte",
    location: "Verona",
    address:  "Via della Valverde, 57 — Verona (VR)",
    mapsLink: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x477f5ff9c10ba373:0xe9b79958a0abdc95",
    logo:     "./assets/studios/arcanum.jpg",
    initial:  "A",
    services: {
      "nuovo-piercing":       { calLink: "nikto/nuovo-piercing-arcanum" },
      "cambio-gioiello":      { calLink: "nikto/cambio-gioiello-arcanum" },
      "controllo-consulenza": { calLink: "nikto/controllo-consulenza-arcanum" }
    }
  }

  // ---------------------------------------------------------------------------
  // AGGIUNGERE QUI nuovi studi seguendo lo stesso schema.
  // Esempio studio disattivato temporaneamente:
  //
  // {
  //   id:       "nuovo-studio",
  //   active:   false,           ← non comparirà nel sito
  //   name:     "Nome Studio",
  //   location: "Città",
  //   address:  "Via ...",
  //   mapsLink: "https://maps.google.com/...",
  //   logo:     "./assets/studios/nuovo-studio.jpg",
  //   initial:  "N",
  //   services: {
  //     "nuovo-piercing":       { calLink: "nikto/nuovo-piercing-nuovo-studio" },
  //     "cambio-gioiello":      { calLink: "nikto/cambio-gioiello-nuovo-studio" },
  //     "controllo-consulenza": { calLink: "nikto/controllo-consulenza-nuovo-studio" }
  //   }
  // }
  // ---------------------------------------------------------------------------

];
