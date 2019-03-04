const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const milestoneRouter = require('./routes/milestones');
const projectRouter = require('./routes/projects');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to cluster at mongoDB Atlas
const dbURL = 'mongodb+srv://protrack:9bnk0XYkPf1T3JwR@clusterfuck-wglwx.mongodb.net/test?retryWrites=true';
mongoose.connect(dbURL, { useNewUrlParser: true }, err => {
  console.log('Attempted mongodb connection...');
  if (err) {
    console.log('DB connection error: ', err);
  } else {
    console.log('Connection successful');
  }
});

// Production mode path
if (process.env.NODE_ENV === 'production') {
    console.log("Production mode");
    app.use(express.static(path.join(__dirname, 'client/build')));
    
} else {
    // Build mode path
    console.log("Dev mode");
    app.use(express.static(path.join(__dirname, 'client/public')));
}


app.use('/api/milestones', milestoneRouter);
app.use('/api/projects', projectRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
