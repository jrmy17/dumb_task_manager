const { Pool } = require('pg');
const pool = new Pool();

pool.query(`CREATE TABLE IF NOT EXISTS tasks (
  id          integer GENERATED ALWAYS AS IDENTITY ,
  title       varchar(64) NOT NULL,
  description varchar(255) NOT NULL,
  completed   boolean NOT NULL,
  createdAt   timestamp NOT NULL,
  completedAt timestamp ,
  userId      integer NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY(userId) REFERENCES users(id)
)`)

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
      "INSERT INTO tasks (title, description, completed, userId, createdAt) VALUES ($1, $2, $3, $4, NOW()) RETURNING *";
    pool.query(query, [task.title, task.description, task.completed, task.user_id], function (err, result) {
      callback(null, result.rows[0]);
    });
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
};

module.exports = Task;
