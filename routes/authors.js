const express = require("express");
const mongoose = require("mongoose");

//Bring in models from external file
const Story = require("../models/story");
const Author = require("../models/author");

const router = express.Router();

//Show all story docs in collection
router.get("/:authorEmail", (req, res) => {
  Story.find({authors: req.params.authorEmail})
  .then(stories => {
    console.log("Successfully got stories for author", req.params.authorEmail);
    return Author.findOne({ email: req.params.authorEmail })
    .then(auth => {
      if (auth) {
        res.status(200).send({
          success: true,
          stories: stories,
          author: auth
        });
      } else {
        res.status(400).send({
          success: false,
          errors: ["Author not found"],
        });
      }
      
    });
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      errors: errors
    });
  });

});

router.put("/:authorEmail", (req, res) => {
  console.log("Updating author settings");
  Author.findOneAndUpdate(
    { email: req.params.authorEmail },
    { $set: req.body })
  .then(response => {
    if (response) {
      console.log("Response", response);
      res.status(200).send({
        success: true,
        response: response
      });
    } else {
      res.status(400).send({
        success: false,
        error: "No author found to update!"
      });
    }

  })
  .catch(err => {
    console.log("Error updating author settings", err);
    let message = err.code === 11000 ? "Couldn't update settings, that username is already in use."
     : "Sorry, there was an issue updating settings, please try again later";
    res.status(500).send({
      success: false,
      error: message
    });
  });

});

//Show all incomplete stories in collection
router.get("/incomplete", (req, res) => {
  Story.find({ complete: false, isPublic: true })
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});

//Show all complete stories in collection
router.get("/complete", (req, res) => {
  Story.find({ complete: true, isPublic: true })
  .then(eachOne => {
    //console.log(eachOne);
    res.json(eachOne);
  });
});


module.exports = router;
