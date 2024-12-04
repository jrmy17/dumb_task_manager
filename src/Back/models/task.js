const { Pool } = require("pg");
const { createUsersTable } = require("./user");
const pool = new Pool();

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

// Modèle Task avec des fonctions pour interagir avec la base de données
const Task = {
  // Récupérer toutes les tâches d'un utilisateur
  getAllByUser: (userId, callback) => {
    const query = "SELECT * FROM tasks WHERE userId = $1";
    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des tâches:",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  create: (task, callback) => {
    const query =
      "INSERT INTO tasks (title, description, completed, completedAt, userId, createdAt) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *";
    const completed = task.completed === "on" ? true : false;
    const completedAt = completed ? new Date() : null;
    pool.query(
      query,
      [task.title, task.description, completed, completedAt, task.user_id],
      function (err, result) {
        if (err) {
          return callback(err, null);
        }
        callback(null, result.rows[0]);
      }
    );
  },

  update: (id, updates, callback) => {
    const query = `
            UPDATE tasks
            SET title = $1, description = $2, completed = $3
            WHERE id = $4
        `;
    const params = [updates.title, updates.description, updates.completed, id];
    pool.query(query, params, function (err, task) {
      callback(null, task.rows[0]);
    });
  },

  // Supprimer une tâche
  delete: (id, callback) => {
    const query = "DELETE FROM tasks WHERE id = $1";
    pool.query(query, [id], function (err) {
      if (err) {
        console.error(
          "Erreur lors de la suppression de la tâche:",
          err.message
        );
        callback(err, null);
      } else if (this.changes === 0) {
        callback(new Error("Tâche non trouvée"), null);
      } else {
        callback(null, { id });
      }
    });
  },

  toggleComplete: (taskId, completed, callback) => {
    const query = `
      UPDATE tasks 
      SET completed = $1, 
          completedAt = $2
      WHERE id = $3 
      RETURNING *`;
    const completedAt = completed ? new Date() : null;
    pool.query(query, [completed, completedAt, taskId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows[0]);
    });
  },
};

module.exports = Task;
