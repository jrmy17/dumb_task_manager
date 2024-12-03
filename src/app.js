const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv").config()

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "taskmanager_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "Front/public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Front/views"));

// Routes
const authRoutes = require("./Back/routes/auth");
const taskRoutes = require("./Back/routes/tasks");
const adminRoutes = require("./Back/routes/admin");

app.get("/", (req, res) => {
  console.log(req.query);
  var userId = req.query.userId;
  res.render("index", { userId: userId });
});
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
