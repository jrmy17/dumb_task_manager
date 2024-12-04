// @ts-nocheck

const express = require("express");
const router = express.Router();
const tasks = require("../models/task");

const authenticate = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

router.get("/", (req, res) => {
  const userId = req.session.userId;
  tasks.getAllByUser(parseInt(userId), (err, data) => {
    res.render("pages/dashboard", { data, userId });
  });
});

router.post("/remove", (req, res) => {
  const { taskId } = req.body;
  const task = tasks.getById(taskId);
  if(!task){
    res.status(400);
    res.render("pages/dashboard", { data, userId, error: "La task à supprimer n'existe pas."});
    return;
  }
  const userId = req.session.userId;
  if (userId == task.userId) {
    tasks.delete(taskId, (err, taskId) => {
      if(err){
        res.status(500);
        res.render("pages/dashboard", { data, userId, error: err})
        return
      }
      res.render("pages/dashboard", { data, userId, success: `La task d'id ${taskId} a bien été supprimée.`});
    });
  }
});

router.post("/", authenticate, (req, res) => {
  const { title, description, completion } = req.body;
  let userId = req.query.userId;
  tasks.create(
    {
      user_id: userId,
      title,
      description,
      completed: completion,
    },
    (err, task) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (task) {
        res.redirect(`/tasks?userId=${userId}`);
      }
    }
  );
});

router.put("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const task = tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    return res.status(404).send("Task not found");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

router.post("/toggle/:id", authenticate, (req, res) => {
  const taskId = req.params.id;
  const userId = req.query.userId;
  const completed = req.body.completed === "true";

  tasks.toggleComplete(taskId, completed, (err, task) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect(`/tasks?userId=${userId}`);
  });
});

module.exports = router;
