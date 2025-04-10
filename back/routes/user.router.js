const express = require('express');
const userController = require("../controller/user.controller");
const ensureAuthenticated = require('../middleware/auth.middleware'); 
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', ensureAuthenticated, userController.getMe);
router.post('/logout', userController.logout);

module.exports = router;