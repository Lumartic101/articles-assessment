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
