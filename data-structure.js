const mongoose = require("mongoose");
//Connect to mongodb "protrack-app"
mongoose.connect('mongodb://localhost:27017/protrack-app', { useNewUrlParser: true });

const protrackSchema = new mongoose.Schema({
	name: String,
	duedate: String,
	status: String,

})

// This is creating (or opening) the ProTrack schema that has all the methods attached.
// Collection name will be Milestones
const Milestone = mongoose.model("Milestone", protrackSchema);

// let writeme = new Milestone({
// 	name: "Test2",
// 	duedate: "02/25/2019",
// 	status: "overdue",
// 	tasks: {
// 		name: "Call Harry",
// 		taskdate: "03/01/2019",
// 		status: "on time",
// 		order: 3,
// 		description: 'testing out the list'
// 	}
// })

// writeme.save((err, Milestone) => {
// 	if (err) {
// 		console.log(`Something went wrong`)
// 	} else {
// 		console.log(`Test is saved to the db`);
// 		console.log(Milestone);
// 	}
// });

//retrieve all records from model.

// Milestone.find({}, (err, milestones) => {
// 	if(err) {
// 		console.log(`An ERROR has occured`);
// 		console.log(err)
// 	} else {
// 		console.log("")
// 		console.log(milestones);
// 	}
// });

Milestone.create({
	name: "Test4",
 	duedate: "03/25/2019",
 	status: "on-time",
}, (err,newMStone) => {
	if (err) {
		console.log(`An ERROR has occured`);
	} else {
		console.log(newMStone);
	}
});

// //retrieve all cats from the DB and console.log them.

// Tasklist.find({}, (err, Milestones) => {
//     if(err) {
//         console.log("ERROR ERROR!!!");
//         console.log(err);
//     } else {
//         console.log("See all my Milestones and despair:");
//         console.log(cats);
//     }
// })