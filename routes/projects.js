const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Bring in models from external file
const Milestone = require('../models/milestone');
const Project = require('../models/project');
const router = express.Router();


//Show all docs in collection
router.get('/', (req,res) => {
	console.log('get projects')
	Project.find({})        
		.then((project) => {
			res.json(project);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
})

//Creates a new Project document from data. Doesn't populate the mstoneID
router.post('/', function (req, res) {
	// res.json(req.body)
	Project.create({
		"projectName": req.body.projectName,
		"description": req.body.description,
		"startDate": req.body.startDate,
		"quantity": req.body.quantity,
		"timeUnits": req.body.timeUnits
	})
	.then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//Get complete Project document by requested _id
router.get('/:project_id', (req, res) => {
	Project.findById(req.params.project_id)
	.populate('mstoneIds')			// EDIT: Makes life 1x10^6 times easier for John
	.then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//Delete Project document by _id
router.delete('/:project_id', function (req, res) {
	// res.json(req.body)
	Project.remove( 
		{"_id": req.params.project_id
	})
	.then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//modify Project document by _id
router.put('/:project_id', function (req, res) {
	// res.json(req.body)
	Project.update( 
		{"_id": req.params.project_id}, 
		{'$set':
		{"projectName" : req.body.projectName,
		"description:" : req.body.description,
		"startDate" : req.body.startDate,
		"quantity" : req.body.quantity,
		"timeUnits" : req.body.timeUnits,
		// mstone_ids in the array need to be modified in separate call.
	}
	}).then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//Write a new Project mstoneId to a specific document based on _id
router.put('/:project_id/:mstone_id', function (req,res){
	Project.update(
		{"_id": req.params.project_id},
		{ 
			$push:   //**MODIFIED PER NEW SCHEMA**
			//{"mstone_ids" : req.params.mstone_id }
			{"mstone_ids": req.params.mstone_id}
		}).then((project) => {
			res.json(project);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
	});
});
	
//Delete an existing Project mstone_id 
router.delete('/:project_id/:mstone_id', function (req,res){
	Project.update({'_id': req.params.project_id}, 
	{
		'$pull':    // **MODIFIED PER SCHEMA CHANGE
		{
			'mstone_ids': req.params.mstone_id
			// {'mstoneId': req.params.mstone_id}
		}
	}).then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})
	
//Modify an existing Project mstoneID. Must have newmstoneId in sent params
router.put('/:project_id/:mstoneId', function (req,res){
	Project.update({'_id': req.params.project_id, "mstoneIds.mstoneId":req.params.mstoneId}, 
	{
		'$set': 
		{'mstone_ids.$.mstone_id': req.body.newmstone_id}
	}).then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//Get milestone array from Project document by requested _id
router.get('/mstone_id/:project_id', (req, res) => {
	Project.findById(req.params.project_id)
	.then((project) => {
		res.json(project.mstone_ids);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

module.exports = router;
