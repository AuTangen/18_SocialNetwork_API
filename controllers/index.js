const router = require('express').Router();
const userRoutes = require('./userController');
const thoughtRoutes = require('./thoughtController')


router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;