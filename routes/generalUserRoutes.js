const express = require('express');
const router = express.Router();
const generalUserController = require('../controllers/generalUserController');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware


/**
 * @swagger
 * tags:
 *   name: General Users
 *   description: API for general users
 */

/**
 * @swagger
 * /api/users/words:
 *   get:
 *     summary: Search for words and retrieve word information
 *     tags: [General Users]
 *     parameters:
 *       - in: query
 *         name: search
 *         description: Search term
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved word information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 *       500:
 *         description: Internal server error
 */
router.get('/words', generalUserController.searchWords);


/**
 * @swagger
 * /api/users/words:
 *   post:
 *     summary: Submit a request for a word change or suggestion
 *     tags: [General Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *                 description: The word for which the request is made
 *               suggestion:
 *                 type: string
 *                 description: The suggested change or request
 *     responses:
 *       201:
 *         description: Request submitted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/words', generalUserController.submitRequest);

/**
 * @swagger
 * /api/users/requests:
 *   get:
 *     summary: View the status of their requests
 *     tags: [General Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved request status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRequest'
 *       500:
 *         description: Internal server error
 */
router.get('/requests', generalUserController.getRequestStatus);

/**
 * @swagger
 * /api/recently-added:
 *   get:
 *     summary: Get the top 3 recently added words
 *     tags: [General Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the recently added words
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 *       500:
 *         description: Internal server error
 */
router.get('/recently-added', generalUserController.getRecentlyAddedWords);

/**
 * @swagger
 * /api/word/{wordId}:
 *   get:
 *     summary: Get details of a specific word
 *     tags: [General Users]
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         description: ID of the word to fetch details for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved word details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       404:
 *         description: Word not found
 *       500:
 *         description: Internal server error
 */
router.get('/:wordId', generalUserController.getWordDetails);

/**
 * @swagger
 * /api/request-change:
 *   post:
 *     summary: Request change to a word
 *     tags: [General Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *                 description: The word to request change for
 *               description:
 *                 type: string
 *                 description: Brief info about the section that needs an update
 *     responses:
 *       201:
 *         description: Request submitted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/request-change', generalUserController.requestChangeToWord);

/**
 * @swagger
 * /api/request-new:
 *   post:
 *     summary: Request addition of a new word
 *     tags: [General Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *                 description: The new word to be added
 *               description:
 *                 type: string
 *                 description: Brief info about the meaning and use of the word
 *     responses:
 *       201:
 *         description: Request submitted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/request-new', generalUserController.requestNewWord);

/**
 * @swagger
 * /api/word-of-the-day:
 *   get:
 *     summary: Get a random word of the day
 *     tags: [General Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the word of the day
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       500:
 *         description: Internal server error
 */
router.get('/word-of-the-day', generalUserController.getWordOfTheDay);
/**
 * @swagger
 * /api/top-lookups:
 *   get:
 *     summary: Get the top 3 most searched words
 *     tags: [General Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the top lookups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 *       500:
 *         description: Internal server error
 */
router.get('/top-lookups', generalUserController.getTopLookups);



module.exports = router;
