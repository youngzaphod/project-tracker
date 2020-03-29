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
  let msgText = req.body.body + "<br/>" + req.body.email;
  console.log("Should be sending email..");
  /*
  for(const key in req.body) {
    // Make sure key is not a prototype property, actually belongs to object
    if(!req.body.hasOwnProperty(key)) continue;

    msgText += `<br/>${key}: ${req.body[key]}`

  }
  */
  msgText += '<br/>=================================';

    if (req.body.email) {
        let mailOptions = {
            from: 'postmaster@sandbox5b8a5a156f2e4160b69ffca0fad3dd67.mailgun.org',
            to: 'johndurso@gmail.com',
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
            from: 'postmaster@sandbox5b8a5a156f2e4160b69ffca0fad3dd67.mailgun.org',
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
