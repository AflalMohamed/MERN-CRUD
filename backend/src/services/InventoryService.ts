import InventoryItem, { IInventoryItem } from '../models/InventoryItem.model';

class InventoryService {
  /**
   * CREATE: Creates a new inventory item
   */
  public async createItem(itemData: any): Promise<IInventoryItem> {
    const { itemName, price, stock, itemImage } = itemData;

    // 1. Check if an item with the same name already exists
    const itemExists = await InventoryItem.findOne({ itemName });
    if (itemExists) {
      throw new Error('Inventory item with this name already exists');
    }

    // 2. Create a new inventory item
    const newItem = new InventoryItem({
      itemName,
      price,
      stock,
      itemImage, // ✅ include image here
    });

    // 3. Save it to the database
    await newItem.save();
    return newItem;
  }

  /**
   * READ (All): Fetch all inventory items
   */
  public async getAllItems(): Promise<IInventoryItem[]> {
    const items = await InventoryItem.find().sort({ createdAt: -1 });
    return items;
  }

  /**
   * READ (One): Fetch a single item by its ID
   */
  public async getItemById(itemId: string): Promise<IInventoryItem> {
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  /**
   * UPDATE: Update an existing inventory item
   */
  public async updateItem(itemId: string, itemData: any): Promise<IInventoryItem> {
    const item = await this.getItemById(itemId);

    item.itemName = itemData.itemName || item.itemName;
    item.price = itemData.price || item.price;
    item.stock = itemData.stock || item.stock;

    if (itemData.itemImage) {
      item.itemImage = itemData.itemImage; // ✅ update image only if provided
    }

    await item.save();
    return item;
  }

  /**
   * DELETE: Delete an inventory item
   */
  public async deleteItem(itemId: string): Promise<void> {
    const item = await this.getItemById(itemId);
    await item.deleteOne();
  }
}

export default new InventoryService();
