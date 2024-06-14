const Word = require('../models/word'); // Assuming you have a Word model
const Request = require('../models/UserRequest'); // Assuming you have a Request model
const db = require('../config/database');


// Search for words and retrieve word information
exports.searchWords = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const result = await db.query('SELECT * FROM words WHERE term ILIKE $1', [`%${searchTerm}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const { word, suggestion } = req.body;
        const result = await db.query(
            'INSERT INTO user_requests (word, suggestion, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [word, suggestion, 'Open', new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRequestStatus = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM user_requests');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to get recently added words
exports.getRecentlyAddedWords = async (req, res) => {
    try {
        const recentlyAdded = await pool.query('SELECT * FROM words ORDER BY created_at DESC LIMIT 3');
        res.status(200).json(recentlyAdded.rows);
    } catch (error) {
        console.error('Error getting recently added words:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get word details by ID
exports.getWordDetails = async (req, res) => {
    const { wordId } = req.params;
    try {
        const wordDetails = await pool.query('SELECT * FROM words WHERE id = $1', [wordId]);
        if (wordDetails.rows.length === 0) {
            return res.status(404).json({ error: 'Word not found' });
        }
        res.status(200).json(wordDetails.rows[0]);
    } catch (error) {
        console.error('Error getting word details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to request change to a word
exports.requestChangeToWord = async (req, res) => {
    const { wordId, changeRequest } = req.body;
    try {
        await pool.query('INSERT INTO change_requests (word_id, request) VALUES ($1, $2)', [wordId, changeRequest]);
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error submitting change request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to request a new word to be added
exports.requestNewWord = async (req, res) => {
    const { word, meaning, example } = req.body;
    try {
        await pool.query('INSERT INTO new_word_requests (word, meaning, example) VALUES ($1, $2, $3)', [word, meaning, example]);
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error submitting new word request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Function to get a random word from the database
exports.getWordOfTheDay = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM words ORDER BY RANDOM() LIMIT 1');
        const wordOfTheDay = result.rows[0];
        res.status(200).json(wordOfTheDay);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get the top 3 most searched words
exports.getTopLookups = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM words ORDER BY search_count DESC LIMIT 3');
        const topLookups = result.rows;
        res.status(200).json(topLookups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to handle the request to change a word
exports.requestChangeToWord = async (req, res) => {
    try {
        const { word, description } = req.body;

        // Save the request to the database or notify the admins/super admins
         await AdminNotificationService.notifyChangeRequest(word, description);
        
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error submitting change request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to handle the request to add a new word
exports.requestNewWord = async (req, res) => {
    try {
        const { word, description } = req.body;

        // Save the request to the database or notify the admins/super admins
         await AdminNotificationService.notifyNewWordRequest(word, description);
        
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error submitting new word request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};