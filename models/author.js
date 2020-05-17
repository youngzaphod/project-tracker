const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const authorSchema = new Schema({
	email:	String,
	username: String,
    stories: [Schema.ObjectId],
	contribution: Boolean,
    completion: Boolean,
    dateCreated: Date
})

const author = mongoose.model('author', authorSchema);

module.exports = author;