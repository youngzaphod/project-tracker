const mongoose = require("mongoose");
const Story = require("../models/story");
const Author = require("../models/author");
const shortid = require('shortid');
require('dotenv').config();

const dbURL =
  "mongodb+srv://" + process.env.DB_NAME + ":" + process.env.DB_PASS + "@clusterfuck-wglwx.mongodb.net/" +
    process.env.COLLECTION + "?retryWrites=true";

mongoose.connect(dbURL, { useNewUrlParser: true }, err => {
    console.log("Attempted mongodb connection...");
    if (err) {
        console.log("DB connection error: ", err);
    } else {
        console.log("Connection successful");
    }
});


let authorTrack = {};
Story.find({}).then(stories => {
    stories.forEach(story => {
        for(let i =0; i < story.authors.length; i++) {
            if (!authorTrack[story.authors[i]]) {
                authorTrack[story.authors[i]] = [];
            }
            authorTrack[story.authors[i]].push(story._id);
        }
    });
}).then(() => {
    const keys = Object.keys(authorTrack);
    console.log("Keys:", keys);

    for (let [email, stories] of Object.entries(authorTrack)) {
        console.log(`${email} has ${stories.length} stories:`);
        Author.create({
            email: email,
            passID: shortid.generate(),
            contribution: true,
            completion: true,
            stories: stories,
            username: 'Anon' + shortid.generate().replace(/\W/g, ''),
            dateCreated: Date.now()

        }).then(author => {
            console.log(`Author created successfully ${author.email}. Username ${author.username} with ${author.stories.length} stories` );
        }).catch(err => {
            console.log("Error creating author", err);
        });
    }
}).catch(err => {
    console.log("Error finding stories", err);
});