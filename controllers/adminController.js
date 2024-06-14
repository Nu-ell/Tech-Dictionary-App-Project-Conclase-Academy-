const Admin = require('../models/admin');
const Word = require('../models/word');
const Request = require('../models/UserRequest');
const jwt = require('jsonwebtoken');

// Log in to their own admin dashboard
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.authenticate(email, password);
        if (admin) {
            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View their own admin dashboard
exports.getDashboard = async (req, res) => {
    exports.getDashboard = async (req, res) => {
        try {
            // Example of getting data for the dashboard
            const adminId = req.user.id;
            const admin = await Admin.findById(adminId);
            
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
    
            // Example statistics
            const wordCount = await Word.count();
            const requestCount = await Request.count();
            const recentRequests = await Request.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']]
            });
    
            // Construct the dashboard data
            const dashboardData = {
                adminName: admin.name,
                wordCount,
                requestCount,
                recentRequests
            };
    
            res.json(dashboardData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};

// View and manage words in their own dashboard
exports.getWords = async (req, res) => {
    try {
        const words = await Word.findAll();
        res.json(words);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addWord = async (req, res) => {
    const { term, wordClass, meaning, pronunciation, history, example } = req.body;
    try {
        const word = await Word.create({ term, wordClass, meaning, pronunciation, history, example });
        res.status(201).json(word);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editWord = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const word = await Word.update(id, updates);
        if (word) {
            res.json(word);
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteWord = async (req, res) => {
    const { id } = req.params;
    try {
        const word = await Word.delete(id);
        if (word) {
            res.json({ message: 'Word deleted' });
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View and manage user requests in their own dashboard
exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.findAll();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const request = await Request.update(id, updates);
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View their own account information
exports.getAccountInfo = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ error: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
