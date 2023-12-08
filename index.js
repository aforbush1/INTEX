// Author: Adam Forbush, Josh Thatcher, Chris Fowler, Ryan Hawkins
// Description: Index.js File, Defines our routes

//Configurations, objects, etc. Defines our database information as well to connect to RDS
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


//Default route to access our landing page (index.ejs)
app.get("/", (req, res) => {
    res.render("index");
})

// app.use((req, res) => {
//     res.status(404).render('error');
// });


//Route that renders our survey sheet where a person can fill out the survey
app.get("/surveyForm", (req, res) => {
    res.render("surveyForm");
});


//This route submits the survey and adds it to our database
app.post("/submitSurvey", (req, res) => {
    console.log(req.body);

    //Defines constants for our affiliations and our platforms. They end up testing whether or not the submitted data contains a certain string.
    const occupation = req.body.affiliatedOrganizations || [];
    const isCompanySelected = occupation.includes("Company")
    const isPrivateSelected = occupation.includes("Private")
    const isGovernmentSelected = occupation.includes("Government")
    const isSchoolSelected = occupation.includes("School")
    const isUniversitySelected = occupation.includes("University")
    const isNoneSelected = occupation.includes("None")

    const socialMediaPlatforms = req.body.socialMedia || [];
    const isFacebookSelected = socialMediaPlatforms.includes("Facebook");
    const isTwitterSelected = socialMediaPlatforms.includes("Twitter");
    const isInstagramSelected = socialMediaPlatforms.includes("Instagram");
    const isYoutubeSelected = socialMediaPlatforms.includes("Youtube");
    const isDiscordSelected = socialMediaPlatforms.includes("Discord");
    const isRedditSelected = socialMediaPlatforms.includes("Reddit");
    const isPinterestSelected = socialMediaPlatforms.includes("Pinterest");
    const isTikTokSelected = socialMediaPlatforms.includes("TikTok");
    const isSnapchatSelected = socialMediaPlatforms.includes("Snapchat");
    const isOther_PlatformSelected = socialMediaPlatforms.includes("Other");

    //Creates a time object and formats date and time to match our database
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    //Inserts all the submitted data into our database with a default location value of Provo.
    knex("plainsville").insert({Date: formattedDate, Time: formattedTime, Age: req.body.age, Gender: req.body.gender, 
            Relationship_Status: req.body.relationshipStatus, Occupation_Status: req.body.occupationStatus, 
            Affiliation_Company: isCompanySelected ? "Yes" : "No", Affiliation_Private: isPrivateSelected ? "Yes" : "No",
            Affiliation_Government: isGovernmentSelected ? "Yes" : "No", Affiliation_School: isSchoolSelected ? "Yes" : "No",
            Affiliation_University: isUniversitySelected ? "Yes" : "No", Affiliation_None: isNoneSelected ? "Yes" : "No", Social_Media: req.body.useSocialMedia, 
            Facebook: isFacebookSelected ? "Yes" : "No", Twitter: isTwitterSelected ? "Yes" : "No",
            Instagram: isInstagramSelected ? "Yes" : "No", Youtube: isYoutubeSelected ? "Yes" : "No",
            Discord: isDiscordSelected ? "Yes" : "No", Reddit: isRedditSelected ? "Yes" : "No", Pinterest: isPinterestSelected ? "Yes" : "No",
            TikTok: isTikTokSelected ? "Yes" : "No",
            Snapchat: isSnapchatSelected ? "Yes" : "No", Other_Platform: isOther_PlatformSelected ? "Yes" : "No", 
            Average_Daily_Social_Media_Use_Hours: req.body.averageTimeOnSocialMedia, Non_Specific_Use_Rating: req.body.socialMediaWithoutPurpose, 
            Social_Media_Distraction_Rating: req.body.distractedBySocialMedia, Restlessness_Rating: req.body.restlessWithoutSocialMedia, 
            Distractedness_Rating: req.body.easilyDistracted, Worries_Rating: req.body.botheredByWorries, 
            Concentration_Difficulty_Rating: req.body.difficultToConcentrate, Comparison_Rating: req.body.compareToOthersOnSocialMedia, 
            Followup_Comparison_Rating: req.body.followupCompare, Seek_Validation_Rating: req.body.seekValidationOnSocialMedia, 
            Depression_Rating: req.body.feelingsOfDepression, Interest_Fluctuation_Rating: req.body.fluctuationInInterest, 
            Sleep_Issue_Rating: req.body.sleepIssues, Location: "Provo"})

        //Renders the Thank You page where they will then be redirected back to the landing page
        .then(() => {
            res.render("thankYou");
        })
        .catch(err => {
            // Handle error
            console.error("Error inserting survey:", err);
            // Send an error response or redirect to an error page
            res.status(500).send("Error submitting survey");
        });
});


//Renders the login page
app.get("/login", (req, res) => {
    res.render("login");
})
    

