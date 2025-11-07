import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {

  // --- 1. Get Profile Controller ---
  // Retrieves the logged-in user's profile details
  public async getMyProfile(req: Request, res: Response): Promise<Response> {
    try {
      // Remember req.user? The authMiddleware added it for us!
      const userId = req.user?._id; 
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token' });
      }

      // Fetch user details from the service
      const user = await UserService.getProfile(userId.toString());
      return res.status(200).json(user);

    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // --- 2. Update Profile Controller (Update this) ---
  public async updateMyProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token' });
      }
      
      // 1. Get text data from req.body
      const updateData = req.body;

      // 2. Check if a new profile picture was uploaded
      if (req.file) {
        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
        updateData.profilePicture = imagePath; // Add the path to the update data
      }

      // 3. Send all data (text + image path) to the service
      const updatedUser = await UserService.updateProfile(userId.toString(), updateData);
      return res.status(200).json(updatedUser);

    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
