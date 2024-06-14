const { Pool } = require('pg');

// Load environment variables from a .env file if it exists
require('dotenv').config();

const password = process.env.DB_PASSWORD;

if (typeof password !== 'string') {
    throw new Error('Database password must be a string');
}

console.log('DB_USER:', process.env.DB_USER); // Debugging
console.log('DB_HOST:', process.env.DB_HOST); // Debugging
console.log('DB_NAME:', process.env.DB_NAME); // Debugging
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'undefined'); // Debugging
console.log('DB_PORT:', process.env.DB_PORT); // Debugging

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
//Adjust the timestamp value to fit within the valid range
const unixTimestampInMilliseconds = 1718304653375;
const maxAllowedValue = 2147483647000;
const adjustedTimestamp = Math.min(unixTimestampInMilliseconds, maxAllowedValue);
const timestamp = new Date(adjustedTimestamp);



const query = 'INSERT INTO admin_invitations (timestamp_column) VALUES ($1)';
const values = [timestamp];

pool.query(query, values, (err, res) => {
  if (err) {
    console.error('Error inserting record:', err);
  } else {
    console.log('Record inserted successfully');
  }
});
// Function to test the database connection
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
  }
};

// Call the testConnection function
testConnection();

module.exports = pool;
