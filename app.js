/**
 * NIKTO Body Piercer - Application Script
 * Gestisce la navigazione tra le viste (Home, Booking, Dettaglio Studio),
 * la popolazione dinamica dei dati degli studi e il caricamento dei fallback grafici.
 */

// --- DATA SYSTEM ---
const studiosData = {
  katrame: {
    name: "KATRAME Tattoo Studio",
    location: "Schio",
    address: "Via B. Brandellero, 22 — Schio (VI)",
    mapsLink: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4778b3ab4d72869f:0xc989f142444135aa",
    logo: "./assets/katrame.jpg",
    initial: "K",
  },
  arcanum: {
    name: "ARCANUM — Bottega d'Arte",
    location: "Verona",
    address: "Via della Valverde, 57 — Verona (VR)",
    mapsLink: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x477f5ff9c10ba373:0xe9b79958a0abdc95",
    logo: "./assets/arcanum.jpg",
    initial: "A",
  }
};

let activeStudioKey = "";

const servicesData = {
  "nuovo-piercing": {
    title: "Nuovo piercing",
    desc: "Prenota questo appuntamento per eseguire un nuovo piercing. Nelle note indica il piercing che vorresti fare. Se sei minorenne, devi presentarti accompagnato da un genitore o tutore legale; sia il minore sia l’accompagnatore devono portare un documento d’identità e il codice fiscale.",
    duration: "45 minuti"
  },
  "cambio-gioiello": {
    title: "Cambio, rimozione o acquisto gioiello",
    desc: "Prenota questo appuntamento per cambio gioiello, rimozione, re-inserimento o consulenza per l’acquisto di un nuovo gioiello per piercing.",
    duration: "30 minuti"
  },
  "controllo-consulenza": {
    title: "Controllo piercing e consulenza",
    desc: "Prenota questo appuntamento per un controllo del piercing, un check di guarigione oppure una consulenza in caso di dubbi, fastidi o problematiche legate al piercing.",
    duration: "15 minuti"
  }
};

// --- VIEW NAVIGATION ENGINE ---
let currentViewId = "view-home";
let isTransitioning = false;

/**
 * Cambia vista gestendo le transizioni in modo fluido, senza flash ed evitando sovrapposizioni.
 * @param {string} targetViewId - L'ID della sezione HTML da attivare.
 * @param {function} beforeShowCallback - Funzione eseguita quando la nuova vista è invisibile, prima del fade-in.
 */
function switchView(targetViewId, beforeShowCallback = null) {
  if (isTransitioning || targetViewId === currentViewId) return;
  
  const currentView = document.getElementById(currentViewId);
  const targetView = document.getElementById(targetViewId);
  
  if (!currentView || !targetView) return;
  
  isTransitioning = true;
  
  // 1. Inizia il fade-out della vista corrente
  currentView.classList.remove("active");
  
  // 2. Attendi la fine della transizione CSS (500ms)
  setTimeout(() => {
    // 3. Nascondi la vista uscente
    currentView.classList.remove("visible");
    
    // 4. Esegui la callback per caricare i dati (se presente)
    if (typeof beforeShowCallback === 'function') {
      beforeShowCallback();
    }
    
    // 5. Prepara la vista entrante (display: block, ma trasparente)
    targetView.classList.add("visible");
    
    // Forza il reflow del browser per registrare la rimozione del display:none
    targetView.offsetHeight; 
    
    // 6. Avvia il fade-in della nuova vista
    targetView.classList.add("active");
    currentViewId = targetViewId;
    
    // Ripristina lo scroll all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    isTransitioning = false;
  }, 500);
}

