const router = require('express').Router();
const responseOnNonexistentRoute = require('../controllers/nonexistent');

router.get('*', responseOnNonexistentRoute);
router.delete('*', responseOnNonexistentRoute);
router.post('*', responseOnNonexistentRoute);
router.patch('*', responseOnNonexistentRoute);
router.put('*', responseOnNonexistentRoute);

module.exports = router;
