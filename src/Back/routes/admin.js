const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const adminAuth = require("../middleware/adminAuth");

router.use(adminAuth);

router.get("/", (req, res) => {
  User.findById(req.session.userId, (err, currentUser) => {
    if (err) {
      return res
        .status(500)
        .send("Erreur lors de la récupération de l'utilisateur");
    }

    User.getAll((err, users) => {
      if (err) {
        return res
          .status(500)
          .send("Erreur lors de la récupération des utilisateurs");
      }
      res.render("pages/admin", {
        users,
        userId: req.session.userId,
        username: currentUser.username,
        isAdmin: req.session.isAdmin,
      });
    });
  });
});

router.post("/toggle-admin/:userId", adminAuth, (req, res) => {
  const targetUserId = req.params.userId;
  const isAdmin = req.body.isAdmin === "on";

  if (targetUserId === req.session.userId.toString()) {
    return res
      .status(403)
      .send("Vous ne pouvez pas modifier vos propres droits d'administrateur");
  }

  User.toggleAdmin(targetUserId, isAdmin, (err) => {
    if (err) {
      return res
        .status(500)
        .send("Erreur lors de la modification du statut admin");
    }
    res.redirect("/admin");
  });
});

router.post("/delete-user", adminAuth, (req, res) => {
  const targetUserId = req.query.idToDelete;

  if (targetUserId === req.session.userId.toString()) {
    return res
      .status(403)
      .send("Vous ne pouvez pas supprimer votre propre compte");
  }

  User.delete(targetUserId, (err) => {
    if (err) {
      return res
        .status(500)
        .send("Erreur lors de la suppression de l'utilisateur");
    }
    res.redirect("/admin");
  });
});

module.exports = router;
