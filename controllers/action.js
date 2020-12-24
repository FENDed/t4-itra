
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../model/db');
const { promisify } = require('util');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

exports.delete = (req, res) => {
    let keys = Object.keys(req.body);
    let btnName = keys.pop();
    let values = Object.values(req.body).slice(0, -1);
    let result = [];

    let cookie = req.cookies;
    let userid;
    jwt.verify(cookie.jwt, process.env.JWT_SECRET, (err, decoded) => {
        userid = decoded.id;
    });    

    for(let i = 0; i < values.length; i++) {
        if(values[i] == 'on') {
            if(userid == keys[i]) {
                res.cookie('jwt', 'loggedout', {
                    expires: new Date(Date.now() + 10 * 1000),
                    httpOnly: true
                });
            }
            result.push(keys[i]);   
        }
    }


    if(btnName == 'delete') {
    
        for(let i = 0; i < result.length; i++) {
            db.start.query('DELETE FROM users WHERE id = $1', [result[i]], async (error, result) => {
                if(error) {
                    console.log(error);
                }
            });
        }
    }

    if(btnName == 'block') {
    
        for(let i = 0; i < result.length; i++) {
            db.start.query("UPDATE users SET isbanned = 'Yes' WHERE id = $1", [result[i]], async (error, result) => {
                if(error) {
                    console.log(error);
                }
            });
        }
    }

    if(btnName == 'unblock') {
    
        for(let i = 0; i < result.length; i++) {
            db.start.query("UPDATE users SET isbanned = 'No' WHERE id = $1", [result[i]], async (error, result) => {
                if(error) {
                    console.log(error);
                }
            });
        }
    }
    console.log(result);
    res.status(201).redirect("/");
}
