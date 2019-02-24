const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const milestone = require('../models/milestone');

router.post('/', function(req, res) {
    let newTask = new milestone(req.body.task);

  console.log("Adding task: ", req.body);

  newTask.save()
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
