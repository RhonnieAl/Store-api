## Store API

This is a store api Node appliaction that provides database search options for
the store users based on product name, product category, pricing, etc.

This setup will allow the Frontend to only send HTTP calls for the data.

### Error Handling

Errors are caught globally using middleware `error-handler.js` with the help of
library[express-async-errors](https://www.npmjs.com/package/express-async-errors)
for catching Async Errors. The library throws any async error without having to
pass it to the next middleware as native Express does.

Instead of writing our own Asyncwrapper functions with try-catch and next(), we
throw the error with the help of `express-async-errors` to our custom error
handler in `error-handler.js` and there do anything, for example show it on the
console or return a message on the browser.

### DB

Mongo DataBase was auto populated with initial data using a Script in the file
`populate.js`. Connection to DB was closed after successful run.
