const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

// Placeholder routes for authentication
router.post("/login", (req, res) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      return res.json({
        err: err.message,
      });
    }
    if (user && user.connected) {
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      return res.json({
        user: {
          isAdmin : user.isadmin,
          username : user.username
        },
      });
    }
    return res.json({
      err: 'Erreur lors de la connexion',
    });
  });
});
router.post("/register", (req, res) => {
  const { username, password, email, confirmPassword, gdpr } = req.body;

  // Vérification username
  if (!username || username.trim() === "") {
    return res.render("pages/register", {
      err: "L'username ne peut pas être vide.",
    });
  }

  // Vérification mot de passe
  const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[&#'{(\[\-|_\\^@)\]$%!?.)}]/,
  };

  if (
    !password ||
    password.length < 12 ||
    !passwordRegex.lowercase.test(password) ||
    !passwordRegex.uppercase.test(password) ||
    !passwordRegex.number.test(password) ||
    !passwordRegex.special.test(password)
  ) {
    return res.render("pages/register", {
      err: "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
    });
  }

  // Vérification confirmation mot de passe
  if (password !== confirmPassword) {
    return res.render("pages/register", {
      err: "Les mots de passe ne correspondent pas",
    });
  }

  // Vérification email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.render("pages/register", {
      err: "Email invalide",
    });
  }

  // Vérification GDPR
  if (!gdpr) {
    return res.render("pages/register", {
      err: "Vous devez accepter les conditions d'utilisation",
    });
  }

  User.create({ username, password, email }, (err, user) => {
    if (err) {
      // Si l'erreur concerne un doublon (email ou username déjà utilisé)
      if (err.code === "23505") {
        return res.render("pages/register", {
          err: "Cet email ou nom d'utilisateur est déjà utilisé",
        });
      }
      return res.render("pages/register", {
        err: "Erreur lors de la création du compte",
      });
    }
    if (user && user.id) {
      return res.redirect("/login");
    }
    res.render("pages/register", {
      err: "Erreur lors de la création du compte",
    });
  });
});
router.get("/register", (req, res) => res.render("pages/register"));
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
