const express = require('express');
const authCountroller = require('../controllers/auth');

const router = express.Router();

router.post('/register', authCountroller.register);
router.post('/login', authCountroller.login);

router.get('/logout', authCountroller.logout);

module.exports = router;