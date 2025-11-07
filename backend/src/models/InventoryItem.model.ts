import mongoose, { Schema, Document } from 'mongoose';

// ================================
// 1. Interface for TypeScript
// ================================
export interface IInventoryItem extends Document {
  itemName: string;
  price: number;
  stock: number;
  itemImage: string; // Image URL or file path stored in DB
  createdAt?: Date;
  updatedAt?: Date;
}

// ================================
// 2. Mongoose Schema Definition
// ================================
const InventoryItemSchema: Schema<IInventoryItem> = new Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },
    itemImage: {
      type: String,
      required: [true, 'Item image is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ================================
// 3. Model Export
// ================================
const InventoryItem = mongoose.model<IInventoryItem>(
  'InventoryItem',
  InventoryItemSchema
);

export default InventoryItem;
