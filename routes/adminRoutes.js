const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: API for admins
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Log in to their own admin dashboard
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: View their own admin dashboard
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.getDashboard);

/**
 * @swagger
 * /admin/words:
 *   get:
 *     summary: View and manage words in their own dashboard
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of words
 *       401:
 *         description: Unauthorized
 */
router.get('/words', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.getWords);

/**
 * @swagger
 * /admin/words:
 *   post:
 *     summary: Add new words
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Word'
 *     responses:
 *       201:
 *         description: Word added successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/words', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.addWord);

/**
 * @swagger
 * /admin/words/{id}:
 *   put:
 *     summary: Edit existing words
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Word ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Word'
 *     responses:
 *       200:
 *         description: Word updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Word not found
 */
router.put('/words/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.editWord);

/**
 * @swagger
 * /admin/words/{id}:
 *   delete:
 *     summary: Delete words
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Word ID
 *     responses:
 *       200:
 *         description: Word deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Word not found
 */
router.delete('/words/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.deleteWord);

/**
 * @swagger
 * /admin/requests:
 *   get:
 *     summary: View and manage user requests in their own dashboard
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.getRequests);

/**
 * @swagger
 * /admin/requests/{id}:
 *   put:
 *     summary: Update the status of a request
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the request
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.put('/requests/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.updateRequestStatus);

/**
 * @swagger
 * /admin/account:
 *   get:
 *     summary: View their own account information
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account information
 *       401:
 *         description: Unauthorized
 */
router.get('/account', [authMiddleware.verifyToken, authMiddleware.isAdmin], adminController.getAccountInfo);
// Apply middleware to protect routes
router.use(verifyToken);
router.use(isAdmin);
module.exports = router;
