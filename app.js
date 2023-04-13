require("dotenv").config();
const express = require("express");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

/* Middleware */
// Handle JSON data using Express middleware
app.use(express.json());

//Routes

// Test route for Homepage (To be changed later)
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "<h2>Hello this is the Home Page</h2><a href='/api/v1/products'>Click here to see all Products</a>"
    );
});

// Set up error handlers middlware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Set up server port to be set by VPS or default to 3000
const port = process.env.PORT || 3000;

// Start Server
app.listen(port, () => {
  console.log(`Server is Listening on Port ${port}...`);
});
