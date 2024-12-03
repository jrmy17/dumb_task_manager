// @ts-nocheck

const express = require('express');
const router = express.Router();
const tasks = require('../models/task')

const authenticate = (req, res, next) => {
    if (req.query.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

router.get('/', (req, res) => {
    var userId = req.query.userId;
    tasks.getAllByUser(parseInt(userId), (err, data) => {
        res.render('dashboard', { data, userId })
    })
});

router.get('/remove', (req, res) => {
    var taskId = req.query.taskId;
    var userId = req.query.userId;
    if (userId) {
        tasks.delete(taskId, () => {
            res.redirect(`/tasks?userId=${userId}`)
        })
    }

})

router.post('/', authenticate, (req, res) => {
    const { title, description, completed } = req.body;
    let userId = req.query.userId
    tasks.create({ user_id: userId, title, description, completed: 0 }, (err, task) => {
        if (task) {
            res.redirect(`/tasks?userId=${userId}`)
        }
    })
});

router.put('/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = tasks.find((task) => task.id === parseInt(id));

    if (!task) {
        return res.status(404).send('Task not found');
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});


module.exports = router;
