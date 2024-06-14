// Import necessary modules or dependencies
const { Pool } = require('pg');
const pool = new Pool();

// Define the Token model or class
class Token {
  // Method to store a new token in the database
  static async storeToken(userId, accessToken, refreshToken, expiresAt) {
    try {
      const query = `
        INSERT INTO tokens (user_id, access_token, refresh_token, expires_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
      
      const values = [userId, accessToken, refreshToken, expiresAt];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error storing token: ${error.message}`);
    }
  }

  // Method to retrieve a token from the database by user ID
  static async getTokenByUserId(userId) {
    try {
      const query = 'SELECT * FROM tokens WHERE user_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error retrieving token: ${error.message}`);
    }
  }

  // Additional methods for updating or deleting tokens could be added here
}

// Export the Token model or class for use in other parts of the application
module.exports = Token;
