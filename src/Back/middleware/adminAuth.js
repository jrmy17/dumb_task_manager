const adminAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const { User } = require("../models/user");
  User.findById(req.session.userId, (err, user) => {
    if (err || !user || !user.isadmin) {
      return res.status(403).render("pages/error", {
        message: "Accès non autorisé",
        error: { status: 403 },
        userId: req.session.userId,
        username: req.session.username,
        isAdmin: false,
      });
    }
    req.session.isAdmin = user.isadmin;
    next();
  });
};

module.exports = adminAuth;
