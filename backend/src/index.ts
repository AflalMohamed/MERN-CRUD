import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path'; 
import express, { Request, Response } from 'express';
import connectDB from './config/db';
import authRoutes from './routes/Auth.routes';
import inventoryRoutes from './routes/Inventory.routes'; // <-- 1. Import Inventory routes
import userRoutes from './routes/User.routes';



// Connect to the database
connectDB();

const app = express();
// --- Middlewares ---

// 2. CORS Middleware-ஐ இங்கே சேர்க்கவும்
// இது 'express.json()' க்கு முன்பாகவோ அல்லது பின்பாகவோ இருக்கலாம், ஆனால் 'routes' க்கு முன்பாக இருக்க வேண்டும்.
app.use(cors({
  origin: 'http://localhost:5173' // <-- 3. நம்முடைய frontend URL-ஐ மட்டும் அனுமதிக்கிறோம்
}));
// Middleware to parse JSON data
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
const PORT = process.env.PORT || 5000;

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes); // Connect Inventory routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
