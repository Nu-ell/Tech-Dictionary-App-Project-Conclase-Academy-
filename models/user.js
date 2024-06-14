const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create({ name, email, password, role = 'General' }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, role]
        );
        return result.rows[0];
    }

    static async createAdmin({ name, email, password }) {
        return await this.create({ name, email, password, role: 'Admin' });
    }

    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async authenticate(email, password) {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    // Other static methods for fetching users, updating, deleting, etc.
}

module.exports = User;
