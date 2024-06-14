const pool = require('../config/database');

class UserRequest {
    static async create({ word, suggestion, status }) {
        const query = `
            INSERT INTO user_requests (word, suggestion, status, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING *;
        `;
        const values = [word, suggestion, status];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating user request: ${error}`);
        }
    }
}

module.exports = UserRequest;
