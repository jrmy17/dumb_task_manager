const { Pool } = require("pg");
const pool = new Pool();

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
  delete: (taskId, userId, callback) => {
    const query = "DELETE FROM tasks WHERE id = $1 AND userId = $2";
    pool.query(query, [taskId, userId], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.rowCount === 0) {
        return callback(new Error("Tâche non trouvée ou non autorisée"));
      }
      callback(null, { id: taskId });
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

  toggle: (taskId, userId, callback) => {
    const query = `
      UPDATE tasks 
      SET completed = NOT completed,
          completedAt = CASE 
            WHEN NOT completed THEN NOW() 
            ELSE NULL 
          END
      WHERE id = $1 AND userId = $2
      RETURNING *`;

    pool.query(query, [taskId, userId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.rows[0]);
    });
  },
};

module.exports = Task;
