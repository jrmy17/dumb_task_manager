const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../../Data/config/tasks.sqlite"),
  (err) => {}
);

const User = {
  create: (user, callback) => {
    const query =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const params = [user.username, user.password, user.email];
    db.run(query, params, function (err) {
      callback(null, { id: this.lastID, ...user });
    });
  },

  getAll: (callback) => {
    db.all("SELECT * FROM users", [], (err, results) => {
      callback(results);
    });
  },

  findByUsername: (username, callback) => {
    console.log(username);
    const query = "SELECT * FROM users WHERE username = ?";
    db.get(query, [username], (err, user) => {
      callback(err, user);
    });
  },

  authenticate: (username, password, callback) => {
    User.findByUsername(username, (err, user) => {
      console.log({ user, password });
      if (user.password == password) {
        user.connected = true;
        return callback(user);
      }
    });
  },

  // Récupération d'un utilisateur par ID
  findById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = " + id;
    db.get(query, [], (err, user) => {
      return user;
    });
  },
};

module.exports = User;
