import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No user attached' });
    }

    // Check the 'admin' custom claim set on the user's ID token
    if (user.admin === true) {
      next();
    } else {
      console.warn(`Access denied for user ${user.email || user.uid}: Missing admin claim`);
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error during admin verification' });
  }
};
