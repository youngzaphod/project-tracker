
const mongoose = require("mongoose");

//Bring in models from external file
const Story = require("./models/story");

module.exports = io => {

    console.log("io module");
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        // Assume loggedout true until setup is given
        socket.loggedOut = true;
        
        socket.emit("id", socket.id);

        socket.on("setup", data => {
            // When story is loaded on the front end, this data is sent
            socket.storyID = data.storyID;
            socket.loggedOut = data.loggedOut;
        });

        socket.on('startIdle', (typeIdle) => {
            console.log("Starting idle of type: ", typeIdle);
            // Clear timer then start new one when the user is idle
            clearTimeout(socket.timeout);
            if (socket.storyID && !socket.loggedOut) {
                socket.timeout = setTimeout(logOutUser, 5000);
            }
        });

        socket.on('logOut', () => {
            // Sent from front end when logging out happens elsewhere with DB call, like on successful save
            socket.loggedOut = true;
            clearTimeout(socket.timeout);
        });

        socket.on('startActive', () => {
            console.log('Starting active');
            clearTimeout(socket.timeout);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            // Only log out user on disconnect if they were the one editing
            if (!socket.loggedOut && socket.storyID) {
                logOutUser();
            }
            
        });

        const logOutUser = () => {
            console.log("Log out user here");
             Story.findOneAndUpdate(
                { _id: socket.storyID },
                { $set: {locked: false} },
            )
            .then(story => {
                socket.emit("loggedOut", { msg: "Logged out due to inactivity", success: true });
                socket.loggedOut = true;
                //console.log("Unock via Beacon response:", story);
            })
            .catch(err => {
                socket.emit("loggedOut", { msg: err, success: false });
                console.log("Error! ", err);
            });
        }
    });
}