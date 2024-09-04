const express = require("express");
const path = require("path");
const app = express();
// const hbs = require("hbs");
const LogInCollection = require("./mongo");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, "../tempelates");
const publicPath = path.join(__dirname, "../public");
console.log(publicPath);

app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.static(publicPath));

// hbs.registerPartials(partialPath);

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/signup", async (req, res) => {
  try {
    const existingUser = await LogInCollection.findOne({ name: req.body.name });

    if (existingUser) {
      res.send("User details already exist");
    } else {
      const data = new LogInCollection({
        name: req.body.name,
        password: req.body.password,
      });

      await data.save();

      res.status(201).render("home", {
        naming: req.body.name,
      });
    }
  } catch (error) {
    res.send("Wrong inputs");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await LogInCollection.findOne({ name: req.body.name });

    if (check && check.password === req.body.password) {
      res.status(201).render("home", { naming: req.body.name });
    } else {
      res.send("Incorrect password");
    }
  } catch (e) {
    res.send("Wrong details");
  }
});

app.listen(port, () => {
  console.log("Port connected");
});
