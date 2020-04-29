const mongoose = require("mongoose");
require('./connectDB')(mongoose);

//Bring in models from external file
const Story = require("../models/story");
console.log("Running AddSpace.js");

Story.find({'_id': '5ea9fa7baedf5e2274955b21'}, { "segments": 1})
.then(items => {
    console.log("Got all segments, begin processing");
    items.forEach(item => {
        item.segments.forEach(seg => {
            seg.content += '\n\n';
        });
        Story.updateOne({_id: item._id }, {segments: item.segments})
        .then(res => {
            console.log(`Updated ${item._id}`);
        })
        .catch(err => {
            console.log(`Error updating ${item._id}: ${err}`);
        });
    });
})
.catch(err => {
    console.log('Error updating segments: ', err);
});