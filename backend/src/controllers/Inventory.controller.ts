import { Request, Response } from 'express';
import InventoryService from '../services/InventoryService';

class InventoryController {
  // --- 1. CREATE ---
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const itemData = req.body;

      // ✅ Require image on creation
      if (!req.file) {
        return res.status(400).json({ message: 'Item image is required' });
      }

      // Save relative path like "uploads/filename.jpg"
      if (req.file) {
        const imagePath = `uploads/${req.file.filename}`;
        itemData.itemImage = imagePath;
      }

      const item = await InventoryService.createItem(itemData);
      return res.status(201).json(item);
    } catch (error) {
      console.error('❌ Create Error:', error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  // --- 2. READ ALL ---
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const items = await InventoryService.getAllItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  // --- 3. READ BY ID ---
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const itemId = req.params.id;
      const item = await InventoryService.getItemById(itemId);
      return res.status(200).json(item);
    } catch (error) {
      return res.status(404).json({
        message:
          error instanceof Error ? error.message : 'Item not found or invalid ID',
      });
    }
  }

  // --- 4. UPDATE ---
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const itemId = req.params.id;
      const itemData = req.body;

      // ✅ Only update image if a new file is uploaded
      if (req.file) {
        const imagePath = `uploads/${req.file.filename}`;
        itemData.itemImage = imagePath;
      }

      const updatedItem = await InventoryService.updateItem(itemId, itemData);
      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error('❌ Update Error:', error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  // --- 5. DELETE ---
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const itemId = req.params.id;
      await InventoryService.deleteItem(itemId);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({
        message:
          error instanceof Error ? error.message : 'Item not found or invalid ID',
      });
    }
  }
}

export default new InventoryController();
