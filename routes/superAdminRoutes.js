const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const authMiddleware = require('../middleware/authMiddleware');
const oauthController = require('../controllers/oauthController');
const { verifyToken, isSuperAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: SuperAdmin management and dashboard
 */

/**
 * @swagger
 * /superadmin/login:
 *   post:
 *     summary: Log in to the SuperAdmin dashboard
 *     tags: [SuperAdmin]
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
router.post('/login', superAdminController.login);

/**
 * @swagger
 * /superadmin/dashboard:
 *   get:
 *     summary: View the SuperAdmin dashboard
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SuperAdmin dashboard data
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', authMiddleware.verifyToken, superAdminController.getDashboard);

/**
 * @swagger
 * /superadmin/admins:
 *   get:
 *     summary: View and manage all admins
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       401:
 *         description: Unauthorized
 */
router.get('/admins', authMiddleware.verifyToken, superAdminController.getAdmins);

// Route to delete an admin by ID
/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags:
 *       - SuperAdmin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the admin to delete
 *     responses:
 *       '200':
 *         description: Admin deleted successfully
 *       '404':
 *         description: Admin not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/admins/:id', superAdminController.deleteAdmin);

/**
 * @swagger
 * /superadmin/admins:
 *   post:
 *     summary: Invite a new admin
 *     tags: [SuperAdmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user to invite as admin
 *                 example: newadmin@example.com
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invitation sent successfully.
 *       400:
 *         description: Admin with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Admin with this email already exists.
 *       500:
 *         description: Failed to send invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send invitation.
 */
router.post('/admins', authMiddleware.verifyToken, superAdminController.inviteAdmin);
router.get('/verify-invitation-token', superAdminController.verifyInvitationToken);
router.post('/register', superAdminController.registerAdmin);
// OAuth callback route
/**
 * @swagger
 * /oauth/callback:
 *   get:
 *     summary: OAuth callback endpoint
 *     description: Handle the OAuth callback and process the authorization code
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The authorization code returned by the OAuth provider
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *         description: The state parameter returned by the OAuth provider
 *     responses:
 *       200:
 *         description: Successfully processed the OAuth callback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OAuth callback handled successfully
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request parameters
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the OAuth callback
 */

router.get('/oauth/callback', oauthController.oauthCallback);
/**
 * @swagger
 * /superadmin/analytics:
 *   get:
 *     summary: View and manage analytics
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', authMiddleware.verifyToken, superAdminController.getAnalytics);

/**
 * @swagger
 * /superadmin/words:
 *   get:
 *     summary: View and manage all words
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of words
 *       401:
 *         description: Unauthorized
 */
router.get('/words', authMiddleware.verifyToken, superAdminController.getWords);

/**
 * @swagger
 * /superadmin/requests:
 *   get:
 *     summary: View and manage all user requests
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests', authMiddleware.verifyToken, superAdminController.getRequests);

/**
 * @swagger
 * /superadmin/account:
 *   get:
 *     summary: View their own account information
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account information
 *       401:
 *         description: Unauthorized
 */
router.get('/account', authMiddleware.verifyToken, superAdminController.getAccountInfo);
router.use(verifyToken);
router.use(isSuperAdmin);

module.exports = router;
