const mysql = require('mysql'); 
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: 5432,
  database: process.env.DATABASE,
  ssl: { rejectUnauthorized: false }
});


exports.start = pool;