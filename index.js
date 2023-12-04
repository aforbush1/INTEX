// Author: Adam Forbush, Josh Thatcher, Chris Fowler, Ryan Hawkins
// Description: Index.js File

const express = require ("express");
let app = express();
let path = require("path");
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:true}));

// const knex = require("knex")({
//     client: "pg",
//     connection: {
//     host: process.env.RDS_HOSTNAME || "localhost",
//     user: process.env.RDS_USERNAME || "postgres",
//     password: process.env.RDS_PASSWORD || "",
//     database: process.env.RDS_DB_NAME || "",
//     port: process.env.RDS_PORT || 5432
//     }
// });

// app.get("/", (req, res) => { 
// //   knex.select().from("country").then((country) => {
// //     res.render("displayCountry", { mycountry: country });
// //   });
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"))
})

app.listen(port, () => console.log("Server is listening"));