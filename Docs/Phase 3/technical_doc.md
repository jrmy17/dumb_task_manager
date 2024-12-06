# Documentation technique

## Technologies utilisées
- **Back :**
    - Express
    - Express-router
- **Base de donnée :**
    - postgreSQL
- **Front :** 
    - EJS
    - Tailwind
- **Test :**
    - Jest
    - Cypress
    - Supertest (et supertest-express)

## Structure du Projet

src/
├── Back/
│   ├── middleware/  # Middleware
│   ├── models/      # Modèles de données
│   ├── routes/      # Routes API
│   └── tests/       # Tests unitaires
├── Front/
│   ├── public/      # Assets statiques
│   ├── views/       # Templates EJS
│   └── tests/       # Tests du front
├── Data/
│   └── config/      # Configuration DB
└── cypress/         # Tests E2E