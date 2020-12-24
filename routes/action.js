const express = require('express');
const authCountroller = require('../controllers/action');

const router = express.Router();

router.post('/delete', authCountroller.delete);

module.exports = router;