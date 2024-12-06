const { Pool } = require("pg");
const pool = new Pool();
const dotenv = require("dotenv").config();

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  username  varchar(40) NOT NULL UNIQUE,
  password  varchar(255) NOT NULL,
  email     varchar(64) NOT NULL UNIQUE,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isAdmin   boolean NOT NULL DEFAULT false
)`;

const createSessionTableQuery = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
)`;

const createUsersTable = pool
  .query(createTableQuery)
  .then(() => {
    console.log("Table users créée avec succès");
    return pool.query(createSessionTableQuery);
  })
  .then(() => {
    console.log("Table session créée avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de la création des tables:", err);
    throw err;
  });

  // Attendre que la table users soit créée avant de créer la table tasks
createUsersTable.then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       varchar(64) NOT NULL,
      description varchar(255) NOT NULL,
      completed   boolean NOT NULL DEFAULT false,
      createdAt   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completedAt timestamp,
      userId      integer NOT NULL,
      CONSTRAINT fk_user FOREIGN KEY(userId) REFERENCES users(id)
    )`
      )
      .then(() => {
        console.log("Table tasks créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table tasks:", err);
      });
  });