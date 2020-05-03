const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


router.post('/', (req, res, next) => {
    console.log("Executing captcha.js, KEY:", process.env.RECAPTCHA_SECRET_KEY);
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.token}`;
    axios(url, { method: 'POST' })
    .then(response => res.send(response.data))
    .catch(err => {
        console.log("Error verifying user:", err);
        res.send({err});
    });
});


module.exports = router;