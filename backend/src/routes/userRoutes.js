const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const auth = require('./middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;