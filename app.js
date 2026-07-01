/**
 * app.js — NIKTO Body Piercer | Application Logic
 * =================================================
 * Gestisce la navigazione tra le viste, la generazione dinamica dei componenti
 * a partire dai dati in studios.js, il montaggio dell'embed Cal e i fallback grafici.
 *
 * STRUTTURA:
 *   1. SERVICES_CONFIG     — Dati fissi dei 3 servizi standard (uguale per tutti gli studi)
 *   2. CAL EMBED ENGINE    — Funzione centralizzata per montare/smontare l'embed Cal
 *   3. IMAGE FALLBACK      — Gestione immagini non caricate con placeholder grafici
 *   4. VIEW NAVIGATION     — switchView() con transizioni CSS fluide
 *   5. STUDIO CARD RENDERER  — Generazione dinamica card studi da STUDIOS_DATA
 *   6. SERVICE CARD RENDERER — Generazione dinamica card servizi da SERVICES_CONFIG
 *   7. STUDIO DETAIL SETUP   — Popola la view-detail con i dati dello studio selezionato
 *   8. SERVICE BOOKING SETUP — Popola la view-service e monta l'embed Cal
 *   9. EVENT LISTENERS     — Inizializzazione al DOMContentLoaded
 *
 * FILE DA NON MODIFICARE PER AGGIUNGERE/RIMUOVERE STUDI → vedere studios.js
 */

'use strict';


// =============================================================================
// 1. SERVICES_CONFIG — Dati fissi dei 3 servizi standard
// =============================================================================
// Questi dati sono identici per tutti gli studi.
// La parte variabile (calLink) è in studios.js, nel campo services di ogni studio.

const SERVICES_CONFIG = {
  "nuovo-piercing": {
    title:    "Nuovo piercing",
    desc:     "Prenota questo appuntamento per eseguire un nuovo piercing. Nelle note indica il piercing che vorresti fare. Se sei minorenne, devi presentarti accompagnato da un genitore o tutore legale; sia il minore sia l'accompagnatore devono portare un documento d'identità e il codice fiscale.",
    duration: "45 minuti"
  },
  "cambio-gioiello": {
    title:    "Cambio, rimozione o acquisto gioiello",
    desc:     "Prenota questo appuntamento per cambio gioiello, rimozione, re-inserimento o consulenza per l'acquisto di un nuovo gioiello per piercing.",
    duration: "30 minuti"
  },
  "controllo-consulenza": {
    title:    "Controllo piercing e consulenza",
    desc:     "Prenota questo appuntamento per un controllo del piercing, un check di guarigione oppure una consulenza in caso di dubbi, fastidi o problematiche legate al piercing.",
    duration: "15 minuti"
  }
};

// Ordine di presentazione dei servizi nell'interfaccia
const SERVICES_ORDER = ["nuovo-piercing", "cambio-gioiello", "controllo-consulenza"];

// Chiave dello studio attualmente selezionato (stato globale minimo)
let activeStudioId = "";


// =============================================================================
// 2. CAL EMBED ENGINE
// =============================================================================
// Funzione centralizzata per montare l'embed Cal.eu inline.
// Tutta la configurazione comune (tema, colori brand, layout) è qui e non si ripete.
// L'unico dato variabile è calLink (proveniente da studios.js).

/**
 * Carica lo script Cal.eu una sola volta e lo inietta nel <head>.
 * Le chiamate successive usano l'istanza già caricata.
 */
