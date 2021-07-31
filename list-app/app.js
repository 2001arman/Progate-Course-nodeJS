// import express
const express = require("express");
const app = express();
// import mysql paket
const mysql = require("mysql");

app.use(express.static("public"));
// konfigurasi untuk mengakses nilai formulir atau inpuran
app.use(express.urlencoded({ extended: false }));

// halaman utama akan diarahkan ke top.ejs
app.get("/", (req, res) => {
  res.render("top.ejs");
});

// menyambungkan ke mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "list_app",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Tambahkan route untuk halaman index
app.get("/index", (req, res) => {
  // menjalankan query mysql
  connection.query("SELECT * FROM items", (error, results) => {
    // console.log(results);
    res.render("index.ejs", { items: results });
  });
});

// mengarahkan route ke halaman tambah data
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// menambahkan data baru menggunakan post
app.post("/create", (req, res) => {
  // menambahkan item
  connection.query(
    "INSERT INTO items(name) VALUES(?)",
    [req.body.itemName],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

// menghapus data
app.post("/delete/:id", (req, res) => {
  // console.log("id :");
  connection.query(
    "DELETE FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

// perbarui data
// mengambil data dahulu
app.get("/edit/:id", (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE id=?",
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render("edit.ejs", { item: results[0] });
    }
  );
});

// mengupdate data
app.post("/update/:id", (req, res) => {
  connection.query(
    "UPDATE items SET name=? WHERE id=?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );

  
});

app.listen(3000);

console.log("server running on http://localhost:3000");
