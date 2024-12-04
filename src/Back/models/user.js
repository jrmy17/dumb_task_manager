bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const pool = new Pool();

pool.query(`CREATE TABLE IF NOT EXISTS users (
  id        integer GENERATED ALWAYS AS IDENTITY UNIQUE,
  username  varchar(40) NOT NULL,
  password  varchar(255) NOT NULL,
  email     varchar(64) NOT NULL,
  createdAt timestamp NOT NULL,
  isAdmin   boolean NOT NULL
)`)

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
      if (bcrypt.compareSync(password, user?.password)) {
        user.connected = true;
        return callback(user.id);
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

module.exports = User;