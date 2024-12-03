const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite
const db = new sqlite3.Database(path.join(__dirname, '../config/tasks.sqlite'), (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connexion à la base de données SQLite réussie.');
    }
});

// Modèle Task avec des fonctions pour interagir avec la base de données
const Task = {
    // Récupérer toutes les tâches d'un utilisateur
    getAllByUser: (userId, callback) => {
        const query = 'SELECT * FROM tasks WHERE user_id = ?';
        db.all(query, [userId], (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération des tâches:', err.message);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },

    create: (t, c) => {
        const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (\'' + t.title + '\',\' ' + t.description + '\', ' + t.completed + ', ' + t.user_id + ' )';
        console.log(query)
        db.run(query, [], function (err) {
            c(null, { id: this.lastID });
        });
    },

    update: (id, updates, callback) => {
        const query = `
            UPDATE tasks
            SET title = ?, description = ?, completed = ?
            WHERE id = ?
        `;
        const params = [updates.title, updates.description, updates.completed, id];
        db.run(query, params, function (err) {
            callback(null, { id, ...updates });
        });
    },

    // Supprimer une tâche
    delete: (id, callback) => {
        const query = 'DELETE FROM tasks WHERE id = ?';
        db.run(query, [id], function (err) {
            if (err) {
                console.error('Erreur lors de la suppression de la tâche:', err.message);
                callback(err, null);
            } else if (this.changes === 0) {
                callback(new Error('Tâche non trouvée'), null);
            } else {
                callback(null, { id });
            }
        });
    }
};

module.exports = Task;
