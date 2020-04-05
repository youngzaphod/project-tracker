const express = require('express');
const router = express.Router();
const mailgun = require('mailgun-js');
require('dotenv').config();
//const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: process.env.MAILGUN_DOMAIN});
const mg = mailgun({
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
});


/* Use POST data to create and send email */
router.post('/', function(req, res, next) {
    console.log("Email req.body:", req.body);
    let message = "You are now a contributing author to the soon-to-be-released..."
    const data = {
        from: `Fold and Pass noreply@foldandpass.com`,
        to: req.body.email,
        subject: req.body.subject,
        template: "notification",
        'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + req.body.email}", "message": "${message}"}`
    };
    
    // Send contribution email - gets sent any time a contribution is made
    if (!req.body.finished) {
        console.log("Sending addition email");
        mg.messages().send(data, function (error, info) {
            if (error) {
                console.log("Error sending addition email: ", error);
                res.status(400).send({
                    success: false,
                    body: `Error sending addition email`,
                    error: error
                });
            } else {
                console.log("Successfully sent addition email!", info);
                res.status(200).send({
                    success: true,
                    body: `Email sent`,
                    info: info
                });
            }
        });
    }
    

    // Send completion emails
    if (req.body.finished) {
        console.log("Completion emails being sent");
        message = "Get your expectations nice and low, then check it out!";
        const data = {
            from: `Fold and Pass noreply@foldandpass.com`,
            subject: "Story complete!",
            template: "notification",
        };
        // Set up to track errors
        let errorArray = [];
        let infoArray = [];
        // Loop through each author and send completion notification first
        req.body.authors.forEach((auth) => {
            console.log("Auth: ", auth);
            data.to = auth;
            data['h:X-Mailgun-Variables'] = 
                `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + auth}", "message": "${message}"}`;
            
            mg.messages().send(data, function (error, info) {
                if (error) {
                    console.log("Error sending completion email, adding to array: ", error);
                    errorArray.push(error);
                } else {
                    console.log("Successfully sent completion email, adding to array: ", info);
                    infoArray.push(info);
                }
            });   
        });

        // After looping through all, display and send errors or info
        if (errorArray.length > 0) {
            console.log("Error sending email: ", errorArray);
            res.status(400).send({
                success: false,
                body: `Error sending completion email`,
                error: errorArray
            });
        } else {
            console.log("Successfully sent completion email!", infoArray);
            res.status(200).send({
                success: true,
                body: `Email sent`,
                info: infoArray
            });
        }
        

    }

});

module.exports = router;
