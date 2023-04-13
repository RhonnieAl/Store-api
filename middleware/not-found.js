// If the route does not exist, send a 404 status code and the following message
const notFound = (req, res) => res.status(404).send("Route does not exist");

module.exports = notFound;
