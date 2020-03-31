const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');

/* Use POST data to create and send email */
router.post('/', function(req, res, next) {

  let transporter = nodeMailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    }
  });
  let msgText = req.body.body + "<br/>";
  if (req.body.email) {
      msgText += req.body.email + "<br/>";
  }
  msgText += "<br/>";

  console.log("Should be sending email..");

  msgText += '<br/>=================================';

    if (req.body.email) {
        let mailOptions = {
            from: `"Fold and Pass" noreply@foldandpass.com`,
            to: process.env.MAILGUN_USER === "postmaster@mg.foldandpass.com" ? req.body.email : "johndurso@gmail.com",
            subject: req.body.subject,
            html: msgText,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log(error);
            res.status(400).send({
                success: false,
                body: `Error sending email`,
                error: error
            });
            } else {
            console.log(info);
            res.status(200).send({
                success: true,
                body: `Email sent`,
                info: info
            });
            }
        });
    } else {
        let mailOptions = {
            from: `"Fold and Pass" noreply@foldandpass.com`,
            subject: req.body.subject,
            html: msgText,
        };
        
        //Send email to each author
        let keys = Object.keys(req.body.authors);
        for(let key in keys) {
            console.log("Sending completion emails");
            mailOptions["to"] = req.body.authors[key];

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(400).send({
                        success: false,
                        body: `Error sending email`,
                        error: error
                    });
                } else {
                    console.log(info);
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

module.exports = router;
