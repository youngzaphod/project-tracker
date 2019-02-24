const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const milestone = require('../models/milestone');

router.post('/', function(req, res) {
  let newMilestone = new milestone(req.body);

  console.log("Adding milestone: ", req.body);

  newMilestone.save()
  .then(doc => {
      console.log(doc);
      res.sendStatus(200);
  })
  .catch(err => {
      console.error(err);
      res.sendStatus(500);
  });

});

module.exports = router;
