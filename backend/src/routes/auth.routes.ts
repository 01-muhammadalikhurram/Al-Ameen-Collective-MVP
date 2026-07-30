import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/auth.validator';

import { authMiddleware } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates the admin and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid username or password
 *       422:
 *         description: Validation error
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get Current User
 *     description: Returns the logged in user based on JWT.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authMiddleware as unknown as RequestHandler, authController.getMe as unknown as RequestHandler);

export { router as authRouter };
