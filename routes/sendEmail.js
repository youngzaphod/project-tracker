const express = require('express');
const router = express.Router();
const mailgun = require('mailgun-js');
require('dotenv').config();

const mg = mailgun({
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
});

router.post('/contact', function(req, res, next) {
    console.log('Contact email sending...');
    const data = {
        from: `Fold and Pass noreply@foldandpass.com`,
        to: 'johndurso@gmail.com',
        subject: req.body.subject,
        template: "contactform",
        'h:X-Mailgun-Variables': `{"title": "${req.body.subject}", "message": "${req.body.body}", "replyTo": "${req.body.email}"}`
    };

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
                // Also notify original author, if they aren't the one that just contributed
                if (req.body.authors[0] !== req.body.email) {
                    message = "You have a collaborator! You can see what they wrote or wait until the end."
                    let newData = {
                        from: `Fold and Pass noreply@foldandpass.com`,
                        to: req.body.authors[0],
                        subject: "Someone contributed to your story",
                        template: "notification",
                        'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + req.body.authors[0]}", "message": "${message}"}`
                    };
                    console.log("Sending email to original author");
                    mg.messages().send(newData, function (error, info) {
                        if (error) {
                            console.log("Error sending original author email: ", error);
                            res.status(400).send({
                                success: false,
                                body: `Error sending original author email`,
                                error: error
                            });
                        } else {
                            console.log("Successfully sent original author email!", info);
                            res.status(200).send({
                                success: true,
                                body: `Email sent`,
                                info: info
                            });
                        }
                    });
                }
            }
        });

        
    }
    

    // Send completion emails, sent to everoyone who contributed
    if (req.body.finished) {
        console.log("Completion emails being sent");
        message = "Get your expectations nice and low, then check it out!";
        const data = {
            from: `Fold and Pass noreply@foldandpass.com`,
            subject: req.body.subject,
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
