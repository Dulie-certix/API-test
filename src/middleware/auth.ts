import { Request, Response, NextFunction } from 'express';
import { verifyToken as verifyJWT, JWTPayload, COOKIE_NAME } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check cookies first, then Authorization header
  let token = req.cookies?.[COOKIE_NAME];
  
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    console.log("✅ Token verified:", decoded.email, decoded.role);
    next();
  } catch (error) {
    console.log("❌ Invalid token:", error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Checking admin access for:", req.user?.email, req.user?.role);
  if (req.user?.role !== 'admin') {
    console.log("❌ Not admin - Access denied");
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log("✅ Admin access granted");
  next();
};
