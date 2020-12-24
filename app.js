const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

//dotenv.config({ path: './.env'});
const db = require('./model/db');

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');


db.start.connect((err) => {
    if(err)
        console.log(err);
    else
        console.log('PostgreSQL CONNECTED');
});


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/action', require('./routes/action'));

app.listen(process.env.PORT || 5000, () => {
    console.log('Server started');
})