// --- POPULATE STUDIO DETAIL ---
function setupStudioDetail(studioKey) {
  activeStudioKey = studioKey;
  const studio = studiosData[studioKey];
  if (!studio) return;
  
  // Nome studio e indirizzo
  document.getElementById("detail-studio-name").textContent = studio.name;
  document.getElementById("detail-address-text").textContent = studio.address;
  document.getElementById("detail-address-link").href = studio.mapsLink;
  
  // Link prenotazioni (ora gestiti internamente via JS)
  document.getElementById("link-nuovo-piercing").href = "#";
  document.getElementById("link-cambio-gioiello").href = "#";
  document.getElementById("link-controllo-consulenza").href = "#";
  
  // Gestione dinamica logo con rimozione di placeholder precedenti
  const logoContainer = document.getElementById("detail-logo-container");
  logoContainer.innerHTML = ""; // Pulisce
  
  const img = document.createElement("img");
  img.id = "detail-logo";
  img.className = "studio-logo-img";
  img.alt = `${studio.name} Logo`;
  img.setAttribute("data-fallback", "logo-studio");
  img.setAttribute("data-initial", studio.initial);
  img.src = studio.logo;
  
  // Listener per errori di caricamento immagine sul nuovo elemento
  img.addEventListener("error", () => handleImageError(img));
  logoContainer.appendChild(img);
  
  // Controllo immediato per immagini memorizzate nella cache del browser
  setTimeout(() => {
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
  }, 50);
}

// --- POPULATE SERVICE BOOKING (CAL EMBED) ---
function setupServiceBooking(studioKey, serviceKey) {
  const studio = studiosData[studioKey];
  const service = servicesData[serviceKey];
  if (!studio || !service) return;
  
  // Popola testi del banner e del servizio
  document.getElementById("service-studio-name").textContent = studio.name;
  document.getElementById("service-studio-location").textContent = `${studio.name} (${studio.location})`;
  document.getElementById("service-booking-title").textContent = service.title;
  document.getElementById("service-booking-desc").textContent = service.desc;
  document.getElementById("service-booking-duration").textContent = `Durata: ${service.duration}`;
  
  // Gestione dinamica logo studio nel banner
  const logoContainer = document.getElementById("service-studio-logo-container");
  logoContainer.innerHTML = "";
  
  const img = document.createElement("img");
  img.className = "studio-logo-img";
  img.alt = `${studio.name} Logo`;
  img.setAttribute("data-fallback", "logo-studio");
  img.setAttribute("data-initial", studio.initial);
  img.src = studio.logo;
  
  img.addEventListener("error", () => handleImageError(img));
  logoContainer.appendChild(img);
  
  setTimeout(() => {
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
  }, 50);
  
  // Creazione pulita del target per Cal inline
  const embedWrapper = document.querySelector(".cal-embed-wrapper");
  embedWrapper.innerHTML = ""; // Pulisce iframe precedenti
  
  const calTarget = document.createElement("div");
  const embedId = `my-cal-inline-${serviceKey}-${studioKey}`;
  calTarget.id = embedId;
  calTarget.className = "cal-embed-target";
  calTarget.style.width = "100%";
  calTarget.style.height = "100%";
  calTarget.style.overflow = "scroll";
  embedWrapper.appendChild(calTarget);
  
  // Configurazione dinamica per Cal
  const calLink = `nikto/${serviceKey}-${studioKey}`;
  const namespace = `${serviceKey}-${studioKey}`;
  
  // Snippet di caricamento asincrono Cal
  (function (C, A, L) { 
    let p = function (a, ar) { a.q.push(ar); }; 
    let d = C.document; 
    C.Cal = C.Cal || function () { 
      let cal = C.Cal; 
      let ar = arguments; 
      if (!cal.loaded) { 
        cal.ns = {}; 
        cal.q = cal.q || []; 
        d.head.appendChild(d.createElement("script")).src = A; 
        cal.loaded = true; 
      } 
      if (ar[0] === L) { 
        const api = function () { p(api, arguments); }; 
        const namespace = ar[1]; 
        api.q = api.q || []; 
        if(typeof namespace === "string"){
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar); 
        return;
      } 
      p(cal, ar); 
    }; 
  })(window, "https://app.cal.eu/embed/embed.js", "init");

  // Inizializza namespace univoco
  Cal("init", namespace, {origin:"https://app.cal.eu"});
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;

  // Carica il widget inline (con tema dark integrato)
  Cal.ns[namespace]("inline", {
    elementOrSelector: `#${embedId}`,
    config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true", "theme": "dark"},
    calLink: calLink,
  });

  // Configura UI (tema dark fisso, brand color viola e dettagli del tipo evento nascosti)
  Cal.ns[namespace]("ui", {
    theme: "dark",
    hideEventTypeDetails: true,
    layout: "month_view",
    cssVarsPerTheme: {
      light: {
        "cal-brand": "#6C178F",
        "cal-text": "#C9A96E",
        "cal-text-emphasis": "#C9A96E",
        "cal-text-subtle": "#C9A96E",
        "cal-text-inverted": "#0A0A0A"
      },
      dark: {
        "cal-brand": "#6C178F",
        "cal-text": "#C9A96E",
        "cal-text-emphasis": "#C9A96E",
        "cal-text-subtle": "#C9A96E",
        "cal-text-inverted": "#0A0A0A"
      }
    }
  });
  }