function ensureCalScriptLoaded() {
  if (window.Cal && window.Cal.loaded) return;

  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar  = arguments;
      if (!cal.loaded) {
        cal.ns  = {};
        cal.q   = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api       = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.eu/embed/embed.js", "init");
}

/**
 * Monta l'embed Cal inline dentro il contenitore .cal-embed-wrapper.
 * Pulisce sempre l'embed precedente prima di montare il nuovo.
 *
 * @param {string} calLink  — Il link Cal.eu dell'evento (es. "nikto/nuovo-piercing-katrame").
 *                            Viene da studios.js → studio.services[serviceId].calLink
 * @param {string} namespace — Identificatore univoco per questo montaggio (es. "nuovo-piercing-katrame").
 */
function mountCalEmbed(calLink, namespace) {
  const embedWrapper = document.querySelector(".cal-embed-wrapper");
  if (!embedWrapper) return;

  // Pulisce completamente l'embed precedente (iframe + stato namespace)
  embedWrapper.innerHTML = "";
  if (window.Cal && window.Cal.ns && window.Cal.ns[namespace]) {
    delete window.Cal.ns[namespace];
  }

  // Crea il div target con ID univoco che Cal userà come contenitore
  const targetId  = `cal-inline-${namespace}`;
  const calTarget = document.createElement("div");
  calTarget.id        = targetId;
  calTarget.className = "cal-embed-target";
  calTarget.style.cssText = "width:100%; height:100%; overflow:scroll;";
  embedWrapper.appendChild(calTarget);

  // Assicura che lo script Cal.eu sia caricato
  ensureCalScriptLoaded();

  // Abilita il forwarding dei query params (es. per UTM)
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;

  // Inizializza il namespace univoco per questo embed
  Cal("init", namespace, { origin: "https://app.cal.eu" });

  // Monta il widget inline — layout mensile, tema dark
  Cal.ns[namespace]("inline", {
    elementOrSelector: `#${targetId}`,
    config: {
      layout:                 "month_view",
      useSlotsViewOnSmallScreen: "true",
      theme:                  "dark"
    },
    calLink: calLink
  });

  // Configurazione UI: tema dark fisso + colori brand NIKTO (viola + oro)
  // Questi valori NON devono essere spostati in studios.js — sono fissi per tutti gli studi.
  Cal.ns[namespace]("ui", {
    theme:               "dark",
    hideEventTypeDetails: true,
    layout:              "month_view",
    cssVarsPerTheme: {
      light: {
        "cal-brand":           "#6C178F",
        "cal-text":            "#C9A96E",
        "cal-text-emphasis":   "#C9A96E",
        "cal-text-subtle":     "#C9A96E",
        "cal-text-inverted":   "#0A0A0A"
      },
      dark: {
        "cal-brand":           "#6C178F",
        "cal-text":            "#C9A96E",
        "cal-text-emphasis":   "#C9A96E",
        "cal-text-subtle":     "#C9A96E",
        "cal-text-inverted":   "#0A0A0A"
      }
    }
  });
}


// =============================================================================
// 3. IMAGE FALLBACK ENGINE
// =============================================================================
// Sostituisce le immagini non caricate (404 o assenti) con placeholder grafici coerenti.

/**
 * @param {HTMLImageElement} img — L'elemento immagine che ha fallito il caricamento.
 */
function handleImageError(img) {
  const fallbackType = img.getAttribute("data-fallback");
  const parent       = img.parentElement;
  if (!parent) return;

  if (fallbackType === "personal-logo") {
    parent.innerHTML = `
      <div class="placeholder-personal-logo" title="NIKTO Body Piercer">
        <span>N</span>
      </div>
    `;
  }
  else if (fallbackType === "logo-studio") {
    const initial = img.getAttribute("data-initial") || "S";
    parent.innerHTML = `
      <div class="placeholder-logo" title="Logo studio non disponibile">
        <span>${initial}</span>
      </div>
    `;
  }
  else if (fallbackType === "nikto-photo") {
    parent.innerHTML = `
      <div class="placeholder-portrait" title="Aesthetic Piercing Art">
        <svg class="artistic-portrait" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Aesthetic line art drawing">
          <circle cx="50" cy="45" r="25" stroke="#c9a96e" stroke-width="1.2" stroke-dasharray="3 3" />
          <circle cx="50" cy="45" r="2.5" fill="#6C178F" />
          <line x1="50" y1="12" x2="50" y2="108" stroke="#c9a96e" stroke-width="1.2" />
          <circle cx="50" cy="22" r="4" fill="#c9a96e" stroke="#0a0a0a" stroke-width="1" />
          <circle cx="50" cy="98" r="4" fill="#c9a96e" stroke="#0a0a0a" stroke-width="1" />
          <path d="M28,38 Q38,32 50,47 T72,57" stroke="rgba(240, 236, 228, 0.22)" stroke-width="1" />
          <path d="M50,47 Q58,64 50,77 T33,92" stroke="rgba(240, 236, 228, 0.18)" stroke-width="1" />
          <circle cx="50" cy="45" r="33" stroke="rgba(108, 23, 143, 0.22)" stroke-width="1" />
          <circle cx="50" cy="45" r="44" stroke="rgba(201, 169, 110, 0.12)" stroke-width="0.7" />
        </svg>
        <span>NIKTO PIERCER</span>
      </div>
    `;
  }
}

/**
 * Crea un elemento <img> con gestione automatica del fallback.
 * @param {object} opts - { src, alt, className, fallbackType, initial }
 * @returns {HTMLImageElement}
 */
function createImageWithFallback({ src, alt, className, fallbackType, initial }) {
  const img = document.createElement("img");
  img.className = className || "studio-logo-img";
  img.alt = alt || "";
  img.setAttribute("data-fallback", fallbackType);
  if (initial) img.setAttribute("data-initial", initial);
  img.src = src;

  img.addEventListener("error", () => handleImageError(img));

  // Fallback immediato per immagini già in cache del browser (naturalWidth === 0)
  setTimeout(() => {
    if (img.complete && img.naturalWidth === 0) handleImageError(img);
  }, 50);

  return img;
}


// =============================================================================
// 4. VIEW NAVIGATION ENGINE
// =============================================================================
// Gestisce la transizione fluida tra le 4 viste dell'applicazione.

let currentViewId  = "view-home";
let isTransitioning = false;

/**
 * Cambia vista con transizione CSS fluida (fade + slide).
 * Previene sovrapposizioni bloccando nuovi switch durante la transizione.
 *
 * @param {string}   targetViewId       — ID della sezione da attivare.
 * @param {function} beforeShowCallback — Funzione chiamata prima del fade-in (per caricare dati).
 */
function switchView(targetViewId, beforeShowCallback = null) {
  if (isTransitioning || targetViewId === currentViewId) return;

  const currentView = document.getElementById(currentViewId);
  const targetView  = document.getElementById(targetViewId);
  if (!currentView || !targetView) return;

  isTransitioning = true;

  // Fade-out della vista corrente
  currentView.classList.remove("active");

  setTimeout(() => {
    // Nasconde la vista uscente dal layout
    currentView.classList.remove("visible");

    // Carica i dati nella vista entrante mentre è ancora invisibile
    if (typeof beforeShowCallback === "function") {
      beforeShowCallback();
    }

    // Prepara la vista entrante (display: block, ancora trasparente)
    targetView.classList.add("visible");

    // Forza reflow per registrare la rimozione di display:none prima del fade-in
    targetView.offsetHeight; // eslint-disable-line no-unused-expressions

    // Fade-in della nuova vista
    targetView.classList.add("active");
    currentViewId = targetViewId;

    window.scrollTo({ top: 0, behavior: "smooth" });
    isTransitioning = false;
  }, 500); // Deve corrispondere alla durata della transizione CSS in style.css
}


// =============================================================================
// 5. STUDIO CARD RENDERER
// =============================================================================
// Genera dinamicamente le card degli studi a partire da STUDIOS_DATA (studios.js).
// Filtra automaticamente gli studi con active: false — nessun residuo nel DOM.

// Freccia per le studio card (stilizzata via .studio-card-cta svg)
const ARROW_SVG = `<svg viewBox="0 0 24 24"><path d="M5 13h11.86l-5.43 5.43L13 20l8-8-8-8-1.41 1.41 5.43 5.43H5v2z"/></svg>`;

// Freccia per i service button: class="arrow-indicator" è indispensabile
// per applicare fill:viola, width:18px e la transizione hover:oro definiti in style.css
const ARROW_SVG_SERVICE = `<svg class="arrow-indicator" viewBox="0 0 24 24"><path d="M5 13h11.86l-5.43 5.43L13 20l8-8-8-8-1.41 1.41 5.43 5.43H5v2z"/></svg>`;

/**
 * Legge STUDIOS_DATA, filtra i disattivati e renderizza le card nella griglia.
 * Collega anche i listener click/keyboard per la navigazione al dettaglio studio.
 */
function renderStudioCards() {
  const grid = document.getElementById("studios-grid");
  if (!grid) return;

  // Filtra solo gli studi attivi
  const activeStudios = STUDIOS_DATA.filter(studio => studio.active === true);

  if (activeStudios.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1;">
      Nessuno studio disponibile al momento.
    </p>`;
    return;
  }

  // Svuota e popola la griglia
  grid.innerHTML = "";

  activeStudios.forEach(studio => {
    const article = document.createElement("article");
    article.className  = "studio-card";
    article.dataset.studioId = studio.id;
    article.tabIndex   = 0;
    article.setAttribute("aria-label",
      `${studio.name} a ${studio.location}. Clicca per i dettagli e prenotazione.`
    );

    article.innerHTML = `
      <div class="studio-card-info">
        <div class="studio-logo-box"></div>
        <div class="studio-name-location">
          <h3>${studio.name}</h3>
          <span class="location">(${studio.location})</span>
        </div>
      </div>
      <div class="studio-card-cta">
        <span>Seleziona Studio</span>
        ${ARROW_SVG}
      </div>
    `;

    // Inserisce il logo con fallback nel logo-box
    const logoBox = article.querySelector(".studio-logo-box");
    logoBox.appendChild(createImageWithFallback({
      src:          studio.logo,
      alt:          `${studio.name} Logo`,
      className:    "studio-logo-img",
      fallbackType: "logo-studio",
      initial:      studio.initial
    }));

    // Navigazione click
    article.addEventListener("click", () => {
      switchView("view-detail", () => setupStudioDetail(studio.id));
    });

    // Navigazione tastiera (accessibilità)
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchView("view-detail", () => setupStudioDetail(studio.id));
      }
    });

    grid.appendChild(article);
  });
}


// =============================================================================
// 6. SERVICE CARD RENDERER
// =============================================================================
// Genera le card dei 3 servizi nella view-detail dello studio selezionato.

/**
 * Popola il contenitore #services-container con i 3 servizi standard.
 * I listener per l'apertura del booking vengono collegati qui.
 */
function renderServiceCards() {
  const container = document.getElementById("services-container");
  if (!container) return;

  container.innerHTML = "";

  SERVICES_ORDER.forEach(serviceId => {
    const service = SERVICES_CONFIG[serviceId];
    if (!service) return;

    const link = document.createElement("a");
    link.href        = "#";
    link.className   = "service-card";
    link.dataset.serviceId = serviceId;
    link.setAttribute("aria-label", `Prenota ${service.title}`);

    link.innerHTML = `
      <h4>
        <span>${service.title}</span>
        ${ARROW_SVG_SERVICE}
      </h4>
    `;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-service", () => setupServiceBooking(activeStudioId, serviceId));
    });

    container.appendChild(link);
  });
}


// =============================================================================
// 7. STUDIO DETAIL SETUP
// =============================================================================
// Popola la view-detail con i dati dello studio selezionato.

/**
 * @param {string} studioId — L'id dello studio (corrisponde a STUDIOS_DATA[n].id)
 */
function setupStudioDetail(studioId) {
  activeStudioId = studioId;
  const studio   = STUDIOS_DATA.find(s => s.id === studioId);
  if (!studio) return;

  // Testi studio
  document.getElementById("detail-studio-name").textContent = studio.name;
  document.getElementById("detail-address-text").textContent = studio.address;
  document.getElementById("detail-address-link").href        = studio.mapsLink;

  // Logo studio nel banner dettaglio (pulisce prima il contenuto precedente)
  const logoContainer = document.getElementById("detail-logo-container");
  logoContainer.innerHTML = "";
  logoContainer.appendChild(createImageWithFallback({
    src:          studio.logo,
    alt:          `${studio.name} Logo`,
    className:    "studio-logo-img",
    fallbackType: "logo-studio",
    initial:      studio.initial
  }));

  // Genera le card dei servizi
  renderServiceCards();
}


// =============================================================================
// 8. SERVICE BOOKING SETUP
// =============================================================================
// Popola la view-service e monta l'embed Cal per lo studio+servizio selezionati.

/**
 * @param {string} studioId  — ID dello studio selezionato
 * @param {string} serviceId — ID del servizio selezionato (chiave di SERVICES_CONFIG)
 */
function setupServiceBooking(studioId, serviceId) {
  const studio  = STUDIOS_DATA.find(s => s.id === studioId);
  const service = SERVICES_CONFIG[serviceId];
  if (!studio || !service) return;

  // Recupera il calLink dallo studio — è l'unico dato variabile per studio+servizio
  const studioService = studio.services && studio.services[serviceId];
  const calLink       = studioService ? studioService.calLink : "";

  // Popola il banner studio (mini-header nella view-service)
  document.getElementById("service-studio-name").textContent     = studio.name;
  document.getElementById("service-studio-location").textContent = `${studio.name} (${studio.location})`;

  // Popola l'header del servizio
  document.getElementById("service-booking-title").textContent    = service.title;
  document.getElementById("service-booking-desc").textContent     = service.desc;
  document.getElementById("service-booking-duration").textContent = `Durata: ${service.duration}`;

  // Logo studio nel banner del servizio
  const logoContainer = document.getElementById("service-studio-logo-container");
  logoContainer.innerHTML = "";
  logoContainer.appendChild(createImageWithFallback({
    src:          studio.logo,
    alt:          `${studio.name} Logo`,
    className:    "studio-logo-img",
    fallbackType: "logo-studio",
    initial:      studio.initial
  }));

  // Monta l'embed Cal con namespace univoco per questo studio+servizio
  // Il namespace previene conflitti se l'utente naviga tra servizi diversi
  const namespace = `${serviceId}-${studioId}`;
  mountCalEmbed(calLink, namespace);
}


// =============================================================================
// 9. EVENT LISTENERS — Inizializzazione al DOMContentLoaded
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {

  // --- Fallback immagini statiche già presenti nell'HTML al caricamento ---
  document.querySelectorAll("img").forEach(img => {
    if (img.complete && img.naturalWidth === 0) handleImageError(img);
    img.addEventListener("error", () => handleImageError(img));
  });

  // --- Genera la griglia studi (da studios.js) ---
  renderStudioCards();

  // --- CTA Home → Booking ---
  const ctaPrenota = document.getElementById("cta-prenota");
  if (ctaPrenota) {
    ctaPrenota.addEventListener("click", () => switchView("view-booking"));
  }

  // --- Logo Header → Home ---
  const headerLogoBtn = document.getElementById("header-logo-btn");
  if (headerLogoBtn) {
    headerLogoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-home");
    });
  }

  // --- Back to Home (tutti i pulsanti con classe .btn-back-home) ---
  document.querySelectorAll(".btn-back-home").forEach(btn => {
    btn.addEventListener("click", () => switchView("view-home"));
  });

  // --- Back to Studio List (da view-detail) ---
  const btnBackStudios = document.getElementById("btn-back-studios");
  if (btnBackStudios) {
    btnBackStudios.addEventListener("click", () => switchView("view-booking"));
  }

  // --- Back to Studio Detail (da view-service) ---
  const btnBackDetail = document.getElementById("btn-back-detail");
  if (btnBackDetail) {
    btnBackDetail.addEventListener("click", () => {
      switchView("view-detail", () => setupStudioDetail(activeStudioId));
    });
  }

});
