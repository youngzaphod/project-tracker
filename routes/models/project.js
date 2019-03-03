const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// const proPlanSchema = new Schema({
// 	activity_name: String,
// 	quantity: Number}, 
// 	{
// 		timestamps: true	
// 	});

//TODO Add Schema.Types.ObjectId to replace string value.
const mstoneSchema = new Schema ({
	mstoneId: String
})

const projectSchema = new Schema({
	projectName: String,
	description: String,
	startDate: Number,
	quantity: Number,
	timeUnits: String,
	mstoneIds: [mstoneSchema]
}, 
{
	timestamps: true	
});

const project = mongoose.model('project', projectSchema);

module.exports = project;