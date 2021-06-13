const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require('./../../config')

mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("error", () => {
    console.log("> Error occurred connecting to the database");
});
mongoose.connection.once("open", () => {
    console.log("> Successfully connected to the database");
});

module.exports = mongoose;


