const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const pgSession = require("connect-pg-simple")(session);
const { pool } = require("./Back/models/user");

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    },
  })
);
app.use(express.static(path.join(__dirname, "Front/public")));
app.use(expressLayouts);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Front/views"));
app.set("layout", "index");

// Routes
const authRoutes = require("./Back/routes/auth");
const taskRoutes = require("./Back/routes/tasks");
const adminRoutes = require("./Back/routes/admin");

app.get("/", (req, res) => {
  if (req.session.userId) {
    const { User } = require("./Back/models/user");
    User.findById(req.session.userId, (err, user) => {
      if (err) {
        return res.render("pages/home", { userId: req.session.userId });
      }
      res.render("pages/home", {
        userId: req.session.userId,
        username: user.username,
        isAdmin: user.isadmin,
      });
    });
  } else {
    res.render("pages/home", { userId: null });
  }
});
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
