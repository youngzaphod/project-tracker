const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const authorSchema = new Schema({
	email:	{ type: String, unique: true, required: true },
	username: { type: String, unique: true },
    passID: { type: String, unique: true },
    stories: [Schema.ObjectId],
	contribution: Boolean,
    completion: Boolean,
    dateCreated: Date
})

const author = mongoose.model('author', authorSchema);

module.exports = author;