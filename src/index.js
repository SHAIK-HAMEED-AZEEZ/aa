const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");
console.log(publicPath);

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

app.get("/signup", (req, res) => {
  res.render("signup", { message: "" });
});

app.get("/", (req, res) => {
  res.render("login", { message: "" });
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/signup", async (req, res) => {
  try {
    const existingUser = await LogInCollection.findOne({ name: req.body.name });

    if (existingUser) {
      res.render("signup", { message: "User details already exist" });
    } else {
      const data = new LogInCollection({
        name: req.body.name,
        password: req.body.password,
      });

      await data.save();

      res.render("login", { message: "Sign-up successful, please log in." });
    }
  } catch (error) {
    res.render("signup", { message: "An error occurred. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await LogInCollection.findOne({ name: req.body.name });

    if (check && check.password === req.body.password) {
      res.status(201).render("home", { naming: req.body.name });
    } else {
      res.render("login", { message: "Wrong password. Please try again." });
    }
  } catch (e) {
    res.render("login", { message: "User not found. Please sign up." });
  }
});

app.listen(port, () => {
  console.log("Port connected");
});
