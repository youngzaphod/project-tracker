const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const storyRouter = require("./routes/stories");
const emailRouter = require("./routes/sendEmail");
const authorRouter = require("./routes/authors");
const captchaRouter = require("./routes/captcha");
var createError = require('http-errors');
const sanitize = require("mongo-sanitize");
require('dotenv').config();
require('./scripts/connectDB')(mongoose);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Production mode path
if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
  app.use(express.static(path.join(__dirname, "client/build")));
} else {
  // Build mode path
  console.log("Dev mode");
  //app.use(express.static(path.join(__dirname, 'client/public')));
}

// Sanitize user input to prevent injection attacks
function cleanBody(req, res, next) {
  req.body = sanitize(req.body);
  next('route');
}

// Call sanitization first
app.use(cleanBody);
app.use("/api/stories", storyRouter);
app.use("/api/email", emailRouter);
app.use("/api/authors", authorRouter);
app.use("/api/captcha", captchaRouter);

// Handles any requests that don't match the ones above for production build
if (process.env.NODE_ENV === "production") {
  app.get('*', (req,res) =>{
      res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : err;

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
