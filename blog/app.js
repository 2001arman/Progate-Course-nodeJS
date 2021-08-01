const express = require("express");
const mysql = require("mysql");
const app = express();
const session = require("express-session");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blog",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// membaca dan menggunakan session
app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// mengecek apakah user login atau tidak
app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.username = "Tamu";
    res.locals.isLogin = false;
  } else {
    const username = req.session.username;
    res.locals.username = username;
    res.locals.isLogin = true;
  }
  next();
});

// Ini adalah path route untuk halaman Teratas
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get("/", (req, res) => {
  res.render("top.ejs");
});

// Ini adalah path route untuk halaman Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get("/list", (req, res) => {
  connection.query("SELECT * FROM articles", (error, results) => {
    // Pastikan data dan nama property diberikan pada file EJS
    res.render("list.ejs", { articles: results });
  });
});

// Ini adalah path route untuk halaman Detail Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get("/article/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM articles WHERE id = ?",
    [id],
    (error, results) => {
      // Pastikan data dan nama property diberikan pada file EJS
      res.render("article.ejs", { article: results[0] });
    }
  );
});

// login page menggunakan get
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// proses login
app.post("/login", (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        if (results.length > 0) {
          if (req.body.password === results[0].password) {
            console.log("berhasil login");
            req.session.userId = results[0].id;
            req.session.username = results[0].username;
            res.redirect("/list");
          } else {
            console.log("Password Salah");
            res.redirect("/login");
          }
        } else {
          console.log("login gagal");
          res.redirect("/login");
        }
      }
    }
  );
});

// proses logout
app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/list");
    console.log("berhasil logout");
  });
});

app.listen(3000);
console.log("server running on localhost:3000");
