require("dotenv").config();
// Handle async errors
require("express-async-errors");

const express = require("express");
const app = express();

// Import DB connection
const connectDB = require("./db/connect");

//Import router
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const { connect } = require("mongoose");

/* Middleware */
// Handle all incoming and outgoing JSON data using this Express middleware
app.use(express.json());

//Routes

// Test route for Homepage (To be changed later)
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "<h1>Welcome to the Store-api app</h1><p>You have succesfully connected to the Backend</p><p>To fully Test, use Postman and point to following endpoint: /api/v1/products </p><a href='/api/v1/products'>Click here to see all Products JSON</a>"
    );
});

// Set up endpoint
app.use("/api/v1/products", productsRouter);

// Set up error handlers middlware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Set up server port to be set by VPS or default to 3000
const port = process.env.PORT || 3000;

// Start Server
const start = async () => {
  try {
    // connectDB
    // we're able to feed URLs from hidden files because we imported dotenv module
    await connectDB(process.env.MONGO_URI);

    // Kickstart server after successful DB connection
    app.listen(port, () => {
      console.log(`Server is Listening on Port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
