# AlgeBäst

AlgeBäst är en webbapplikation för att öva på matematiken i högskoleprovet. Projektet består av en Vue-frontend och ett Express-API med MySQL som databas.

AlgeBäst är utvecklat som ett grupprojekt inom kurserna Utveckling av webbapplikationer och Agil utveckling på IT-Högskolan.

## Funktioner

- Välj ett helt provpass eller öva på frågor inom kategorierna XYZ, KVA, NOG och DTK (se [Kategorier](#kategorier)).
- Besvara en fråga i taget, hoppa över frågor och få rättning och eventuell förklaring.
- Genomför provpass med en timer på 55 minuter och se resultat efter inlämning.
- Registrera konto, logga in och hantera profil, lösenord och konto.
- Se sparade provresultat, övningsstatistik, övningshistorik och utmärkelser på profilsidan.
- Gör prov och övningar utan att registrera ett konto (gästläge).
- Inloggade användares övnings- och provsvar sparas automatiskt.
- Resultatet från ett prov som genomförts i gästläge kan sparas på användarens konto när användaren loggar in.
- Matematiska uttryck renderas med KaTeX.

### Kategorier

| Förkortning | Delprov                      |
| ----------- | ---------------------------- |
| XYZ         | Matematisk problemlösning    |
| KVA         | Kvantitativa jämförelser     |
| NOG         | Kvantitativa resonemang      |
| DTK         | Diagram, tabeller och kartor |

## Teknik

| Del               | Teknik                                        |
| ----------------- | --------------------------------------------- |
| Frontend          | Vue 3, Vue Router och Vite                    |
| Matematik         | KaTeX                                         |
| Ikoner            | Lucide Vue                                    |
| Backend           | Node.js och Express                           |
| Databas           | MySQL (mysql2)                                |
| Sessionshantering | `express-session` och `express-mysql-session` |

## Projektstruktur

```text
algebast/
├── frontend/
│   ├── src/
│   │   ├── components/   # Gränssnittskomponenter och formulär
│   │   ├── router/       # Klientrutterna
│   │   ├── services/     # Anrop till API:et
│   │   ├── utils/        # Hjälpfunktioner för matematikrendering
│   │   └── views/        # Appens sidor
│   ├── public/           # Ikoner och bilder till frågor
│   └── vite.config.js    # Vite-konfiguration och API-proxy
└── backend/
    ├── config/           # MySQL-anslutning
    ├── db/               # SQL-schema och provdata
    ├── middleware/       # Autentiseringsmiddleware
    ├── routes/           # API-rutter
    ├── .env.example      # Mall för miljövariabler
    └── app.js            # Express-applikation
```

### Sidor i frontend

| Sökväg           | Sida                        |
| ---------------- | --------------------------- |
| `/`              | Startsida                   |
| `/about`         | Information                 |
| `/exams`         | Provlista                   |
| `/exams/:examId` | Prov                        |
| `/exercises`     | Övningar                    |
| `/auth`          | Inloggning och registrering |
| `/profile`       | Profil                      |
| `/account`       | Kontoinställningar          |

## Kom igång

### Förutsättningar

- Node.js 22.18 eller senare inom 22.x, eller 24.12 eller senare (inkl. npm; se frontendens `engines`-krav)
- MySQL 8 eller senare
- Git

### 1. Klona repot

```bash
git clone https://github.com/ithsjava25/algebast.git
cd algebast
```

### 2. Installera beroenden

Gör detta först, eftersom importskriptet i steg 4 använder backendens beroenden.

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 3. Miljövariabler

Skapa `backend/.env` från exempelfilen:

```bash
cd backend
cp .env.example .env
cd ..
```

Fyll i uppgifterna enligt tabellen nedan. Checka aldrig in `.env`.

| Variabel         | Obligatorisk     | Beskrivning                                                                   | Exempel          |
| ---------------- | ---------------- | ----------------------------------------------------------------------------- | ---------------- |
| `DB_HOST`        | Ja               | Databasserverns adress                                                        | `localhost`      |
| `DB_PORT`        | Nej              | Databasserverns port (standard: `3306`)                                       | `3306`           |
| `DB_USER`        | Ja               | Databasanvändare                                                              | `algebast_user`  |
| `DB_PASSWORD`    | Ja               | Databasanvändarens lösenord                                                   | `byt-ut-mig`     |
| `DB_NAME`        | Ja               | Databasens namn; ska matcha namnet i `backend/db/01_schema.sql`               | `algeBest_db`    |
| `DB_SSL`         | Nej              | `true` för att ansluta med SSL (t.ex. molndatabas), annars `false` (standard) | `false`          |
| `DB_SSL_CA`      | Om `DB_SSL=true` | Sökväg till CA-certifikatfil. Filen måste finnas tillgänglig.                 | `./certs/ca.pem` |
| `SESSION_SECRET` | Ja               | Lång slumpmässig sträng som används för att signera sessionskakor             | se nedan         |
| `PORT`           | Nej              | Port som backend lyssnar på (standard: `3000`)                                | `3000`           |
| `NODE_ENV`       | Nej              | `development` eller `production`                                              | `development`    |

Exempel på `backend/.env` för lokal utveckling:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=algebast_user
DB_PASSWORD=byt-ut-mig
DB_NAME=algeBest_db
DB_SSL=false
SESSION_SECRET=byt-ut-mig-mot-en-lang-slumpmassig-strang
```

Generera en säker `SESSION_SECRET` med:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Skapa databasen

Kör från projektroten. Schemat skapar databasen, därför anges ingen databas i första kommandot.

```bash
mysql -u root -p < backend/db/01_schema.sql
```

Skapa databasanvändaren som du angav i `.env` och ge den behörighet. Byt ut lösenordet så att det matchar `DB_PASSWORD`:

```sql
CREATE USER 'algebast_user'@'localhost' IDENTIFIED BY 'byt-ut-mig';
GRANT ALL PRIVILEGES ON algeBest_db.* TO 'algebast_user'@'localhost';
FLUSH PRIVILEGES;
```

Ladda sedan resten av tabellerna:

```bash
mysql -u root -p algeBest_db < backend/db/02_create_users_table.sql
mysql -u root -p algeBest_db < backend/db/03_user_attempts_and_answers.sql
```

### 5. Importera provfrågorna

```bash
node backend/db/import-exams.js
```

Skriptet läser JSON-filerna i `backend/db/data/exams/` och använder databasinställningarna i `backend/.env`. Kör det på en tom databas första gången; om det körs igen uppdateras befintliga prov, frågor och svarsalternativ.

### 6. Starta applikationen

Kör i varsin terminal från projektroten:

```bash
cd backend
npm start
```

```bash
cd frontend
npm run dev
```

Öppna adressen som Vite skriver ut, vanligtvis `http://localhost:5173`. Under utveckling skickar Vite vidare anrop till `/api` till `http://localhost:3000`. Om backend körs på en annan adress behöver proxyn i `frontend/vite.config.js` ändras.

## Tillgängliga skript

**Frontend (`frontend/`)**

| Kommando          | Beskrivning                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Startar Vites utvecklingsserver             |
| `npm run build`   | Bygger frontend för produktion till `dist/` |
| `npm run preview` | Förhandsgranskar produktionsbygget          |

**Backend (`backend/`)**

| Kommando    | Beskrivning                         |
| ----------- | ----------------------------------- |
| `npm start` | Startar API-servern (`node app.js`) |

## API

Backendens API använder JSON och är tillgängligt under `/api`. Autentisering hanteras med sessionsbaserad inloggning och sessionskakor. Endpoints som hanterar användarens profil och personliga data kräver att användaren är inloggad.

| Metod    | Endpoint                                     | Kräver inloggning | Beskrivning                                               |
| -------- | -------------------------------------------- | ----------------- | --------------------------------------------------------- |
| `GET`    | `/api/exams`                                 | Nej               | Hämta tillgängliga prov                                   |
| `GET`    | `/api/exams/:id/questions`                   | Nej               | Hämta frågorna i ett prov                                 |
| `GET`    | `/api/questions?categories=KVA,NOG&count=10` | Nej               | Hämta ett slumpmässigt urval frågor                       |
| `POST`   | `/api/questions/check`                       | Nej               | Rätta svar. Svaren sparas bara om användaren är inloggad. |
| `POST`   | `/api/questions/claim-pending`               | Ja                | Spara ett gästprov på kontot efter inloggning             |
| `POST`   | `/api/users/register`                        | Nej               | Registrera användare                                      |
| `POST`   | `/api/users/login`                           | Nej               | Logga in                                                  |
| `POST`   | `/api/users/logout`                          | Nej               | Logga ut                                                  |
| `GET`    | `/api/users/me`                              | Ja                | Hämta inloggad användare                                  |
| `PATCH`  | `/api/users/me`                              | Ja                | Uppdatera profil                                          |
| `PATCH`  | `/api/users/me/password`                     | Ja                | Byta lösenord                                             |
| `DELETE` | `/api/users/me`                              | Ja                | Radera konto                                              |
| `GET`    | `/api/users/me/results`                      | Ja                | Hämta provhistorik                                        |
| `GET`    | `/api/users/me/results/:attemptId`           | Ja                | Hämta detaljer för ett provresultat                       |
| `GET`    | `/api/users/me/exercise-stats`               | Ja                | Hämta övningsstatistik                                    |
| `GET`    | `/api/users/me/exercise-history/:category`   | Ja                | Hämta övningshistorik för en kategori                     |
| `GET`    | `/api/badges`                                | Ja                | Hämta användarens utmärkelser                             |

## Team

- [Johan Briger](https://github.com/johanbriger/)
- [Simon Forsberg](https://github.com/simonforsberg/)
- [Jesper Larsson](https://github.com/jesperlarsson1910/)
- [Adam Majava](https://github.com/VonAdamo/)
