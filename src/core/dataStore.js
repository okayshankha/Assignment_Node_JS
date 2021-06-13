const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING, MONGO_AUTH_SOURCE } = require('./../../config')

mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on("error", () => {
    console.log("> Error occurred connecting to the database");
});
mongoose.connection.once("open", () => {
    console.log("> Successfully connected to the database");
});

module.exports = mongoose;


