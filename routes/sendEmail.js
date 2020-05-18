const express = require('express');
const router = express.Router();
const mailgun = require('mailgun-js');
const mongoose = require("mongoose");
const Author = require("../models/author");
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
                console.log("Error sending contact email: ", error);
                res.status(400).send({
                    success: false,
                    body: `Error sending contact email`,
                    error: error
                });
            } else {
                console.log("Successfully sent contact email!", info);
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

    // Set up to track errors
    let errorArray = [];
    let infoArray = [];

    // Send email to most recent contributor - doesn't depend on settings
    if (!req.body.finished) {
        let message = "You are now a contributing author to the soon-to-be-released..."
        const data = {
            from: `Fold and Pass noreply@foldandpass.com`,
            to: req.body.email,
            subject: req.body.subject,
            template: "notification",
            'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + req.body.email}", "message": "${message}"}`
        };
        mg.messages().send(data, function (error, info) {
            if (error) {
                console.log(`Error sending addition email to ${req.body.email}, adding to array: `, error);
                errorArray.push(error);
            } else {
                console.log(`Successfully sent addition email to ${req.body.email}, adding to array: `, info);
                infoArray.push(info);
            }
        });   
    }
    
    // Get new unique set of authors, so we don't send duplicate emails
    let authors = [...new Set(req.body.authors)];
    // Loop through authors and send emails based on preferences
    let i = 0;
    authors.forEach(email => {
        Author.findOne({email: email})
        .then(auth => {
            console.log("Processing email for", auth.email);
            console.log("Settings: (completion, contribution, finished)", auth.completion, auth.contribution, req.body.finished);
            if (req.body.finished && auth.completion) {
                let message = "Get your expectations nice and low, then check it out!";
                const data = {
                    to: auth.email,
                    from: `Fold and Pass noreply@foldandpass.com`,
                    subject: req.body.subject,
                    template: "notification",
                    'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + email}", "message": "${message}"}`,
                };
                
                mg.messages().send(data, function (error, info) {
                    if (error) {
                        console.log("Error sending completion email, adding to array: ", error);
                        errorArray.push(error);
                    } else {
                        console.log(`Successfully sent completion email to ${auth.email}, adding to array: `, info);
                        infoArray.push(info);
                    }
                });   
            }

            // Send contribution email only if not finished AND not to most recent author
            if (!req.body.finished && auth.contribution && auth.email !== req.body.email) {
                let message = "You have a collaborator! You can see what they wrote or wait until it's finished.";
                const data = {
                    to: auth.email,
                    from: `Fold and Pass noreply@foldandpass.com`,
                    subject: "Someone contributed to your story",
                    template: "notification",
                    'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlOrigin + "/author/" + email}", "message": "${message}"}`,
                };
                console.log("About to send contribution email to", auth.email)
                mg.messages().send(data, function (error, info) {
                    if (error) {
                        console.log("Error sending contribution email, adding to array: ", error);
                        errorArray.push(error);
                    } else {
                        console.log(`Successfully sent contribution email to ${auth.email}, adding to array: `, info);
                        infoArray.push(info);
                    }
                });   

            }

        })
        .catch(err => {
            console.log("Error looking up author", err);
            errorArray.push(err);
        })
        .then(() => {
            // Send res on last loop iteration
            i++;
            if (i === authors.length) {
                if (errorArray.length > 0) {
                    console.log("Error sending emails: ", errorArray);
                    res.status(400).send({
                        success: false,
                        body: `Error sending emails`,
                        errors: errorArray
                    });
                } else {
                    console.log("Completed email send with no errors!", infoArray);
                    res.status(200).send({
                        success: true,
                        body: `Emails sent`,
                        info: infoArray
                    });
                }
            }
        });

    });

});



module.exports = router;
