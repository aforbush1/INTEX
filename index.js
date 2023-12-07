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

// app.get("/dashboard", (req, res) =>
    // res.send("<div class='tableauPlaceholder' id='viz1701795084373' style='position: relative'><noscript><a href='#'><img alt='Dashboard 1 ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_17011425626370&#47;Dashboard1&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='Book1_17011425626370&#47;Dashboard1' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_17011425626370&#47;Dashboard1&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1701795084373');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1366px';vizElement.style.height='795px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1366px';vizElement.style.height='795px';} else { vizElement.style.width='100%';vizElement.style.height='1127px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>"));

app.get("/surveyForm", (req, res) => {
    res.render("surveyForm");
});

app.post("/submitSurvey", (req, res) => {
    console.log(req.body);
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
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });
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
        .then(() => {
            // Handle success
            res.render("thankYou");
        })
        .catch(err => {
            // Handle error
            console.error("Error inserting survey:", err);
            // Send an error response or redirect to an error page
            res.status(500).send("Error submitting survey");
        });
});

app.get("/login", (req, res) => {
    res.render("login");
})
    
app.post("/submitLogin", (req, res) => {
    const sAdminUsername = 'Admin'
    const sAdminPassword = 'Intex2023'
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
            .select('firstName', 'id')
            .first()
            .then(result => {
                if (result) {
                    const firstName = result.firstName;
                    const id = result.id;
                    res.render('userIndex', { firstName, id });
                } else {
                    res.sendFile(path.join(__dirname, "views/invalidLogin.html"));
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Internal Server Error");
            });
    }
    });

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

// app.post("/createUser", (req, res) => {
    // knex("loginInfo").insert({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.username, password: req.body.password}).then((theSurveys) => {
    //   res.render("viewUser", {theSurveys : loginInfo} );
    // });
// });

app.get("/createUser", (req, res) => {
    res.render("createUser");
})

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
                        res.redirect('/userCreatedGood');
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

app.get("/adminIndex", (req, res) => {
    res.sendFile(path.join(__dirname, "views/adminIndex.html"))
})

app.get("/viewData", (req, res) => {
    knex.select().from("plainsville").then( (plainsville) => {
        res.render("viewData", {theSurveys : plainsville});
    });
});

app.post("/filterData", (req, res) => {
    const selectedCity = req.body.filterCity;
    const selectedRecordId = req.body.findRecord;

    // Initialize the query without specifying a table
    let query = knex;

    // If a specific city is selected, add it to the query
    if (selectedCity) {
        query = query(selectedCity);
    }

    // If a specific record ID is provided, add a WHERE clause
    if (selectedRecordId) {
        query = query.where({ id: selectedRecordId });
    }

    // Execute the query
    query
        .then((filteredRecords) => {
            // Make sure to use the correct variable name here (filteredRecords)
            res.render("filterData", { theSurveys: filteredRecords });
        })
        .catch((error) => {
            // Handle errors if any while querying the database
            console.error("Error querying the database:", error);
            res.status(500).send("Error fetching filtered record");
        });
});


app.get("/getRecords/:city", (req, res) => {
    const selectedCity = req.params.city;

    // Initialize the query with the selected city
    let query = knex(selectedCity);

    // Execute the query
    query
        .then((records) => {
            res.json(records); // Send the records as JSON
        })
        .catch((error) => {
            console.error("Error querying the database:", error);
            res.status(500).json({ error: "Error fetching records" });
        });
});



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

app.post("/deleteUser/:id", (req, res) => {
    knex("loginInfo").where("id", parseInt(req.params.id)).del().then(theLogin => {
        res.redirect("/viewUser");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/userprofile/:id", (req, res) => {
    const userId = req.params.id;
    // Retrieve user data based on userId using Knex.js (this is just an example)
    knex.select().from("loginInfo").where({ id: userId }).then((user) => {
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

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.listen(port, () => console.log("Server is listening"));