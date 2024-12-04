const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

// Placeholder routes for authentication
router.get("/login", (req, res) => res.render("pages/login"));
router.post("/login", (req, res) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      return res.redirect("/login?error=" + encodeURIComponent(err.message));
    }
    if (user && user.connected) {
      req.session.userId = user.id;
      return res.redirect("/?userId=" + user.id);
    }
    res.redirect("/login");
  });
});
router.get("/user/register", (req, res) => {
  let username = req.query.username;
  var password = req.query.password;
  let email = req.query.email;
  User.create({ username, password, email }, (err, user) => {
    if (user && user.id) {
      res.redirect("/login");
    } else {
      res.redirect(
        "/register?error=" +
          encodeURIComponent(
            err?.message || "Erreur lors de la création du compte"
          )
      );
    }
  });
});
router.get("/register", (req, res) => res.render("pages/register"));

module.exports = router;
