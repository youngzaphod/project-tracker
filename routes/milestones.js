const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Bring in models from external file
const Milestone = require("../models/milestone");
const Project = require("../models/project");
const router = express.Router();

//Show all milestone docs in collection
router.get("/", (req, res) => {
  Milestone.find({}).then(eachOne => {
    res.json(eachOne);
  });
});

//Create new milestone document from data
router.post("/", function(req, res) {
  console.log("Adding body: ", req.body);
  Milestone.create({
    mstoneName: req.body.mstoneName,
    length: req.body.length, //ISODate format
    owner: req.body.owner, //Name of milestone owner
    description: req.body.description,
    startDate: req.body.startDate //ISODate format
    // Tasks are created in separate call.
  })
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Get complete milestone document by requested _id
router.get("/:mstone_id", (req, res) => {
  Milestone.findById(req.params.mstone_id)
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//modify Milestone document by _id
router.put("/:mstone_id", (req, res) => {
  // res.json(req.body)
  Milestone.update(
    { _id: req.params.mstone_id },
    {
      $set: {
        mstoneName: req.body.mstoneName,
        length: req.body.length, //ISODate format
        owner: req.body.owner, //Name of milestone owner
        description: req.body.description,
        startDate: req.body.startDate //ISODate format
        // Tasks are be modified in separate call.
      }
    }
  )
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Delete Milestone document by _id
router.delete("/:mstone_id", function(req, res) {
  // res.json(req.body)
  Milestone.remove({ _id: req.params.mstone_id })
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Write a new task to a specific Milestone document based on milestone _id
router.post("/task/:mstone_id", function(req, res) {
  console.log(req.body);
  // Manually create new task before inserting so we can generate
  // and return _id
  let newTask = {
    taskName: req.body.taskName,
    taskDescription: req.body.taskDescription,
    taskLength: req.body.taskLength, //length of miestone in milliseconds (ISODate)
    startDate: req.body.startDate,
    order: req.body.order,
    _id: new mongoose.Types.ObjectId()
  };
  Milestone.update(
    { _id: req.params.mstone_id },
    {
      $push: {
        tasks: newTask
      }
    }
  )
    .then(milestone => {
      res.status(200).json({
        response: milestone,
        _id: newTask._id
      });
      console.log(milestone);
      console.log("New id: ", newTask._id);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Modify an existing Milestone task by task _id. Must have newmstoneId in sent params
router.put("/tasks/:mstone_id/:task_id", function(req, res) {
  Milestone.update(
    { _id: req.params.mstone_id, "tasks._id": req.params.task_id },
    {
      $set: {
        "tasks.$.taskName": req.body.taskName,
        "tasks.$.taskDescription": req.body.taskDescription,
        "tasks.$.taskLength": req.body.taskLength, //length of milestone in milliseconds (ISODate)
        "tasks.$.startDate": req.body.startDate,
        "tasks.$.order": req.body.order
      }
    }
  )
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

// Update order on all items after where insert is happening
router.put("/tasks/:mstone_id", function(req, res) {
  Milestone.update(
    {
      _id: req.params.mstone_id,
      "tasks.order": { $gte: req.body.lowIndex, $lte: req.body.highIndex }
    },
    {
      $inc: {
        "tasks.$.order": req.body.inc
      }
    }
  )
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Delete an existing Milestone task by task _id
router.delete("/tasks/:mstone_id/:task_id", function(req, res) {
  Milestone.update(
    { _id: req.params.mstone_id },
    {
      $pull: {
        tasks: {
          _id: req.params.task_id
        }
      }
    }
  )
    .then(milestone => {
      res.json(milestone);
      console.log(milestone);
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Get full task array from Milestone document by requested _id
router.get("/tasks/:mstone_id", (req, res) => {
  Milestone.findById(req.params.mstone_id)
    .then(milestone => {
      res.json(milestone.tasks);
      // console.log(project)    // WAS THROWING ERROR
    })
    .catch(err => {
      res.send(err);
      console.log("Error! ", err);
    });
});

//Return a single milestone task by task_id
//Get task array from Milestone document by requested _id
router.get("/task/:task_id", (req, res) => {
  Milestone.find({ "tasks._id": req.params.task_id }, { _id: 0, "tasks.$": 1 })
    .then(task => {
      res.json(task);
      // console.log(project);      //WAS THROWING ERROR */
    })
    .catch(err => {
      res.status(500).json({ error: err });
      console.log("Error! ", err);
    });
});

module.exports = router;
