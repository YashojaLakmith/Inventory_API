const notFound404 = (req, res) => res.status(404).send('Route does not exist..');


module.exports = notFound404;