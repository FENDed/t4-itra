const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    if(req.user) {
      res.render('index', {
        user: req.user,
        users: req.users
      });
    }else 
      res.status(200).redirect("/login");

  });

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;