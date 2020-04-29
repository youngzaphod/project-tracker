require('dotenv').config();

const dbURL =
  "mongodb+srv://" + process.env.DB_NAME + ":" + process.env.DB_PASS + "@clusterfuck-wglwx.mongodb.net/" +
    process.env.COLLECTION + "?retryWrites=true";


module.exports = mongoose => {
    // Connect to cluster at mongoDB Atlas

    mongoose.connect(dbURL, { useNewUrlParser: true }, err => {
        console.log("Attempted mongodb connection...");
        if (err) {
            console.log("DB connection error: ", err);
        } else {
            console.log("Connection successful");
        }
    });
}