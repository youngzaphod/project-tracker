var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  res.status(200).send({
    body: 'Hi everybody!',
    title: "I'm Dr. Nick!"
  });
});

module.exports = router;
