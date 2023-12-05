// Author: Adam Forbush, Josh Thatcher, Chris Fowler, Ryan Hawkins
// Description: Index.js File

const express = require("express");
let app = express();
let path = require("path");
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.USER_NAME || "postgres",
        password: process.env.RDS_PASSWORD || "***",
        database: process.env.RDS_DB_NAME || "surveryData",
        port: process.env.RDS_PORT || 5432,
        // ssl: process.env.DB_SSL ? {rejectUnauthorized:false}:false
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get("/login", (req, res) => {
    res.render("login");
})



app.post("/submitSurvey", (req, res) =>
    res.send("Yo Dawg it Be Workin"))

const sAdminUsername = 'Admin'
const sAdminPassword = 'Password'

app.post("/submitLogin", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username === sAdminUsername && password === sAdminPassword) {
        res.sendFile(path.join(__dirname, "views/adminIndex.html"))
    } else
        (
            res.send('Invalid Credentials, Please Try Again')
        )
});

app.get("/createAccount", (req, res) => {
    res.render("createAccount");
})

app.get("/surveyForm", (req, res) => {
    res.render("surveyForm");
});

app.get("/adminIndex", (req, res) => {
    res.sendFile(path.join(__dirname, "views/adminIndex.html"))
})

app.get("/adminViewData", (req, res) =>
    res.send("yo Dawg we need to connect this to our database"))

app.get("/dashboard", (req, res) =>
    res.send("yo Dawg we need to connect this to our database"));

app.listen(port, () => console.log("Server is listening"));