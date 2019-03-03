const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Milestone = require('../models/milestone');
const Project = require('../models/project');


// Add new blank task to milestoneId
router.post('/:milestoneId', (req, res) => {
  const id = req.params.milestoneId;
  const index = req.body.index !== undefined ? parseInt(req.body.index) : 0;
  console.log("index: ", index);
  // Create default task to add
  const newTask = {
    _id: new mongoose.Types.ObjectId,
    taskName: 'New task tester',
    startDate: new Date().getTime(),
  };

  // Find milestone to add task to
  Milestone.findById(id)
    .then(record => {
      record.tasks.push(newTask);
      record.save()
        .then(rec => {
          console.log(rec);
          res.status(201).json(rec);
        })
        .catch(err => {
          console.log('Failure adding task: ', err);
          res.status(500).json({error: `Failed to add task: ${err}`});
      });
    })
    .catch(err => {
      console.log('Failure finding milestone: ', err);
      res.status(500).json({error: `Failed to find milestone: ${err}`});
  });
  

});

// Get single task from milestone by id (USEFUL???)
router.get('/:milestoneId/:taskId', (req, res) => {
  console.log(`milestoneId: ${req.params.milestoneId} taskId: ${req.params.taskId}`);
  Milestone.findById(req.params.milestoneId).exec()
    .then(doc => {
      console.log('Response from db: ', doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err});
    });
});

// Create new blank milestone
router.post('/', function(req, res) {
  console.log("Req.body.projectId: ", req.body);
  const blank = {
    _id: new mongoose.Types.ObjectId(),
    projectId: req.body.projectId,
    mstoneName: 'New Milestone Test',
    tasks: []
  }

  let milestone = new Milestone(blank);

  console.log("Adding milestone: ", blank);

  milestone.save()
  .then(doc => {
      console.log(doc);
      Project.findById(req.body.projectId).exec()
      .then(project => {
        project.mstoneIds.push(milestone._id);
        project.save()
        .then(final => {
          res.status(201).json({
            success: true,
            message: 'Created milestone via POST request',
            milestone: doc
          });
        })
        .catch(saveErr => {
          res.status(500).json({
            success: false,
            message: `Failed to save miletone ID to project: ${err}`,
            milestone: blank
          });
        });
        
      })
      .catch(projectErr => {
        res.status(500).json({
          success: false,
          message: `Created milestone; failed to add to project: ${err}`,
          milestone: blank
        });
      });
  })
  .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: `Failed to create milestone: ${err}`,
        milestone: blank
      });
  });

});

// Get milestone by ID
router.get('/:milestoneId', (req, res) => {
  Milestone.findById(req.params.milestoneId).exec()
    .then(doc => {
      console.log('Response from db: ', doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err});
    });
});

// Get all milestones
router.get('/', (req, res) => {
  Milestone.find({}).exec()
    .then(doc => {
      console.log('Response from db: ', doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err});
    });
});

router.patch('/:milestoneId', (req, res) => {
  const id = req.params.milestoneId;
  const updateOps = {};
  for (const key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }

  Milestone.update({_id: id}, { $set: updateOps})
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json(result);
  })
  .catch(err => {
    console.error("Error: ", err);
    res.status(500).json({error: err});
  });
});

router.delete('/:milestoneId', (req, res) => {
  const id = req.params.milestoneId;
  Milestone.remove({_id: id})
    .exec()
    .then(result => {
      console.log(`Successfully deleted ${id}`);
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err});
    });
});


module.exports = router;
