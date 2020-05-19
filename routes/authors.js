const express = require("express");
const mongoose = require("mongoose");

//Bring in models from external file
const Story = require("../models/story");
const Author = require("../models/author");

const router = express.Router();

//Show all story docs in collection
router.get("/:authorEmail/:passID", (req, res) => {
  Story.find({authors: req.params.authorEmail})
  .then(stories => {
    console.log("Successfully got stories for author", req.params.authorEmail);
    return Author.findOne({ email: req.params.authorEmail })
    .then(auth => {
      if (auth && auth.passID === req.params.passID) {
        res.status(200).send({
          success: true,
          stories: stories,
          author: auth
        });
      } else {
        res.status(400).send({
          success: false,
          error: "Author link is incorrect, please use the link provided via email"
        });
      }
      
    });
  })
  .catch(err => {
    console.log("Error loading author data:", err);
    res.status(500).send({
      success: false,
      error: "Error loading author data"
    });
  });

});

//Get all public stories of author by username
router.get("/:username", (req, res) => {
  console.log("Getting stories by username");
  Author.findOne({ username: req.params.username })
  .then(auth => {
    if (auth) {
      return Story.find({ authors: auth.email, isPublic: true })
      .then(eachOne => {
        //console.log(eachOne);
        res.status(200).send({
          success: true,
          stories: eachOne
        });
      });
    } else {
      res.status(400).send({
          success: false,
          error: "Couldn't find author by username"
        });
    }
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      error: err
    });
  })
  
});

router.put("/:authorEmail/:passID", (req, res) => {
  console.log("Updating author email, passID", req.params.authorEmail, req.params.passID);
  Author.findOne({ email: req.params.authorEmail })
  .then(auth => {
    if (auth.passID === req.params.passID) {
      auth.contribution = req.body.contribution;
      auth.completion = req.body.completion;
      auth.username = req.body.username;
      return auth.save();
    } else {
      throw new Error("Incorrect passID");
    }
  })
  .then((auth) => {
    console.log("Successfully updated author");
    res.status(200).send({
      success: true,
      response: auth
    });
  })
  .catch(err => {
    console.log("Issue updating author", err);
    res.status(400).send({
      success: false,
      error: err
    });
  })

  /*
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
  */

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
