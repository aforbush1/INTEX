# INTEX

# Website Access
Website URL: https://provohealth.org/

# Admin Access
Username: Admin
Password: Intex2023

# User Access
Username: User
Password: Intex2023

# Landing Page
Clicking on the link above will take you to our initial landing page. The main functionality in our landing page are buttons that lead to the Survey view where you can take the 20 question survey and then the login page for admins and users.

# Account Management (View)
Our Account Management view is named "login.ejs" in order to create a user account and enter personal details
you must click on the Login tab in the upper right corner of the landing page. You can only create users through the Admin profile. Listed above is the username and password you need to enter into Admin. Once 
entered you will be welcomed into the Admin landing page which will have a tab labeled "Create User" here you can create a new user which will be succesfully updated to the the postgres database. You can click on "View Users" to confirm.

# Social Media (View)
Our Social Media view is named "surveyForm.ejs", click on the survey tab. In this view there is a form that contains the 20 Mental Health Question. The provo location is set to default in our "index.js" file. Under our POST route "/submitSurvey" and at the end of the insert data portion we set the location column equal to Provo. On our "surveyForm.ejs" page anyone is able to take the survey without logging in.

# Report (View)
Our Report view is named "viewData.ejs" this can be accessed by both the User and the Admin.

***Dropdown list to filter to a specific person

