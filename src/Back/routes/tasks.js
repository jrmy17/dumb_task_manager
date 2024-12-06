// @ts-nocheck

const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const { User } = require("../models/user");
const authenticate = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

router.get("/", authenticate, (req, res) => {
  Task.getAllByUser(req.session.userId, (err, data) => {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des tâches");
    }

    User.findById(req.session.userId, (err, user) => {
      if (err) {
        return res
          .status(500)
          .send("Erreur lors de la récupération de l'utilisateur");
      }
      res.render("pages/dashboard", {
        data: data || [],
        userId: req.session.userId,
        username: user.username,
        isAdmin: user.isadmin,
      });
    });
  });
});

router.get("/remove/:taskId", authenticate, (req, res) => {
  const taskId = req.params.taskId;

  Task.delete(taskId, req.session.userId, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect("/tasks");
  });
});

router.post("/", authenticate, (req, res) => {
  const { title, description, completion } = req.body;

  Task.create(
    {
      user_id: req.session.userId,
      title,
      description,
      completed: completion,
    },
    (err, task) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.redirect("/tasks");
    }
  );
});

router.post("/toggle/:taskId", authenticate, (req, res) => {
  const taskId = req.params.taskId;

  Task.toggle(taskId, req.session.userId, (err, task) => {
    if (err) {
      console.error("Erreur toggle:", err);
      return res.status(500).send(err.message);
    }
    res.redirect("/tasks");
  });
});

module.exports = router;
