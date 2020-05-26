const express = require("express");
const mongoose = require("mongoose");
const shortid = require('shortid');

//Bring in models from external file
const Story = require("../models/story");
const Author = require("../models/author");

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
    { $sample: { size: 20 } }
  ])
  .then(eachOne => {
    //console.log(eachOne);
    res.status(200).send({
      success: true,
      stories: eachOne,
    });
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      error: err
    });
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
    res.status(200).send({
      success: true,
      stories: eachOne,
    });
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      error: err
    });
  });
});

//Create new Story document from data
router.post("/", async function(req, res) {
  let storyStore;
  Story.create({
    title: req.body.title,
    isPublic: req.body.isPublic,
    fold: req.body.fold,
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
    storyStore = story;
    console.log("Story created: ", story);
    console.log("Updating/Creating Author...");
    let authEmail = req.body.segments[req.body.segments.length - 1].author;
    return updateAuthor(authEmail, story._id, null);
  })
  .then(async () => {
    res.status(200).send({
      success: true,
      story: storyStore,
    });
  })
  .catch(async err => {
    res.status(500).send({
      success: false,
      error: err,
    });
    console.log("Server error creating story or updating author! ", err);
  });
});

//Get complete Story document by requested _id
router.get("/:story_id", (req, res) => {
  console.log("Getting story...");
  Story.findOneAndUpdate({_id: req.params.story_id}, {locked: true})
    .then(story => {
      if (story) {
        console.log("Found story, getting usernames");
        return Author.find( { email: { $in: story.authors } }, { username: 1, _id: 0 })
        .then(usernames => {
          console.log("Found usernames:", usernames);
          res.status(200).send({
            success: true,
            story: story,
            usernames: usernames
          });
        });
      } else {
        res.status(400).send({
          success: false,
          error: "Couldn't find story"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        error: err
      });
      console.log("Server error loading story! ", err);
    });
});

//modify Story document by _id
router.put("/:story_id", async function(req, res) {
  console.log("stories router.put req.body:", req.body);
  // Start session and transaction to only commit when both Story and Author updates work
  const session = await mongoose.startSession();
  session.startTransaction();
  Story.findOneAndUpdate(
    { _id: req.params.story_id },
    { $set: req.body },
  ).session(session)
  .then(story => {
    console.log("Story update success");
    let authEmail = req.body.segments[req.body.segments.length - 1].author;
    return updateAuthor(authEmail, story._id, session);
  })
  .then(async function() {
    console.log("Story & Author update success");
    await session.commitTransaction();
    res.status(200).send({
      success: true,
      _id: req.params.story_id,
    });
  })
  .catch(async function(err) {
    await session.abortTransaction();
    console.log("Sending 500 status");
    res.status(500).send({
      success: false,
      error: err,
    });
    console.log("Error updating story! ", err);
  })
  .then(() => session.endSession());
});

//modify Story document by _id
router.put("/likes/:story_id", function(req, res) {
  console.log("stories router.put req.body:", req.body);
  Story.findOneAndUpdate(
    { _id: req.params.story_id },
    { $set: req.body },
  )
  .then(story => {
    console.log("Like update success");
    res.status(200).send({
      success: true,
      story: story,
      _id: req.params.story_id,
    });
  })
  .catch(err => {
    console.log("Sending 500 status");
    res.status(500).send({
      success: false,
      error: err,
    });
    console.log("Error updating story! ", err);
  });
});


async function updateAuthor(email, storyID, session) {
  return Author.findOne({ email: email }).session(session)
  .then(auth => {
    if (auth) {
      // Update existing Author if they already exist
      console.log("Updating author...");
      // Only add if story isn't already logged in author document
      if (!auth.stories.includes(storyID)) {
          auth.stories.push(storyID);       
        return auth.save().then(result => {
          console.log("Successfully updated author");
        });
      } else {
        console.log("Already contains story");
      }
    } else {
      console.log("Creating new author...");
      return Author.create({
        email: email,
        stories: [storyID],
        passID: short.generate(),
        contribution: true,
        completion: true,
        dateCreated: Date.now()
      }).then(result => {
        console.log("Successfully created author");
      });
    }
  })
}

module.exports = router;
