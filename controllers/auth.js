const mysql = require('mysql'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../model/db');
const { promisify } = require('util');


exports.register = (req, res) => {
    
    const { name, email, password, passwordConfirm } = req.body;

    db.start.query('SELECT email FROM users WHERE email = $1', [email], async (error, result) => {
        if(error) {
            console.log(error);
        }

        if(result.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }


        let hashedPassword = await  bcrypt.hash(password, 8);
        
        db.start.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword], (error, result) => {
          if(error) {
            console.log(error);
          } else {
            db.start.query('SELECT id FROM users WHERE email = $1', [email], (error, result) => {
              const id = result.rows[0].id;
              const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
              });
    
              const cookieOptions = {
                expires: new Date(
                  Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
              };
              res.cookie('jwt', token, cookieOptions);
    
              res.status(201).redirect("/");
            });
          }
        });
    });
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).render("login", {
        message: 'Please provide email and password'
      });
    }

    db.start.query("SELECT * FROM users WHERE email = $1", [email], async (error, results) => {
      if(results.length == 0 || undefined) {
        return res.status(401).render("login", {
          message: 'Please, enter correct email and password'
        });
      }
      
      const isMatch = await bcrypt.compare(password, results.rows[0].password);
      if(!results || !isMatch ) {
        return res.status(401).render("login", {
          message: 'Incorrect email or password'
        });
      } else {
        if(results.rows[0].isbanned == 'No') {
          const id = results.rows[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          });
    
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          };
          res.cookie('jwt', token, cookieOptions);
    
          res.status(200).redirect("/");
        }else {
          return res.status(401).render("login", {
            message: 'You are banned!'
          });
        }
      }
    });
  };

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        db.start.query('SELECT * FROM users', [], (error, result) => {
          if(!result) {
            return next();
          }
          req.users = result.rows;
        });

        db.start.query('SELECT * FROM users WHERE id = $1', [decoded.id], (error, result) => {
          if(!result) {
            return next();
          }
          req.user = result.rows[0];
          return next();
        });
      } catch (err) {
        return next();
      }
    } else {
      next();
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/login");
};