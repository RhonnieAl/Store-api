## Store API

This is a store api NodeJS appliaction that provides database search options for
web-store users based on product name, product category, pricing, etc.

This setup will allow the Frontend to only send HTTP calls for the data.

Project is Setup to practice database query functionality.

Postman is used to test the endpoints instead of building a frontend for the
tests.

![Postman Endpoint Tests](https://github.com/RhonnieAl/Store-api/blob/master/screenshots/Screenshot1.png)

## Project Setup

Run `npm install` to install node dependencies

Run `npm start` to kickstart server.

In order to run the project, setup .env and set MONGO_URI variable equal to DB
connection string.

In order to avoid port collisions, port 3000 is used, feel free to change it.

## REST API Endpoints

- `/api/v1/products` - Run all query params on this endpoint

## Valid Query Params

`name` - Search products by a specific name (search part of the name)

`company` - Search products by company brand (Ikea, JYSK, Isku, Masku)

`featured` - Search products on featured ('true') or not featured ('false)

`sort` - Determin which property the returned products should be sorted by
(price, name, rating, date, company, featured)

`fields` - Select only the product properties you wish to view (price, name,
rating, date, company, featured)

`limit` - Determin how many products you want to retrieve

`page` - Select the page number you wish to view

`numericFilters` - Search and Filter catalogue by "Price" and "Rating"

### Error Handling

Errors are caught globally using middleware `error-handler.js` with the help of
library
[express-async-errors](https://www.npmjs.com/package/express-async-errors) for
catching Async Errors. The library throws any async error without having to pass
it to the next middleware as native Express does.

Instead of writing an Async-wrapper function with try-catch and next(), we throw
the error with the help of `express-async-errors` to our custom error handler in
`error-handler.js` and there do anything, for example show it on the console or
return a message on the browser.

### DB

MongoDB was auto populated with initial data using a Script in the file
`populate.js`.

```js
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // Delete any data that is currently in DB (optional)
    await Product.deleteMany();
    // Create and populate DB with initial data from jsonProducts.js
    await Product.create(jsonProducts); // Where the magic happens
    console.log("Sucess!!");
    // Once done, Close connection.
    process.exit(0); // Passing 0 means success
  } catch (error) {
    console.log(error);
    process.exit(1); // Passing 1 means error
  }
};
start();
```

### DB Search Functionality

In Mongoose V5 an empty array is returned for queries that do not match the
accepted Schema. To account for this, destructured needed queries

`controllers` >> `products.js`

```js
const { featured, company, name } = req.query;
```

and passed an empty object into `.find()` so as not to return epmty array to the
user.

Mongoose V6 takes care of this nateively by ignoreing erroneous queries.

To allow users to serach part of name string instead of typing full product
name, MongoDB
[Regex](https://www.mongodb.com/docs/manual/reference/operator/query/regex/#-regex)
query operators were used.

```js
// regex: case incensitive and allows partial name input
{ $regex: name, $options: "i" }
{ $regex: company, $options: "i" }
```

### DB Sort Functionality

This functionality enables the user to sort data in by any order according name,
date, price, featured, company and rating.

By default MongoDB documents in a collection are sorted by date created.

To apply the `.sort()` functionality, the method is cahined as shown on
[Mongoose Docs](<https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()>).

As a rule `.sort()` method is applied on an Object query and not the resolved
result of a query i.e

- Using a method on the Model with `await` returns the resolved result of a
  query.

- Using a method on the Model without `await` returns an object (a Query
  object), not the result of a query.

```js
const { item, sort } = req.query;
result = Product.find(item);
if (sort) {
  sortList = sort.split(",").join(" ");
  result = result.sort(sortList);
} else {
  result = result.sort("createdAt");
}
const products = await result;
res.status(200).json({ products });
```

### DB Select Functionality

This functionality enables a user to select certain fields such as name and
price. Returning only data with name and price.

According to
[Mongoose Docs](<https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()>),
the method is `.select()`

Similarly to sort functionality:

```js
// Select
if (fields) {
  fieldList = fields.split(",").join(" ");
  result = result.select(fieldList);
}

const products = await result;
```

### DB Pageination Functionality

This functionality allows the user to request a specified certian page if the
number of items returned are numerous.

The user also has the ability to determin how many items a single page should
have.

To achieve this the following methods were used: `.limit()` : determins how many
results are returned

`.select()` : determins how many returned items are cut off. if you select(5) it
will return from 6 and over.

`.skip()` : specifies the number of documents to skip in the filtered collection
according to
[Mongoose Skip docs](<https://mongoosejs.com/docs/api/query.html#Query.prototype.skip()>)

```js
// Extract user-given page number or default to 1
const page = Number(req.query.page) || 1;
// Extract user-given num of items requested or default to 10
const limit = Number(req.query.limit) || 10;
// set number of documents in collection to be skipped
const skip = (page - 1) * limit;

// If skip is zero page num begins from page 1 and returns items by limit given
result = result.skip(skip).limit(limit);

const products = await result;
```

### DB Search by Price and Rating Functionality

This functionality allows the user to search and filter catalogue based on
`price` or `rating` or both.

According to
[MongoDB docs](https://www.mongodb.com/docs/manual/reference/operator/query/),
regex such as `gt` and `gte` are the only accepted comparison operators, instead
of basic comparison operators (eg: <, >, =<, >=).

```js
if (numericFilters) {
  // Object to map all user input operators to regex ones
  const operatorMap = {
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "<": "$lt",
    "<=": "$lte",
  };
  // Find all occurences of user input operators
  const regEx = /\b(<|>|>=|=|<|<=)\b/g;

  // Replace all occurences in "numericFilters" with regex ones
  // "filters" is string with swapped operators
  let filters = numericFilters.replace(
    regEx,
    (match) => `-${operatorMap[match]}-`
  );

  const options = ["price", "rating"];
  // Split up the numeric queries passed by the user
  filters = filters.split(",").forEach((queryItem) => {
    // Destructure and name
    const [field, operator, value] = queryItem.split("-");
    // Restricing DB fields this fuction applies to
    if (options.includes(field)) {
      queryObject[field] = { [operator]: Number(value) };
    }
  });
}
```
