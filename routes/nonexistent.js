const router = require('express').Router();
const responseOnNonexistentRoute = require('../controllers/nonexistent');

router.all('*', responseOnNonexistentRoute);

module.exports = router;
