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
    │ ├── middleware/   # Middleware
    │ ├── models/       # Modèles de données
    │ ├── routes/       # Routes API
    │ └── tests/        # Tests unitaires
    ├── Front/
    │ ├── public/       # Assets statiques
    │ ├── views/        # Templates EJS
    │ └── tests/        # Tests du front
    ├── Data/
    │ └── config/       # Configuration DB
    └── cypress/        # Tests E2E

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

## Route API

- Auth
    - GET `/login` : renvoie la page de connexion.
        - retourne la view `pages/login`
    - POST `/login` : prend username et password et renvoie sur la page d'accueil en étant connecté.
        - appel la méthode `authenticate` du modèle `User`. Retourne la view `pages/home` en étant connecté si la connexion a fonctionnée. Sinon, retourne la view `page/login` avec un message d'erreur.
    - GET `/register` : renvoie la page d'inscription.
        - retourne la view `pages/register`.
    - POST `/register` : prend username, password, confirm-password, email et GDPR et renvoie sur la page de connexion après création du compte.
        - vérifie les champs donnés et appel la méthode `create` du modèle `User`.
        Retourne la view `page/login` si la création de compte a fonctionné ou retourne la view `page/register` avec une erreur dans le cas contraire.
    - GET `/logout` : renvoie sur la page de connexion en étant déconnecté.
        - retourne la view `page/login` après avoir détruit la session.
- Tasks (besoin dêtre connecté)
    - GET `/tasks` : renvoie sur la page des tasks.
        - retourne la view `pages/dashboard`
    - POST `/tasks` : prend title, description, completed et renvoie la page des tasks avec nouvelle tasks ajoutée.
        - appel la méthode `create` du modèle `Task` et retourne la view `pages/dashboard` si l'ajout a fonctionné. Renvoie une erreur `500` dans le cas contraire.
    - GET `/tasks/remove/:taskId` : prend l'Id d'une task et renvoie la page des tasks après avoir supprimé la task.
        - appel la méthode `delete` du modèle `Task` et retourne la view `pages/dashboard` si la suppression a fonctionné. Renvoie une erreur `500` dans le cas contraire.
    - POST `/tasks/toggle/:taskId` : prend l'Id d'une task et renvoie la page des tasks avec la task modifiée.
        - appel la méthode `toggle` du modèle `Task` et retourne la view `pages/dashboard` si la modification de l'état de la tâche a fonctionné. Renvoie une erreur `500` dans le cas contraire.
- Admin (nécessite d'avoir un compte admin)
    - GET `/admin` : renvoie la page admin.
        - retourne la view `pages/admin`
    - POST `/admin/toggle-admin/:userId` : prend l'Id d'un user et renvoie la page admin après avoir modifié le rôle de l'user.
        - vérifie que l'utilisateur n'essaye pas de modifier son propre role. Renvoie une erreur `403` si c'est le cas.
        Appel la méthode `toggleAdmin` du modèle `User` et retourne la view `pages/admin` si la modification du rôle de l'user a fonctionné. Renvoie une erreur `500` dans le cas contraire.
    - POST `/delete-user` : prend l'Id d'un user et renvoie la page admin après avoir supprimé l'user.
        - vérifie que l'utilisateur n'essaye pas de supprimer son propre compte. Renvoie une erreur `403` si c'est le cas.
        Appel la méthode `delete` du modèle `User` et retourne la view `pages/admin` si la suppression du compte de l'user a fonctionné. Renvoie une erreur `500` dans le cas contraire.

