const mongoose = require('mongoose');

const Project = mongoose.model('Project', {
    _id: mongoose.Schema.Types.ObjectId,
    projectName: String,
    startDate: Date,
    timeUnits: String,
    description: String,
    mstoneIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }]
});

module.exports = Project;