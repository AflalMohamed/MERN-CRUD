import { Request, Response } from 'express';
import UserService from '../services/UserService'; // Importing our service layer

class AuthController {

  // --- 1. Register Controller ---
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Send the request (req.body) to the service layer (UserService)
      const user = await UserService.registerUser(req.body);

      // 2. Send the service response (user) back to the client
      return res.status(201).json({
        message: 'Registration successful! Please check your email to activate your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      // 3. Handle any service-level errors (e.g., "User already exists")
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // --- 2. Login Controller ---
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Send the request (email, password) to the service layer
      const { user, token } = await UserService.loginUser(req.body);

      // 2. Send the response (user, token) back to the client
      return res.status(200).json({
        message: 'Login successful!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token, // <-- JWT token for authentication
      });
    } catch (error) {
      // 3. Handle errors (e.g., "Invalid credentials", "Account not activated")
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message }); // 401 = Unauthorized
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // --- 3. Activate Account Controller ---
  public async activateAccount(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Get activation token from URL (req.params.token)
      const token = req.params.token;

      // 2. Send token to the service layer (UserService)
      const user = await UserService.activateUser(token);

      // 3. Send a success response
      return res.status(200).json({
        message: 'Account activated successfully!',
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      // 4. Handle errors (e.g., "Invalid or expired token")
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  // --- 4. Forgot Password Controller ---
  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      
      // 1. ஆர்டரை (email) சமையலறைக்கு (UserService) அனுப்புகிறது
      await UserService.forgotPassword(email);

      // 2. பாதுகாப்புக்காக, பிழை ஏற்பட்டாலும், "email sent" என்ற செய்தியையே அனுப்புகிறோம்
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      // Service-ல் பிழை ஏற்பட்டாலும், பயனருக்கு அதைக் காட்ட வேண்டாம்.
      // இது "user enumeration" தாக்குதலைத் தடுக்கும்.
      console.error('Forgot Password Error:', error);
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }
  }

  // --- 5. Reset Password Controller ---
  public async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params; // URL-லிருந்து token-ஐப் பெறுகிறது
      const { password } = req.body; // Body-லிருந்து புதிய password-ஐப் பெறுகிறது

      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      
      // 1. Token மற்றும் புதிய password-ஐ Service-க்கு அனுப்புகிறது
      await UserService.resetPassword(token, password);

      // 2. வெற்றிகரமான பதிலை அனுப்புகிறது
      return res.status(200).json({
        message: 'Password reset successfully! You can now login with your new password.',
      });
    } catch (error) {
      // 3. பிழையைக் கையாளுகிறது (e.g., "Invalid or expired token")
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Export singleton instance
export default new AuthController();
