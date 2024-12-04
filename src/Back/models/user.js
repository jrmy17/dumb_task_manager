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

const createUsersTable = pool
  .query(createTableQuery)
  .then(() => {
    console.log("Table users créée avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table users:", err);
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
    pool.query("SELECT * FROM users", [], (err, results) => {
      callback(results.rows);
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
    const query = "SELECT * FROM users WHERE id = $1";
    pool.query(query, [id], (err, user) => {
      return user;
    });
  },
};

module.exports = { User, createUsersTable };
