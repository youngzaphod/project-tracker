const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Milestone = require('../models/milestone');
const Project = require('../models/project');


router.post('/', function(req, res) {
    const newProject = {
        _id: new mongoose.Types.ObjectId,
        projectName: 'New example project',
        startDate: new Date().getTime(),
        timeUnits: 'Days',
        mstoneIds: []
    }

    project = new Project(newProject);

    project.save()
    .then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        console.log('Error creating project: ', err);
        res.status(500).json({error: err});
    });
  
});

router.get('/:projectId', (req, res) => {
    const id = req.params.projectId;

    Project.findById(id)
    .populate('mstoneIds')
    .then(project => {
        console.log(project);
        res.status(200).json(project);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: `Error fetching project: ${err}`});
    })
});

module.exports = router;
