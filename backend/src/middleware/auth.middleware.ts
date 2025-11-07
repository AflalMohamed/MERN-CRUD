import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

// Extend the Express Request object to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // The 'user' property may or may not exist
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction // <-- Moves to the next function (middleware/controller)
) => {
  let token;

  // 1. Check if the user sent an Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token from the 'Bearer <token>' string
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the login secret
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // 4. Find the user in the database using the ID from the token
      // (Exclude the password field from the response)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. Attach the user information to the request object
      // (This allows controllers to access `req.user`)
      req.user = user;

      // 6. Everything looks good — proceed to the next middleware or controller
      next();

    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  // 7. If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default authMiddleware;
