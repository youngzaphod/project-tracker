const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/protrack_app', { useNewUrlParser: true });

const protrackSchema = new mongoose.Schema({
	Name: String,
	duedate: Date, //Definitely need to understand more about date objects.
	tasks: { //This nested object structure still needs to be tested
		name:	String,
		taskdate: Number,
		Status:	String,
		Description: String
	}
})

const ProTrack = mongoose.model("Milestone", protrackSchema);

// ? Somewhere this is creating the 

Milestone.create({
   Name: "Test",
   duedate: ISODate("2019-03-01T01:01:01.001Z"),
   temperament: "Sweet"
}, (err, cat) => {
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

//retrieve all cats from the DB and console.log them.

Tasklist.find({}, (err, cats) => {
    if(err) {
        console.log("ERROR ERROR!!!");
        console.log(err);
    } else {
        console.log("See all my cats and despair:");
        console.log(cats);
    }
})