const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskName: String,
    startDate: Date,
    taskLength: Number,
    taskDescription: String
});

const Milestone = mongoose.model('Milestone', {
    _id: mongoose.Schema.Types.ObjectId,
    mstoneName: String,
    startDate: Date,
    length: Number,
    description: String,
    owner: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    tasks: [taskSchema]
});

module.exports = Milestone;