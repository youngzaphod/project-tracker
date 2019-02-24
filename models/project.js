const mongoose = require('mongoose');

const project = mongoose.model('project', {
    projectName: {type: String, required: false},
    startDate: {type: Number, required: false},
    timeUnits: {type: String, required: false},
    description: {type: String, required: false},
    mstoneIds: [{
        _id: {type: String, required: true}
    }]
});

module.exports = project;