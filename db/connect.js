// Import Mongoose and connect app to MongoDB
const mongoose = require("mongoose");

// DB connection function (Promise), to be run in app.js
// So as to start server only after successful DB connection, and not the other way round
const connectDB = (url) => {
  return mongoose.connect(url, {
    // These are only to remove annoying logs
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
