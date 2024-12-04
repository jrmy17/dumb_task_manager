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
router.post("/user/register", (req, res) => {
  const { username, password, email, confirmPassword, gdpr } = req.body;
  if( username == "" ){
    console.log("username")
    res.status(400);
    res.render("pages/register", { err : "L'username ne peut pas être vide."})
    return;
  }
  if( password == "" || password.length < 12 || !RegExp("/[a-z]+/").test(password) || !RegExp("/[A-Z]+/").test(password) || !RegExp("/[0-9]+/").test(password) || !RegExp("/[&#'{(\[\-|_\\^@)\]$%!?.)}]+/").test(password) ){
    console.log("password", password, password == "", password.length < 12, !RegExp("/[a-z]/").test(password), !RegExp("/[A-Z]/").test(password), !RegExp("/[0-9]/").test(password), !RegExp("/[&#'{(\[\-|_\\^@)\]$%!?.}]/").test(password))
    res.status(400);
    res.render("pages/register", { err : "Vérifier votre mot de passe"})
    return;
  }
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
