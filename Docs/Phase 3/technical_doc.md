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
- **Tests :**
  - Jest
  - Cypress
  - Supertest (et supertest-express)

## Structure du Projet

src/
├── Back/
│ ├── middleware/ # Middleware
│ ├── models/ # Modèles de données
│ ├── routes/ # Routes API
│ └── tests/ # Tests unitaires
├── Front/
│ ├── public/ # Assets statiques
│ ├── views/ # Templates EJS
│ └── tests/ # Tests du front
├── Data/
│ └── config/ # Configuration DB
└── cypress/ # Tests E2E

## Installation du projet

- Cloner le dépôt
- Installer les dépendances avec `npm install`
- Configurer les variables d'environnement dans le fichier `.env`
- Démarrer le serveur PostgreSQL
- Lancer l'initialisation de la base de données avec `npm run init-db`
- Lancer l'application avec `npm start`

## Utilisateur Admin par défaut

- **Username :** admin
- **Password :** fezq265e1rgAZZFS45$&d5az
