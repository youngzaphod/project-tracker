const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');
const server = http.createServer(app);

//Bring in models from external file
const Story = require("../models/story");
//Keeping these so code doesn't break until I can get rid of them
//const Milestone = require("../models/milestone");
//const Project = require("../models/project");

const router = express.Router();

//Show all story docs in collection
router.get("/", (req, res) => {
  Story.find({}).then(eachOne => {
    res.json(eachOne);
  });
});

//Show all incomplete stories in collection
router.get("/incomplete", (req, res) => {
  Story.aggregate([
    { $match: { complete: false, isPublic: true } },
    { $sample: { size: 10 } }
  ])
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});

//Show all incomplete stories in collection
router.get("/complete", (req, res) => {
  Story.aggregate([
    { $match: { complete: true } },
    { $sample: { size: 20 } }
  ])
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});

/*
//Show all incomplete stories in collection
router.get("/incomplete", (req, res) => {
  Story.find({ complete: false, isPublic: true })
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});
*/

/*
//Show all complete stories in collection
router.get("/complete", (req, res) => {
  Story.find({ complete: true, isPublic: true })
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});
*/

//Create new Story document from data
router.post("/", function(req, res) {
  //console.log("Adding body: ", req.body);
  Story.create({
    title: req.body.title,
    isPublic: req.body.isPublic,
    nextEmail: req.body.nextEmail,
    complete: req.body.complete,
    segCount: req.body.segCount,
    segments: req.body.segments,
    rounds: req.body.rounds,
    lastUpdate: Date.now(),
    authors: req.body.authors,
    locked: false
  })
    .then(story => {
      res.json(story);
      console.log(story);
    })
    .catch(err => {
      res.send(err);
      console.log("Server error creating story! ", err);
    });
});

//Get complete Story document by requested _id
router.get("/:story_id", (req, res) => {
  Story.findOneAndUpdate({_id: req.params.story_id}, {locked: true})
    .then(story => {
      res.json(story);
      //console.log("Getting story", story);
    })
    .catch(err => {
      res.status(500).json({error: err});
      console.log("Server error loading story! ", err);
    });
});

//modify Story document by _id
router.put("/:story_id", (req, res) => {
  console.log("req.body:", req.body);

  Story.findOneAndUpdate(
    { _id: req.params.story_id },
    { $set: req.body },
  )
    .then(story => {
      res.json(story);
      //console.log(story);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Used for when user closes browser before saving to unlock story
router.post("/:story_id", (req, res) => {
  //console.log("req from Beacon:", req);

  Story.findOneAndUpdate(
    { _id: req.params.story_id },
    { $set: {locked: false} },
  )
    .then(story => {
      res.json(story);
      //console.log("Unock via Beacon response:", story);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});


module.exports = router;
