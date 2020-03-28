const mongoose = require('mongoose');
let Schema = mongoose.Schema;


const segmentSchema = new Schema({
	author: String,	//Email address
	content: String,																							
	order: Number
})

const storySchema = new Schema({
	title:	String,
	isPublic: Boolean,
	complete: Boolean,
	segments: [segmentSchema],
	segCount: Number,
	lastUpdate: Date,
	locked: Boolean,
	rounds: Number
})

const story = mongoose.model('story', storySchema);

module.exports = story;
