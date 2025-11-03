### Plan van aanpak

Doel: Een eenvoudige, goed werkende RESTful API voor artikelen bouwen met Laravel, zodat een beoordelaar de applicatie lokaal kan opzetten en testen. Daarnaast ook front-end maken, eerst wil ik me voornamelijk aan de back-end focussen.

Stappen:
1. Installatie
    - Laravel-project aanmaken via Composer en basisconfiguratie uitvoeren.
2. Database & migrations
    - Lokale database instellen (.env),  SQLite.
    - Migrations en seeders maken voor de tabel articles zodat testen makkelijk is.
3. Models & controller
    - Article-model aanmaken met velden zoals title, body, author en timestamps.
    - Resource controller (ArticleController) met complete CRUD-logica implementeren.
4. Routes / Endpoints
    - GET /articles → lijst ophalen
    - POST /articles → nieuw artikel aanmaken
    - PUT /articles/{id} → artikel bijwerken
    - DELETE /articles/{id} → artikel verwijderen
5. Validatie
    - Input validatie bij create/update: verplichte velden, maximale lengte en juiste types.
6. Authenticatie & autorisatie
    - Laravel’s standaardauth gebruiken (Breeze).
7. Testen en documentatie
    - Basis feature-tests (PHPUnit) voor de endpoints schrijven.
8. Oplevering
    - Werkende API in de repository met duidelijke setup-instructies zodat de beoordelaar lokaal kan draaien en testen.
9. Indien tijd over Caching implementeren -> Image uploaden -> Search and filtering -> Provide a Dockerfile or short deployment instructions.

### Thoughts and choises

## Backend (Laravel)

Ik ben begonnen met het opzetten van publieke API-endpoints, zodat ik snel kon testen of de basis van de applicatie werkte. Daarna heb ik direct de **models**, **controllers** en andere benodigde bestanden aangemaakt om een duidelijke structuur te hebben voor verdere uitbreiding.

### Database
Ik heb gekozen voor **SQLite**, omdat dit “out of the box” werkt voor iedereen — geen extra databaseconfiguratie nodig, ideaal voor een snelle setup.  
Daarnaast heb ik een **factory + seeder** toegevoegd, zodat ik met één command (`php artisan migrate:fresh --seed`) eenvoudig nieuwe testdata kan genereren.

### Authenticatie
Voor authenticatie gebruik ik **Bearer Tokens**.  
Uit eerdere ervaring weet ik dat dit een veilige en gangbare methode is voor API-authenticatie, zeker bij gebruik van Laravel Sanctum

### Validatie en foutafhandeling
Tijdens het bouwen merkte ik dat **validatie-errors** niet automatisch zichtbaar waren. Daarom heb ik in `bootstrap/app.php` extra configuratie toegevoegd om validatie-fouten netjes in de JSON-response te tonen. Zo wordt duidelijk waarom een request eventueel faalt.

### Testing
Ik heb **unit tests** geschreven om per endpoint te verifiëren dat alles correct functioneert — inclusief het uploaden van afbeeldingen.  
Hiervoor moest ik een bepaalde PHP-extensie activeren in de `php.ini`, omdat de standaardinstellingen dit blokkeerden.

## Frontend (React)

Voor het frontendgedeelte heb ik **AI-ondersteuning** gebruikt.  
Ik heb zelf beperkte ervaring met React, maar wel sterke kennis in **HTML, CSS, JavaScript en jQuery**, en enige kennis van **Vue.js/Nuxt.js**.  
Daarom heb ik ervoor gekozen dit deel als **showcase** te laten dienen: ik heb de structuur laten genereren met AI, maar ik begrijp de gegenereerde code en heb deze handmatig aangepast waar nodig.

---

# Run instructions (backend + frontend)

Onderstaande instructies beschrijven hoe je het project lokaal kunt draaien zonder Docker.

---

### INSTALL_GUIDE

# Back-end (Laravel)

## 1. SQLite database aanmaken en configureren
```bash 
composer i
``` 

## 2. SQLite database aanmaken en configureren
```bash 
mkdir -p database
touch database/database.sqlite 
``` 

## 3. Database migreren en seeden (maakt testdata aan)
```bash 
    php artisan migrate --seed
```

## 4. Enable extension in php.ini
Dit is nodig voor een unit test die ik had gemaakt m.b.t image uploaden.
Moet er zo uit zien:
```bash
 extension=gd
```

## 5. Server starten (standaard op http://127.0.0.1:8000)
```bash 
php artisan serve
```

# FRONTEND (React / Vite)

## Open nieuwe terminal in projectroot
```bash 
cd ../frontend
```

##  1. NPM dependencies installeren
```bash 
npm install
```

## 2. Start de frontend (Vite dev server op http://localhost:5173)
```bash 
npm run dev
```