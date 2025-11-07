import { Router } from 'express';
import InventoryController from '../controllers/Inventory.controller';
import authMiddleware from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware'; // handles multer config

const router = Router();

// ✅ All routes require authentication
router.use(authMiddleware);

// ✅ CREATE: Add new inventory item
router.post('/', upload.single('itemImage'), InventoryController.create);

// ✅ READ: Get all inventory items
router.get('/', InventoryController.getAll);

// ✅ READ: Get single item by ID
router.get('/:id', InventoryController.getById);

// ✅ UPDATE: Update item + optional new image
router.put('/:id', upload.single('itemImage'), InventoryController.update);

// ✅ DELETE: Delete item
router.delete('/:id', InventoryController.delete);

export default router;
