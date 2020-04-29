
const mongoose = require("mongoose");

const timeUntilLogout = 30 * 60 * 1000;

//Bring in models from external file
const Story = require("../models/story");

module.exports = io => {

    console.log("io module");
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        // Assume loggedout true until setup is given
        socket.loggedOut = true;
        
        socket.emit("id", socket.id);

        socket.on("setup", data => {
            // When story is loaded on the front end, this data is sent
            console.log("Setup, storyID:", data.storyID);
            console.log("Setup, socket ID:", socket.id);
            socket.storyID = data.storyID;
            socket.loggedOut = data.loggedOut;
        });

        socket.on('startIdle', (typeIdle) => {
            console.log("Starting idle. Type, socket ID:", typeIdle, socket.id);
            // Clear timer then start new one when the user is idle
            clearTimeout(socket.timeout);
            if (socket.storyID && !socket.loggedOut) {
                socket.timeout = setTimeout(logOutUser, timeUntilLogout);
            }
        });

        socket.on('logOut', (msg) => {
            console.log("sockets logOut msg:", msg);
            // Sent from front end when logging out happens elsewhere with DB call, like on successful save
            socket.loggedOut = true;
            clearTimeout(socket.timeout);
        });

        socket.on('startActive', () => {
            console.log('Starting active');
            clearTimeout(socket.timeout);
        });

        // Check and log out if necessary
        const leavePage = (msg) => {
            // Only log out user if they were the one editing
            console.log(msg);
            clearTimeout(socket.timeout);
            if (!socket.loggedOut && socket.storyID) {
                socket.loggedOut = true;
                logOutUser();
            }
        }

        // Do page leave events on disconnect and navigating away
        socket.on('disconnect', () => leavePage("Disconnected"));
        socket.on('leavePage', () => leavePage("Left page"));

        const logOutUser = () => {
            console.log("Log out user here, storyID, socket.id", socket.storyID, socket.id);
             Story.findOneAndUpdate(
                { _id: socket.storyID },
                { $set: {locked: false} },
            )
            .then(story => {
                socket.emit("loggedOut", { msg: "Logged out", success: true });
                socket.loggedOut = true;
                console.log("Successfully logged out");
            })
            .catch(err => {
                socket.emit("loggedOut", { msg: err, success: false });
                console.log("Error! ", err);
            });
        }
    });
}