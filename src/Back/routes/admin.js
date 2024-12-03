const express = require("express");
const router = express.Router();
const users = require("../models/user");

router.get("/", (req, res) => {
  users.getAll((users) => {
    res.render("pages/admin", { users });
  });
});

module.exports = router;
