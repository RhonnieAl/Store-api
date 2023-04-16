## Store API

This is a store api Node appliaction that provides database search options for
the store users based on product name, product category, pricing, etc.

This setup will allow the Frontend to only send HTTP calls for the data.

### Error Handling

Errors are caught globally using middleware `error-handler.js` with the help of
library
[express-async-errors](https://www.npmjs.com/package/express-async-errors) for
catching Async Errors. The library throws any async error without having to pass
it to the next middleware as native Express does.

Instead of writing our own Asyncwrapper functions with try-catch and next(), we
throw the error with the help of `express-async-errors` to our custom error
handler in `error-handler.js` and there do anything, for example show it on the
console or return a message on the browser.

### DB

Mongo DataBase was auto populated with initial data using a Script in the file
`populate.js`. Connection to DB was closed after successful run.

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
```
