# Duevio website

Restyling completo del sito pubblico Duevio, ispirato alla composizione di Alpian: navigazione sospesa, titoli ampi, spazi generosi, pulsanti arrotondati e pannelli chiari. Conserva blu e turchese Duevio.

## Contenuti

- 130 pagine pubbliche dalla sitemap Duevio del 6 novembre 2026.
- Sette lingue: inglese, italiano, maltese, tedesco, spagnolo, francese e russo.
- Home, prodotto, settori, prezzi, funzionalità, mercati e contenuti legali originali.
- Richieste demo e Custom, preferenze cookie, link al servizio di registrazione e login originali.
- Testi preservati; indirizzi email pubblici decodificati dall'offuscamento Cloudflare.

## Anteprima

Richiede Python 3, senza dipendenze da installare.

```sh
python3 -m http.server 4173
```

Aprire http://localhost:4173 oppure http://localhost:4173/it/.

## Struttura

Le pagine HTML e le traduzioni sono contenuti originali. `assets/css/redesign.css` contiene il restyling condiviso e i breakpoint responsive. `assets/js/app.js` conserva il comportamento originale; `assets/js/seo-route.js` gestisce le pagine interne.

Il sito statico supporta sia la radice di un dominio sia sottopercorsi come `/duevio-website/` su GitHub Pages. Gli asset HTML sono relativi alla pagina; navigazione e traduzioni ricavano la radice del sito dall’URL degli script. Non occorre alcuna build.

## Verifica

```sh
python3 scripts/check.py
```

Verifica impronte dei testi di tutte le pagine, asset locali e file di traduzione. Controlli visivi eseguiti in browser su desktop e mobile. I moduli conservano l'endpoint Duevio esistente: non sono state inviate richieste reali durante la verifica. L'accettazione CORS sul futuro dominio deve essere verificata dal gestore dell'endpoint.

La pubblicazione in questa repository non modifica il dominio di produzione duevio.com.
