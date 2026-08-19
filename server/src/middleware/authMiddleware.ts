import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_the_velvet_cake_co_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'CUSTOMER' | 'ADMIN';
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'CUSTOMER' | 'ADMIN' };
    const user = await db.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.'
    });
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'CUSTOMER' | 'ADMIN' };
        db.findUserById(decoded.id).then(user => {
          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            };
          }
          next();
        }).catch(() => next());
        return;
      }
    }
    next();
  } catch {
    next();
  }
}
