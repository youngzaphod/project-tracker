const mongoose = require('mongoose');

const milestone = mongoose.model('milestone', {
    mstoneName: {type: String, required: false},
    startDate: Date,
    length: Number,
    description: String,
    owner: String,
    projectId: String,
    tasks: [{
        taskName: String,
        startDate: Date,
        taskLength: Number,
        taskDescription: String
    }]
});

module.exports = milestone;