// --- IMAGE FALLBACK ENGINE ---
/**
 * Rimpiazza le immagini non caricate (404) con segnaposto grafici premium.
 * @param {HTMLImageElement} img - L'elemento immagine che ha fallito il caricamento.
 */
function handleImageError(img) {
  const fallbackType = img.getAttribute("data-fallback");
  const parent = img.parentElement;
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

// --- SETUP EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Intercetta gli errori di caricamento per le immagini statiche iniziali
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
    img.addEventListener("error", () => {
      handleImageError(img);
    });
  });

  // 2. CTA Home -> Booking
  const ctaPrenota = document.getElementById("cta-prenota");
  if (ctaPrenota) {
    ctaPrenota.addEventListener("click", () => {
      switchView("view-booking");
    });
  }

  // 3. Logo Header -> Home
  const headerLogoBtn = document.getElementById("header-logo-btn");
  if (headerLogoBtn) {
    headerLogoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-home");
    });
  }

  // 4. Back to Home (dai vari pulsanti nelle altre viste)
  const backHomeButtons = document.querySelectorAll(".btn-back-home");
  backHomeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      switchView("view-home");
    });
  });

  // 5. Back to Studios List (dalla vista di dettaglio)
  const btnBackStudios = document.getElementById("btn-back-studios");
  if (btnBackStudios) {
    btnBackStudios.addEventListener("click", () => {
      switchView("view-booking");
    });
  }

  // 5b. Back to Studio Detail (dalla vista del servizio)
  const btnBackDetail = document.getElementById("btn-back-detail");
  if (btnBackDetail) {
    btnBackDetail.addEventListener("click", () => {
      switchView("view-detail", () => setupStudioDetail(activeStudioKey));
    });
  }

  // 5c. Gestione click sui servizi dello studio per aprire l'embed inline Cal
  const linkNuovo = document.getElementById("link-nuovo-piercing");
  if (linkNuovo) {
    linkNuovo.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-service", () => setupServiceBooking(activeStudioKey, "nuovo-piercing"));
    });
  }
  
  const linkCambio = document.getElementById("link-cambio-gioiello");
  if (linkCambio) {
    linkCambio.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-service", () => setupServiceBooking(activeStudioKey, "cambio-gioiello"));
    });
  }
  
  const linkControllo = document.getElementById("link-controllo-consulenza");
  if (linkControllo) {
    linkControllo.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-service", () => setupServiceBooking(activeStudioKey, "controllo-consulenza"));
    });
  }

  // 6. Selezione dello studio nella griglia (click e tastiera)
  const studioCards = document.querySelectorAll(".studio-card");
  studioCards.forEach(card => {
    const key = card.getAttribute("data-studio-key");
    
    // Navigazione tramite click
    card.addEventListener("click", () => {
      switchView("view-detail", () => setupStudioDetail(key));
    });
    
    // Navigazione tramite tasto Enter per accessibilità
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchView("view-detail", () => setupStudioDetail(key));
      }
    });
  });
});
