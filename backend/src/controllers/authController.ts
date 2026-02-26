import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, verifyToken as verifyJWT, COOKIE_NAME, COOKIE_OPTIONS } from '../utils/jwt';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let token: string;
    let userData: any;

    // Check hardcoded admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        _id: 'admin',
        email: ADMIN_EMAIL,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const
      };
      
      token = generateToken(adminUser as any);
      userData = {
        id: adminUser._id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role
      };
    } else {
      // Check database user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      token = generateToken(user);
      userData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };
    }

    // Set token in HTTP-only cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    // Return token and user data (for backward compatibility)
    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    // Check cookies first, then Authorization header
    let token = req.cookies?.[COOKIE_NAME];
    
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyJWT(token);
    
    if (decoded.userId === 'admin') {
      return res.json({
        user: {
          id: 'admin',
          email: ADMIN_EMAIL,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        }
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};