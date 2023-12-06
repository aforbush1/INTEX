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
        host: process.env.RDS_HOSTNAME || "awseb-e-kcv5hvwgic-stack-awsebrdsdatabase-rbjlqchlnpgp.citjsziqcj7q.us-east-1.rds.amazonaws.com",
        user: process.env.RDS_USERNAME || "ebroot",
        password: process.env.RDS_PASSWORD || "rhawk999",
        database: process.env.RDS_DB_NAME || "ebdb",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectUnauthorized:false}:false
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
    const sAdminPassword = 'Intex2023'
    
    app.post("/submitLogin", (req, res) => {
        const username = req.body.username
        const password = req.body.password
    
        if (username === sAdminUsername && password === sAdminPassword)    
            {
            res.sendFile(path.join(__dirname, "views/adminIndex.html"))
            }
    
        
        else {
            knex('loginInfo')
                .where('username', username)
                .andWhere('password', password)
                .then(result => {
                    if (result.length > 0) {
                        res.sendFile(path.join(__dirname, "views/userIndex.html"))
                    } else {
                        res.sendFile(path.join(__dirname, "views/invalidLogin.html"))
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send("Internal Server Error");
                });
        }
    });

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Use Knex to query the database for the user
    knex("loginInfo").select().where({ username, password }).first()
        .then((loginInfo) => {
            if (loginInfo) {
                // User found in the "logininfo" table, redirect to the user index page
                res.sendFile(path.join(__dirname, "views/userindex.html"));
            } else if (username === sAdminUsername && password === sAdminPassword) {
                // Admin credentials match, redirect to the admin index page
                res.sendFile(path.join(__dirname, "views/adminIndex.html"));
            } else {
                // Neither user nor admin credentials match, invalid login
                res.sendFile(path.join(__dirname, "views/invalidLogin.html"));
            }
        })
        .catch(error => {
            console.error('Error querying the database:', error);
            res.status(500).send('Internal Server Error');
        });
});

// app.post("/createUser", (req, res) => {
    // knex("loginInfo").insert({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.username, password: req.body.password}).then((theSurveys) => {
    //   res.render("viewUser", {theSurveys : loginInfo} );
    // });
// });

app.post('/createUser', (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    // Check if the username already exists
    knex('loginInfo')
        .where('username', username)
        .first()
        .then(existingUser => {
            if (existingUser) {
                // Username already exists, send an error response
                document.getElementById("invalidUserPrompt").style.display='block' ;
            }

            // Username doesn't exist, insert the new user
            return knex('loginInfo')
                    .insert({
                    firstName,
                    lastName,
                    email,
                    username,
                    password
                })
                .then(() => {
                    document.getElementById("invalidUserPrompt").style.display='none'
                    // Redirect to the "/viewUser" page upon successful data insertion
                    res.redirect('/viewUser');
                })
                .catch((error) => {
                    // Handle any errors that occurred during insertion
                    console.error('Error inserting data:', error);
                    res.status(500).send('Error inserting data');
                });
        })
        .catch((error) => {
            // Handle any errors that occurred during the username check
            console.error('Error checking username:', error);
            res.status(500).send('Error checking username');
        });
});


app.get("/viewUser", (req, res) => {
    // Retrieve the user data using Knex.js
    knex.select().from("loginInfo").then((loginInfo) => {
        res.render("viewUser", { theLogin: loginInfo }); // Pass 'theLogin' as an object property
    }).catch((error) => {
        // Handle errors if any while fetching data
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
    });
});
  

app.get("/createUser", (req, res) => {
    res.render("createUser");
})

app.get("/surveyForm", (req, res) => {
    res.render("surveyForm");
});

app.get("/adminIndex", (req, res) => {
    res.sendFile(path.join(__dirname, "views/adminIndex.html"))
})

app.get("/viewData", (req, res) => {
    knex.select().from("plainsville").then( (plainsville) => {
        res.render("viewData", {theSurveys : plainsville});
    });
});

app.get("/editUsers/:username", (req, res) => {
    knex.select("firstName", "lastName", "email", "username", "password")
    .from("loginInfo")
    .where("username", req.params.username)
    .then(loginInfo => {
        res.render("editUsers", {theLogin: loginInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
})


app.post("/editUsers", (req, res) => {
    knex("loginInfo").where("username", parseInt(req.body.username)).update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).then(theLogin => {
        res.redirect("/displayUsers");
    });
});

app.post("/deleteUser/:username", (req, res) => {
    knex("loginInfo").where("username", req.params.username).del().then(theLogin => {
        res.redirect("/viewUser");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/dashboard", (req, res) =>
    res.send("<div class='tableauPlaceholder' id='viz1701795084373' style='position: relative'><noscript><a href='#'><img alt='Dashboard 1 ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_17011425626370&#47;Dashboard1&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='Book1_17011425626370&#47;Dashboard1' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_17011425626370&#47;Dashboard1&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1701795084373');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1366px';vizElement.style.height='795px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1366px';vizElement.style.height='795px';} else { vizElement.style.width='100%';vizElement.style.height='1127px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>"));

app.listen(port, () => console.log("Server is listening"));