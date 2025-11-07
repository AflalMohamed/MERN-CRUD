import mongoose, { Schema, Document } from 'mongoose';

// 1. Interface defining how a User Document will look (for TypeScript)
export interface IUser extends Document {
  name: string;
  email: string;
  password: {
    hash: string;
    isHashed: boolean;
  };
  isActivated: boolean;
  profilePicture?: string; // Has the user verified their email?
}

// 2. Mongoose Schema (for MongoDB)
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      // ... (no change)
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    profilePicture: { // <-- 2. இந்த field-ஐச் சேர்க்கவும்
      type: String,
      required: false, // Profile picture is optional
      default: null, // Start with no picture
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
  }
);

// 3. Exporting the Model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
