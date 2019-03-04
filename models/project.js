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
	// ***MODIFIED SCHEMA TO BE AN OBJECT ID REFERENCING MILESTONE****
	// Needed in order to make some requests work
	mstoneIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Milestone'}]
}, 
{
	timestamps: true	
});

const project = mongoose.model('project', projectSchema);

module.exports = project;