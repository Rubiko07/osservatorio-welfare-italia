# Come mettere online la piattaforma — 10 minuti, gratis

Questo è un sito vero: quando lo pubblichi, ogni visita legge i dati
direttamente dal tuo database Neon in tempo reale. Se aggiungi dati al
database, il sito li mostra subito, senza che io debba rigenerare nulla.

## 1. Crea un account GitHub (se non l'hai già)
https://github.com/signup — gratuito.

## 2. Carica questi file su GitHub
- Vai su https://github.com/new, crea un repository chiamato ad esempio
  `piattaforma-welfare` (puoi lasciarlo privato).
- Nella pagina del repository appena creato, usa "uploading an existing file"
  e trascina dentro TUTTI i file e le cartelle che trovi qui (compresi
  `api/`, `public/`, `package.json`, `vercel.json`).
- Conferma il commit.

## 3. Crea un account Vercel (se non l'hai già)
https://vercel.com/signup — scegli "Continue with GitHub", così i due
account sono già collegati. Gratuito.

## 4. Importa il progetto
- Su Vercel, "Add New… → Project".
- Seleziona il repository `piattaforma-welfare` che hai appena creato.
- **Prima di cliccare Deploy**, apri "Environment Variables" e aggiungi:
  - Nome: `DATABASE_URL`
  - Valore: (la stringa di connessione qui sotto — è una chiave d'accesso
    di sola lettura al tuo database: può leggere i dati ma non può
    modificarli né cancellarli)

```
postgresql://public_api_readonly:npg_VY7aklUhI9LW@ep-little-pine-axbt91m7-pooler.c-4.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

- Clicca **Deploy**.

## 5. Fatto
Dopo circa un minuto Vercel ti dà un link tipo
`https://piattaforma-welfare-tuonome.vercel.app` — quello è il sito
pubblico, vero, sempre aggiornato. Puoi condividerlo, metterlo su LinkedIn,
linkarlo dal Cantiere del Welfare.

## Poi, se vuoi
- **Dominio tuo**: su Vercel → Settings → Domains puoi collegare un
  sottodominio come `dati.ilcantierewelfare.it` (serve solo aggiungere un
  record DNS dove hai comprato il dominio).
- **Aggiornare i dati**: quando carichiamo nuovi dati su Neon, il sito li
  mostra da solo, senza bisogno di ripubblicare nulla.
- **Se qualcosa non funziona**: il posto giusto dove guardare è
  Vercel → il tuo progetto → tab "Deployments" → clicca sull'ultimo
  deploy → "Function Logs", lì si vede l'errore esatto. Copiamelo e lo
  risolviamo insieme.
