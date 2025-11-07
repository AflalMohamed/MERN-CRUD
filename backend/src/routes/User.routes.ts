import { Router } from 'express';
import UserController from '../controllers/User.controller';
import authMiddleware from '../middleware/auth.middleware'; // <-- Protector (Authentication Guard)
import upload from '../middleware/upload.middleware';

const router = Router();

// Run the protector (authMiddleware) *before* accessing the profile routes
router.use(authMiddleware);

// GET /api/users/profile
router.get('/profile', UserController.getMyProfile);

// PUT /api/users/profile
router.put('/profile', upload.single('profilePicture'),UserController.updateMyProfile);

export default router;
