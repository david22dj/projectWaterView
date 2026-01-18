# WaterView – Webová aplikácia na monitorovanie spotreby vody

WaterView je webová aplikácia rozdelená na klientsku a serverovú časť, určená na monitorovanie spotreby vody podľa miestností, miest merania a senzorov. Súčasťou aplikácie je autentifikácia používateľov, administrátorské rozhranie, grafy spotreby, história záznamov a správa faktúr (upload, zoznam, stiahnutie).

---

## 1. Požiadavky

Na spustenie aplikácie je potrebné mať nainštalované:

- **Node.js** (odporúčaná verzia 18 alebo vyššia)
- **npm** (súčasť Node.js)
- Webový prehliadač (Chrome, Firefox, Edge)

---

## 2. Inštalácia projektu

### 2.1 Naklonovanie projektu
```bash
git clone <URL_REPOZITÁRA>
cd projectpomaly
2.2 Inštalácia závislostí
bash
Kopírovať kód
npm install
##3. Databáza
Aplikácia používa SQLite databázu.

Databáza sa vytvára automaticky pri prvom spustení aplikácie.

Ak bola databáza zmazaná alebo aplikácia ešte nikdy nebola spustená, je potrebné inicializovať používateľov pomocou seed skriptu.

###3.1 Inicializácia používateľov (seed)
Ak databáza ešte neobsahuje žiadnych používateľov, spustite:

bash
Kopírovať kód
node seedUsers.js
Tento skript:

vytvorí základných používateľov (napr. admin účet),

zahashuje heslá pomocou bcrypt,

pripraví databázu na prvé prihlásenie.

##4. Spustenie aplikácie
###4.1 Spustenie vývojového servera
bash
Kopírovať kód
npm run dev
alebo

bash
Kopírovať kód
node index.js
Aplikácia bude dostupná na adrese:

arduino
Kopírovať kód
http://localhost:3000
##5. Prihlásenie do aplikácie
Aplikácia obsahuje prihlasovací formulár.

Prístup k aplikácii je možný až po prihlásení

Administrátor má prístup k administračnému panelu

Bežný používateľ má prístup k prehľadu spotreby

##6. Funkcionalita aplikácie
Prihlasovanie a odhlasovanie používateľov

Správa miestností, miest merania a senzorov (CRUD operácie)

Evidencia a zobrazovanie záznamov spotreby vody

Grafické zobrazenie spotreby (Chart.js)

História spotreby s filtrovaním podľa dátumu

Administrátorský panel

Práca so súbormi – faktúry:

upload faktúry

zoznam faktúr

stiahnutie faktúry

mazanie faktúr

Responzívny dizajn (desktop / mobil)

##7. Bezpečnosť
Aplikácia spĺňa základné bezpečnostné zásady:

Kontrola vstupov na strane klienta aj servera

Ochrana proti SQL Injection (parametrizované dotazy)

Chránené API endpointy (session autentifikácia)

Heslá sú ukladané výhradne ako hash (bcrypt)

Oddelenie verejných a chránených častí aplikácie

##8. Použité technológie
Node.js

Express

SQLite

Chart.js

HTML, CSS, JavaScript (vanilla)

express-session

bcrypt

multer (upload súborov)

##9. Architektúra
Aplikácia je implementovaná podľa princípov MVC architektúry:

Modely – databázová logika

Controller-y – aplikačná logika

Routes – API rozhranie

Middleware – autentifikácia, upload súborov

Client – HTML, CSS, JavaScript

##10. Štruktúra projektu (zjednodušene)
pgsql
Kopírovať kód
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── db.js
 └── index.js

public/
 ├── *.html
 ├── *.js
 └── style.css

seedUsers.js
