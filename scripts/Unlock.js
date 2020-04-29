const mongoose = require("mongoose");
require('./connectDB')(mongoose);

//Bring in models from external file
const Story = require("../models/story");
console.log("Running Unlock.js");

Story.updateMany({ locked: true}, { locked: false })
.then( updatedOnes => {
    console.log('Stories unlocked:');
    console.log(updatedOnes);
}).catch(err => {
    console.log('Error unlocking stories: ', err);
});