//Submits the login form with a username and password
app.post("/submitLogin", (req, res) => {

    //Sets the admin username and password and compares it to the username and password entered in the form
    const sAdminUsername = 'Admin'
    const sAdminPassword = 'Intex2023'
    const username = req.body.username
    const password = req.body.password

    //If they enter the admin username and password, it will render the admin index page
    if (username === sAdminUsername && password === sAdminPassword)    
        {
        res.render("adminIndex");
        }
    //Otherwise, it will search our login information database 
    else {
        knex('loginInfo')
            .where('username', username)
            .andWhere('password', password)
            .select('firstName', 'id')
            .first()
            .then(result => {

                //If the username and password match the values of a row in the database, it will render the user index page and pass that user's id into the user index page
                if (result) {
                    const firstName = result.firstName;
                    const id = result.id;
                    res.render('userIndex', { firstName, id });

                //Otherwise if no match is found it redirects you to an invalid login page
                } else {
                    // res.render("invalidLogin");
                    res.render("invalidLogin");
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Internal Server Error");
            });
    }
    });

    app.get("/userIndex/:id", (req, res) => {
        const id = req.params.id;
        knex('loginInfo')
            .where('id', id)
            .select('firstName', 'id')
            .then(result => {
                const firstName = result[0].firstName; // Assuming you only expect one result
                res.render("userIndex", { firstName, id: id });
            })
            .catch(error => {
                console.error(error);
                // Handle errors here
                res.status(500).send('Internal Server Error');
            });
    });
    

//Renders the create user page (Only accessible from the admin index page)
app.get("/createUser", (req, res) => {
    res.render("createUser");
})


//Submits a form containing information for a new account with a unique username
app.post('/createUser', (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    // Check if the username already exists
    knex('loginInfo')
        .where('username', username)
        .first()
        .then(existingUser => {
            if (existingUser) {
                res.render('usernameTaken',{username});
            } else {
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
                        // Redirect to the "/viewUser" page upon successful data insertion
                        res.redirect('/viewUser');
                    })
                    .catch((error) => {
                        // Handle any errors that occurred during insertion
                        console.error('Error inserting data:', error);
                        res.status(500).send('Error inserting data');
                    });
            }
        })
        .catch((error) => {
            // Handle any errors that occurred during the username check
            console.error('Error checking username:', error);
            res.status(500).send('Error checking username');
        });
});


//Retrieves the user information table from the database
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


//Renders the adminIndex page
app.get("/adminIndex", (req, res) => {
    res.render("adminIndex");
})


//Retrieves the view data page that shows all data from plainsville and provo (even though it is called plainsville it contains all our data)
app.get("/viewData/:id", (req, res) => {
    const userId = req.params.id;
    knex.select().from("plainsville").then( (plainsville) => {
        res.render("viewData", {theSurveys : plainsville,userID:userId});
    });
});

app.get("/viewUserData/:id", (req, res) => {
    const id = req.params.id;
    knex.select().from("plainsville").then( (plainsville) => {
        res.render("viewUserData", {theSurveys : plainsville,id:id});
    });
});


//Submits the filter forms to bring up a particular user
app.post("/filterData", (req, res) => {
    const selectedCity = req.body.filterCity;
    const selectedRecordId = req.body.findRecord;

    // Initialize the query with the target table
    let query = knex('plainsville');

    // If a specific city is selected, add it to the query
    if (selectedCity && selectedCity !== "Both") {
        query = query.where('Location', selectedCity);
    }

    // If a specific record ID is provided (and not "All Records"), add a WHERE clause
    if (selectedRecordId && selectedRecordId !== "default") {
        query = query.where({ id: selectedRecordId });
    }

    console.log("SQL Query:", query.toString());
    
    // Execute the query
    query
        .then((filteredRecords) => {
            console.log("Filtered Records:", filteredRecords);
            res.render("filterData", { theSurveys: filteredRecords });
        })
        .catch((error) => {
            console.error("Error querying the database:", error);
            res.status(500).json({ error: "Error fetching filtered record", details: error.message });
        });
});


//Passes the city as a parameter and fetches the record requested
app.get("/getRecords/:city", (req, res) => {
    const selectedCity = req.params.city;
    res.setHeader('Cache-Control', 'no-store');

    // Execute the query to fetch records from the "plainsville" table
    knex('plainsville')
        .where('Location', selectedCity)
        .then((records) => {
            res.json(records); // Send the records as JSON
        })
        .catch((error) => {
            console.error("Error querying the database:", error);
            res.status(500).json({ error: "Error fetching records" });
        });
});


//From the view users page, this will select an individual record in the data table and pass the id of this record into the edit users page
app.get("/editUsers/:id", (req, res) => {
    knex.select("firstName", "lastName", "email", "username", "password", "id")
    .from("loginInfo")
    .where("id", parseInt(req.params.id))
    .then(loginInfo => {
        res.render("editUsers", {theLogin: loginInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
})


//Submits data from the edit user page and updates the corresponding row in the database to match the changes. Then redirects to the viewUser page
app.post("/editUsers", (req, res) => {
    knex("loginInfo").where("id", parseInt(req.body.id)).update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).then(theLogin => {
        res.redirect("viewUser");
    });
});


//From the view users page, there is a delete button by each record. This allows to select a row (by its id) and then delete it from the database. Then redirects back to view user
app.post("/deleteUser/:id", (req, res) => {
    knex("loginInfo").where("id", parseInt(req.params.id)).del().then(theLogin => {
        res.redirect("/viewUser");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});


//Passes the user id into the user profile page which will only show the current user's information
app.get("/userprofile/:id", (req, res) => {
    const id = req.params.id;
    // Retrieve user data based on userId using Knex.js
    knex.select().from("loginInfo").where({ id: id }).then((user) => {
        if (user.length === 0) {
            // If the user is not found, render the profile page with null value for theLogin
            res.render("userprofile", { theLogin: null });
            return;
        }
        // Render the profile page with retrieved user data in theLogin
        res.render("userprofile", { theLogin: user[0] });
    }).catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
    });
});


//Renders the dashboard page
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})


//Checks to see if the server is running
app.listen(port, () => console.log("Server is listening"));