# TECHNICAL README — NIKTO Booking Site

Guida tecnica per il tool esterno che gestisce gli studi e i dati di prenotazione.

---

## Struttura del progetto

```
nikto-booking-refactor/
├── index.html          ← Struttura HTML (non toccare)
├── style.css           ← Stile visivo (non toccare)
├── studios.js          ← ★ UNICO FILE DA MODIFICARE per aggiungere/rimuovere/modificare studi
├── app.js              ← Logica applicazione (non toccare salvo aggiornamenti di sistema)
└── assets/
    ├── studios/        ← Loghi degli studi (aggiungere immagini qui)
    │   ├── katrame.jpg
    │   └── arcanum.jpg
    ├── nikto-logo.png
    └── nikto-photo.png
```

---

## File principale: `studios.js`

È l'unico file che il tool esterno deve leggere e scrivere.
Contiene la variabile globale `STUDIOS_DATA`, un array di oggetti studio.

### Struttura di uno studio

```js
{
  id:       "katrame",                   // [string] Key univoca, senza spazi
  active:   true,                        // [boolean] false = nascosto nel sito
  name:     "KATRAME Tattoo Studio",     // [string] Nome completo (visibile)
  location: "Schio",                     // [string] Città (visibile)
  address:  "Via B. Brandellero, 22...", // [string] Indirizzo testuale (visibile, link Maps)
  mapsLink: "https://maps.google.com/...", // [string] URL Google Maps
  logo:     "./assets/studios/katrame.jpg", // [string] Path relativo immagine logo
  initial:  "K",                         // [string] Lettera fallback se logo assente

  services: {
    // Per ogni servizio: solo il calLink è variabile.
    // Tutto il resto (titolo, descrizione, durata, UI embed) è fisso in app.js.
    "nuovo-piercing":       { calLink: "nikto/nuovo-piercing-katrame" },
    "cambio-gioiello":      { calLink: "nikto/cambio-gioiello-katrame" },
    "controllo-consulenza": { calLink: "nikto/controllo-consulenza-katrame" }
  }
}
```

---

## Operazioni supportate

### Aggiungere uno studio

1. Aggiungere un oggetto all'array `STUDIOS_DATA` in `studios.js` seguendo la struttura sopra
2. Salvare il logo in `assets/studios/nome-studio.jpg`
3. Impostare `active: true`
4. Inserire i `calLink` corretti per i 3 servizi

Il sito genererà automaticamente la card nella lista studi alla prossima apertura.

### Disattivare temporaneamente uno studio

Impostare `active: false` nell'oggetto studio in `studios.js`.
Lo studio sparirà immediatamente dalla lista pubblica senza eliminare i dati.

### Riattivare uno studio

Impostare `active: true`.

### Eliminare uno studio

Rimuovere l'intero oggetto dall'array `STUDIOS_DATA` in `studios.js`.
Non restano residui nel DOM — tutto è generato dinamicamente.

### Modificare il calLink di un servizio

Aggiornare il campo `calLink` nel sotto-oggetto `services` dello studio interessato.

Esempio: se il link Cal per il nuovo piercing di Katrame cambia,
aggiornare solo questa riga in `studios.js`:
```js
"nuovo-piercing": { calLink: "nikto/nuovo-nome-evento-katrame" }
```

---

## Come ottenere il calLink da Cal.eu

1. Aprire Cal.eu / Cal.com → Event Types
2. Selezionare l'evento desiderato
3. Il calLink è la parte del link dopo il dominio:
   - Es. `https://app.cal.eu/nikto/nuovo-piercing-katrame`
   - Il calLink da salvare è: `nikto/nuovo-piercing-katrame`

Non serve incollare snippet completi — solo il path.

---

## Servizi standard (fissi, non modificare tramite tool)

I 3 servizi sono definiti in `app.js` nella costante `SERVICES_CONFIG`.
Titolo, descrizione e durata sono uguali per tutti gli studi e non variano per studio.
L'unico dato per-studio per ogni servizio è il `calLink`.

| ID servizio              | Titolo visibile                          | Durata  |
|--------------------------|------------------------------------------|---------|
| `nuovo-piercing`         | Nuovo piercing                           | 45 min  |
| `cambio-gioiello`        | Cambio, rimozione o acquisto gioiello    | 30 min  |
| `controllo-consulenza`   | Controllo piercing e consulenza          | 15 min  |

---

## Compatibilità

- **GitHub Pages**: sì, sito statico puro (HTML + CSS + JS, nessun backend)
- **Cal.eu embed**: inline, configurazione centralizzata in `app.js`
- **Sviluppo locale**: aprire `index.html` direttamente nel browser (funziona su `file://`)

---

## Note per il tool esterno

- `studios.js` è un file JavaScript standard — può essere letto e scritto come testo
- La struttura è un array JS con oggetti annidati, facilmente parsabile
- In alternativa futura: il formato può essere convertito in JSON puro se il sito
  viene servito con un mini-server locale (es. `npx serve`)
- Le immagini studi vanno sempre in `assets/studios/` con path relativo `./assets/studios/nome.jpg`
- Il campo `id` deve essere univoco e non contenere spazi o caratteri speciali
