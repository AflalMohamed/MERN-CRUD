import User, { IUser } from '../models/User.model'; // Importing User model
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For creating JWT tokens
import EmailService from './EmailService';

class UserService {
  // --- 1. Register User Method ---
  public async registerUser(userData: any): Promise<IUser> {
    const { name, email, password } = userData;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists with this email');
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user instance
    const user = new User({
      name,
      email,
      password: {
        hash: hashedPassword,
        isHashed: true,
      },
      isActivated: false, // Activation will be handled separately
    });

    // 4. Save the user in the database
    await user.save();

    // 5. Send activation email
    try {
      // Create an activation token (valid for 15 minutes)
      const activationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACTIVATION_SECRET!,
        { expiresIn: '15m' }
      );

      // Use EmailService to send the activation email
      await EmailService.sendActivationEmail(user.email, activationToken);
    } catch (emailError) {
      console.error('Failed to send activation email:', emailError);
    }

    return user;
  }

  // --- 2. Login User Method ---
  public async loginUser(userData: any): Promise<{ user: IUser; token: string }> {
    const { email, password } = userData;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials (email)');
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password.hash);
    if (!isMatch) {
      throw new Error('Invalid credentials (password)');
    }

    // 3. Check activation status
    if (!user.isActivated) {
      throw new Error('Account not activated. Please check your email.');
    }

    // 4. Create login token (JWT)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as jwt.SignOptions
    );

    return { user, token };
  }

  // --- 3. Activate User Method ---
  public async activateUser(token: string): Promise<IUser> {
    try {
      // 1. Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET!);
      const userId = decoded.id;

      // 2. Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 3. Check if already activated
      if (user.isActivated) {
        throw new Error('Account already activated');
      }

      // 4. Activate the user
      user.isActivated = true;
      await user.save();

      return user;
    } catch (error) {
      console.error('Activation error:', error);
      throw new Error('Invalid or expired activation token');
    }
  }

  // --- 4. Get User Profile ---
  public async getProfile(userId: string): Promise<IUser> {
    // Find user by ID and exclude password field
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // --- 5. Update User Profile (Update this) ---
  public async updateProfile(userId: string, updateData: any): Promise<IUser> {
    // 1. Get name and profilePicture from the data object
    const { name, profilePicture } = updateData; 

    const user = await this.getProfile(userId);

    // 2. Update name if provided
    user.name = name || user.name;
    
    // 3. Update profilePicture if provided
    if (profilePicture) {
      // TODO: Delete old picture from 'uploads/' folder
      user.profilePicture = profilePicture;
    }

    await user.save();
    return user;
  }
  
  // --- 6. Forgot Password (Request Token) ---
  public async forgotPassword(email: string): Promise<void> {
    // 1. பயனரைக் கண்டுபிடித்தல்
    const user = await User.findOne({ email });
    if (!user) {
      // குறிப்பு: பயனர் இல்லை என்றாலும், "email sent" என்ற செய்தியைக் காட்டுவது பாதுகாப்பானது.
      // இது "user enumeration" தாக்குதலைத் தடுக்கும்.
      // ஆனால், இப்போதைக்கு நாம் பிழையைக் காட்டலாம்.
      throw new Error('User with this email does not exist');
    }

    // 2. Password Reset Token-ஐ உருவாக்குதல் (10 நிமிடங்கள் மட்டும்)
    // நாம் .env-ல் உருவாக்கிய *புதிய* JWT_RESET_SECRET-ஐப் பயன்படுத்துகிறோம்
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET!,
      { expiresIn: '10m' } // 10 நிமிடங்கள் மட்டும்
    );

    // 3. EmailService-ஐ அழைத்தல்
    try {
      await EmailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email');
    }
  }

  // --- 7. Reset Password (Set New Password) ---
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // 1. Token-ஐச் சரிபார்த்தல் (Verify)
      // இது JWT_RESET_SECRET-ஐப் பயன்படுத்தி சரிபார்க்கிறது
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_RESET_SECRET!
      );
      
      const userId = decoded.id;

      // 2. பயனரைக் கண்டுபிடித்தல்
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 3. புதிய Password-ஐ Hash செய்தல்
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. புதிய Password-ஐ டேட்டாபேஸில் சேமித்தல்
      user.password.hash = hashedPassword;
      user.password.isHashed = true; // இதை உறுதிப்படுத்துகிறோம்
      await user.save();
      
    } catch (error) {
      // Token காலாவதியாகிவிட்டால் (expired) அல்லது தவறாக இருந்தால்
      console.error('Password reset error:', error);
      throw new Error('Invalid or expired password reset token');
    }
  }
}

// Exporting the service for use in other files
export default new UserService();
