// import express
const express = require("express");
const app = express();
// import mysql paket
const mysql = require("mysql");

app.use(express.static("public"));
// konfigurasi untuk mengakses nilai formulir atau inpuran
app.use(express.urlencoded({extended: false}));

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
    console.log(results);
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
  connection.query('INSERT INTO items(name) VALUES(?)',[req.body.itemName], 
  (error, results) =>{
    connection.query('SELECT * FROM items', (error, results) => {
      res.render('index.ejs', {items: results});
    });
  });

  // menampilkan item
  // connection.query("SELECT * FROM items", (error, result) => {
  //   res.render("index.ejs", { items: result });
  // });
});

app.listen(3000);

console.log("server running on http://localhost:3000");
