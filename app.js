const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const dbUrl = 'mongodb+srv://protrack:9bnk0XYkPf1T3JwR@clusterfuck-wglwx.mongodb.net/test?retryWrites=true';
mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
  console.log('mongo db connection', err);
});

app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Production mode path
if (process.env.NODE_ENV === 'production') {
    console.log("Production mode");
    app.use(express.static(path.join(__dirname, 'client/build')));
    
} else {
    // Build mode path
    console.log("Dev mode");
    //app.use(express.static(path.join(__dirname, 'client/public')));
}

app.use('/milestones', require('./routes/milestones'));
app.use('/projects', require('./routes/projects'));
app.use('/', indexRouter);

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
