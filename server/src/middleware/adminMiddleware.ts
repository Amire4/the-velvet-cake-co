import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.ts';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required.'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges are required.'
    });
  }

  next();
}
