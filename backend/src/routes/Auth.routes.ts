import { Router } from 'express';
import AuthController from '../controllers/Auth.controller'; // Import the Auth Controller

// Create a new Router instance from Express
const router = Router();

// --- Authentication Routes ---

// 1. Register Route
// Request: POST /api/auth/register
// Handler: AuthController.register
router.post('/register', AuthController.register);

// 2. Login Route
// Request: POST /api/auth/login
// Handler: AuthController.login
router.post('/login', AuthController.login);

// 3. Activate Account Route
// Request: GET /api/auth/activate/:token
// Handler: AuthController.activateAccount
router.get('/activate/:token', AuthController.activateAccount);
// ... (imports)
// ... (router.post('/register', ...))
// ... (router.post('/login', ...))
// ... (router.get('/activate/:token', ...))

// 4. Forgot Password Route
// கோரிக்கை: POST /api/auth/forgot-password
// (Body: { "email": "user@example.com" })
router.post('/forgot-password', AuthController.forgotPassword);

// 5. Reset Password Route
// கோரிக்கை: POST /api/auth/reset-password/some-long-token-here
// (Body: { "password": "newPassword123" })
router.post('/reset-password/:token', AuthController.resetPassword);


// Export the router
export default router;
