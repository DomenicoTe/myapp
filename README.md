# myapp

Demo Node.js monorepo con supporto plugin/moduli, CI/CD, SonarQube e Nexus

## Struttura
- **index.js**: entrypoint principale, carica moduli e plugin dinamicamente
- **bin/**: script CLI (cicd, archive, store, ecc.)
- **packages/** e **extensions/**: workspace per moduli e plugin
- **config.js**: configurazione porta e plugin attivi

## Comandi principali
- `npm ci` — installa le dipendenze
- `npm run cicd` — pipeline completa: install, sonar, build, zip, upload
- `npm run archive` — crea uno zip cross-platform della build
- `npm run store -a <artifact>` — carica un artifact su MinIO

## CI/CD
- Analisi SonarQube integrata
- Build e archiviazione automatica
- Pronto per deploy su Nexus

## Note
- I plugin vengono caricati solo se elencati in `config.plugins`
- I moduli vengono caricati sempre
- Richiede Node.js >= 18
- Per build standalone, attenzione ai require dinamici (vedi pkg docs)

## Ignorati da git
- node_modules, dist, scannerwork, .env, *.zip

---

Per dettagli su pipeline Jenkins, SonarQube e Nexus, vedi i commenti nel codice o chiedi supporto!
