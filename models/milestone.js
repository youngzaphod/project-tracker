const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// const proPlanSchema = new Schema({
// 	activity_name: String,
// 	quantity: Number}, 
// 	{
// 		timestamps: true	
// 	});


const taskSchema = new Schema({
	taskName: String,
	taskDescription: String,																							
	taskLength:	Number, //length of miestone in milliseconds (ISODate)										
	startDate: Number	
})

const milestoneSchema = new Schema({
	mstoneName:	String,
	length: Number, //ISODate format
	owner:	String, //Name of milestone owner
	description: String,
	startDate: Number,
	tasks: [taskSchema]
})

const milestone = mongoose.model('milestone', milestoneSchema);

module.exports = milestone;
