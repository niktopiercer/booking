# Cartella Assets — NIKTO Body Piercer

Questa cartella contiene le immagini del sito. Se un'immagine manca, il sito mostra automaticamente placeholder grafici premium.

## Struttura

```
assets/
├── studios/          ← loghi degli studi (gestiti dal tool esterno)
│   ├── katrame.jpg
│   └── arcanum.jpg
├── nikto-logo.png    ← logo personale NIKTO (header)
├── nikto-photo.png   ← foto ritratto per la home hero
└── README.md
```

## Immagini richieste

### Sito principale
- `nikto-logo.png` — Logo personale (header, favicon). Consigliato: PNG con trasparenza, ~200×200px
- `nikto-photo.png` — Foto ritratto per la home hero. Consigliato: formato verticale 4/5

### Loghi studi (in `assets/studios/`)
Ogni studio ha il proprio logo in questa sottocartella.
Il path di ogni logo è configurato nel campo `logo` in `studios.js`.

Se un logo manca o non si carica, il sito mostra automaticamente un placeholder
con la lettera iniziale dello studio (configurata nel campo `initial` in `studios.js`).

## Aggiungere un nuovo logo studio

1. Salva il file in `assets/studios/nome-studio.jpg` (o `.png`)
2. Aggiorna il campo `logo` del corrispondente studio in `studios.js`:
   ```js
   logo: "./assets/studios/nome-studio.jpg"
   ```
