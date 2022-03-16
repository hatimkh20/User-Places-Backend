const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/user-controllers');

router.get('/', userControllers.getUsers);

router.post('/login', userControllers.login);

router.post('/signup', userControllers.signup);

module.exports = router;