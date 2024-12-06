bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const pool = new Pool();

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

const User = {
  create: (user, callback) => {
    const query =
      "INSERT INTO users (username, password, email, isAdmin, createdAt) VALUES ($1, $2, $3, false, NOW()) RETURNING id";
    const hash = bcrypt.hashSync(user.password, 8);
    const params = [user.username, hash, user.email];
    pool.query(query, params, function (err, user) {
      callback(err, user.rows[0]);
    });
  },

  getAll: (callback) => {
    const query = "SELECT id, username, isadmin FROM users ORDER BY id";
    pool.query(query, [], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows);
    });
  },

  findByUsername: (username, callback) => {
    console.log(username);
    const query = "SELECT * FROM users WHERE username = $1";
    pool.query(query, [username], (err, user) => {
      callback(err, user.rows[0]);
    });
  },

  authenticate: (username, password, callback) => {
    User.findByUsername(username, (err, user) => {
      if (err) {
        return callback(err, null);
      }
      if (!user) {
        return callback(new Error("Utilisateur non trouvé"), null);
      }
      if (bcrypt.compareSync(password, user.password)) {
        user.connected = true;
        return callback(null, user);
      } else {
        return callback(new Error("Mot de passe incorrect"), null);
      }
    });
  },

  // Récupération d'un utilisateur par ID
  findById: (id, callback) => {
    const query = "SELECT id, username, isadmin FROM users WHERE id = $1";
    pool.query(query, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows[0]);
    });
  },

  toggleAdmin: (userId, isAdmin, callback) => {
    const query = "UPDATE users SET isadmin = $1 WHERE id = $2";
    pool.query(query, [isAdmin, userId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  },

  delete: (userId, callback) => {
    const query = "DELETE FROM users WHERE id = $1";
    pool.query(query, [userId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  },
};

module.exports = {
  User,
  pool,
  createUsersTable,
};
