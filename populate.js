// Script that automatically populates our database with data from the products.json

require("dotenv").config();

// We will need to make another connection to the DB
const connectDB = require("./db/connect");
// Import mongoose model
const Product = require("./models/product");
// Import the products
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // We will delete any data that is currently in the database (optional). With the help of MOngoose model
    await Product.deleteMany();
    // We then create and populate the database with data from jsonProducts
    await Product.create(jsonProducts);
    console.log("Sucess man!!");
    // Once done, Close our connection. No need to keep connection open.
    process.exit(0); // Passing 0 means success
  } catch (error) {
    console.log(error);
    process.exit(1); // Passing 1 means error
  }
};

start();
