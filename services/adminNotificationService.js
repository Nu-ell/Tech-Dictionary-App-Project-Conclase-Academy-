// adminNotificationService.js
const UserRequest = require('../models/userRequest');

class AdminNotificationService {
    static async notifyChangeRequest(word, description) {
        try {
            // Store the request in the database
            await UserRequest.create({
                word,
                type: 'Change',
                description,
                status: 'Pending',
            });
        } catch (error) {
            console.error('Error notifying change request:', error);
            throw new Error('Failed to notify change request');
        }
    }

    static async notifyNewWordRequest(word, description) {
        try {
            // Store the request in the database
            await UserRequest.create({
                word,
                type: 'New',
                description,
                status: 'Pending',
            });
        } catch (error) {
            console.error('Error notifying new word request:', error);
            throw new Error('Failed to notify new word request');
        }
    }
}

module.exports = AdminNotificationService;
