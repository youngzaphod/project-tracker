const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Bring in schema from external file

//TODO Make sure milestones are properly set up within doc.
const Milestone = require('./models/milestone');
const Project = require('./models/project');
//const router = express.Router();


//app.use('/api', router);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//mongoose.Promise = require('bluebird');
//Select the database
mongoose.connect('mongodb://localhost:27017/ProPlan');

app.use((req,res,next) => {
	console.log('we use the router, and next moves to the next requests');
	next();
});


app.get('/', (req, res) => {
	res.json({ message: 'You did it! Great job!'});
});



//PROJECTS Collection

//Show all docs in collection
app.get('/api/projects', (req,res) => {
	console.log('get projects')
	Project.find({}).then(eachOne => {
		res.json(eachOne)
		.then((project) => {
			res.json(project);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
})

//Creates a new Project document from data. Doesn't populate the mstoneID
app.post('/api/projects', function (req, res) {
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
app.get('/api/projects/:project_id', (req, res) => {
	Project.findById(req.params.project_id)
	.then((project) => {
		res.json(project);
		console.log(project)
	}).catch((err) => {
		res.send(err);
		console.log('Error! ', err);
	})
})

//Delete Project document by _id
app.delete('/api/projects/:project_id', function (req, res) {
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
app.put('/api/projects/:project_id', function (req, res) {
	// res.json(req.body)
	Project.update( 
		{"_id": req.params.project_id}, 
		{'$set':
		{"projectName" : req.body.projectName,
		"description:" : req.body.description,
		"startDate" : req.body.startDate,
		"quantity" : req.body.quantity,
		"timeUnits" : req.body.timeUnits,
		// mstoneIds in the array need to be modified in separate call.
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
app.post('/api/projects/mstoneId/:project_id/:mstone_id', function (req,res){
	Project.update(
		{"_id": req.params.project_id},
		{ 
			"$push": 
			{"mstoneIds" : 
			{"mstoneId": req.params.mstone_id}
		}}).then((project) => {
			res.json(project);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	//Delete an existing Project mstoneId 
	app.delete('/api/projects/mstoneId/:project_id/:mstone_id', function (req,res){
		Project.update({'_id': req.params.project_id}, 
		{
			'$pull': 
			{
				'mstoneIds': 
				{'mstoneId': req.params.mstone_id}
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
	app.put('/api/projects/mstoneId/:project_id/:mstoneId', function (req,res){
		Project.update({'_id': req.params.project_id, "mstoneIds.mstoneId":req.params.mstoneId}, 
		{
			'$set': 
			{'mstoneIds.$.mstoneId': req.body.newmstoneId}
		}).then((project) => {
			res.json(project);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	//Get milestone array from Project document by requested _id
	app.get('/api/projects/mstoneId/:project_id', (req, res) => {
		Project.findById(req.params.project_id)
		.then((project) => {
			res.json(project.mstoneIds);
			console.log(project)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	
	//MILESTONES Critera
	
	
	//Show all milestone docs in collection
	app.get('/api/mstones', (req,res) => {
		Milestone.find({}).then(eachOne => {
			res.json(eachOne);
		})
	})
	
	//Create new milestone document from data
	app.post('/api/mstones', function (req, res) {
		// res.json(req.body)
		Milestone.create({
			"mstoneName":	req.body.mstoneName,
			"length": req.body.length, //ISODate format
			"owner": req.body.owner, //Name of milestone owner
			"description": req.body.description,
			"startDate": req.body.startDate //ISODate format
			// Tasks are be created in separate call.
		})
		.then((milestone) => {
			res.json(milestone);
			console.log(milestone)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	//Get complete milestone document by requested _id
	app.get('/api/mstones/:mstone_id', (req, res) => {
		Milestone.findById(req.params.mstone_id)
		.then((milestone) => {
			res.json(milestone);
			console.log(milestone)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	//modify Milestone document by _id
	app.put('/api/mstones/:mstone_id', (req, res) => {
		// res.json(req.body)
		Milestone.update( 
			{"_id": req.params.mstone_id}, 
			{'$set':
			{
				"mstoneName":	req.body.mstoneName,
				"length": req.body.length, //ISODate format
				"owner": req.body.owner, //Name of milestone owner
				"description": req.body.description,
				"startDate": req.body.startDate //ISODate format
				// Tasks are be modified in separate call.
			}
		})
		.then((milestone) => {
			res.json(milestone);
			console.log(milestone)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	
	//Delete Milestone document by _id
	app.delete('/api/mstones/:mstone_id', function (req, res) {
		// res.json(req.body)
		Milestone.remove({"_id": req.params.mstone_id })
		.then((milestone) => {
			res.json(milestone);
			console.log(milestone)
		}).catch((err) => {
			res.send(err);
			console.log('Error! ', err);
		})
	})
	
	
	//Write a new task to a specific Milestone document based on milestone _id
	app.post('/api/mstones/task/:mstone_id', function (req,res){
		Milestone.update(
			{"_id": req.params.mstone_id},
			{ 
				"$push": 
				{
					"tasks" :
					{
						"taskName": req.body.taskName,
						"taskDescription": req.body.taskDescription,
						"taskLength":	req.body.taskLength, //length of miestone in milliseconds (ISODate)
						"startDate": req.body.startDate	
					}
				}
			})
			.then((milestone) => {
				res.json(milestone);
				console.log(milestone)
			}).catch((err) => {
				res.send(err);
				console.log('Error! ', err);
			})
		})
		
		
		//Modify an existing Milestone task by task _id. Must have newmstoneId in sent params
		app.put('/api/mstones/tasks/:mstone_id/:task_id', function (req,res){
			Milestone.update({'_id': req.params.mstone_id, "tasks._id":req.params.task_id}, 
			{
				'$set': 
				{
					"tasks.$.taskName": req.body.taskName,
					"tasks.$.taskDescription": req.body.taskDescription,
					"tasks.$.taskLength":	req.body.taskLength, //length of milestone in milliseconds (ISODate)
					"tasks.$.startDate": req.body.startDate	
				}
			}).then((milestone) => {
				res.json(milestone);
				console.log(milestone)
			}).catch((err) => {
				res.send(err);
				console.log('Error! ', err);
			})
		})
		
		//Delete an existing Milestone task by task _id
		app.delete('/api/mstones/tasks/:mstone_id/:task_id', function (req,res){
			Milestone.update({'_id': req.params.mstone_id}, 
			{
				'$pull': {
					'tasks': { 
						'_id': req.params.task_id
					}
				}})
				.then((milestone) => {
					res.json(milestone);
					console.log(milestone)
				}).catch((err) => {
					res.send(err);
					console.log('Error! ', err);
				})
			})
			
			//Get full task array from Milestone document by requested _id
			app.get('/api/mstones/tasks/:mstone_id', (req, res) => {
				Milestone.findById(req.params.mstone_id)
				.then((milestone) => {
					res.json(milestone.tasks);
					console.log(project)
				}).catch((err) => {
					res.send(err);
					console.log('Error! ', err);
				})
			})
			
			
			//Return a single milestone task by task_id
			//Get task array from Milestone document by requested _id
			app.get('/api/mstones/task/:task_id', (req, res) => {
				Milestone.find(
					{'tasks._id': req.params.task_id},
					{_id:0, 'tasks.$' : 1}
					)
					.then((task) => {
						res.json(task);
						console.log(project)
					}).catch((err) => {
						res.send(err);
						console.log('Error! ', err);
					})
				})
				
				
				
				app.listen(3000);
				console.log('Starting Mongo Test Application');
				