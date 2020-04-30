const mongoose = require("mongoose");

const collection = 'FNPproduction';

const dbURL =
  "mongodb+srv://" + process.env.DB_NAME + ":" + process.env.DB_PASS + "@clusterfuck-wglwx.mongodb.net/" +
    collection + "?retryWrites=true";

mongoose.connect(dbURL, { useNewUrlParser: true }, err => {
    console.log("Attempted mongodb connection...");
    if (err) {
        console.log("DB connection error: ", err);
    } else {
        console.log("Connection successful");
    }
});

//Bring in models from external file
const Story = require("../models/story");
console.log("Running AddSpace.js");

Story.find({}, { "segments": 1})
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