const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId || !req.session.isAdmin) {
    return res.redirect("/");
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
