import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates the admin and returns a JWT token.
 *     tags:
 *       - Admin
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

export { router as authRouter };
