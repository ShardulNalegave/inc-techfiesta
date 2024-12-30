import { Router } from 'express';
import { hashPassword, comparePassword } from '../utils/password';
import { NextFunction, Request, Response } from 'express';
import { UserRegistrationData } from '../types/user';
import { usersTable } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

// Define the user registration endpoint
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure `req.db` is defined
    if (!req.db) {
      res.status(500).json({ message: 'Database connection is unavailable.' });
      return;
    }

    const { name, email, phone, password } = req.body as UserRegistrationData;

    // Check if the email or phone already exists in the database
    const existingUser = await req.db
      .select()
      .from(usersTable) // Use the table object directly instead of a string
      .where(
        or(
          eq(usersTable.email, email),
          eq(usersTable.phone, phone)
        )
      )
      .limit(1);

    if (existingUser) {
      res.status(400).json({ message: 'User with this email or phone already exists.' });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    const [newUser] = await req.db
      .insert(usersTable)
      .values({ name, email, phone, passwordHash: hashedPassword })
      .returning();

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email, phone: newUser.phone } as JwtPayload, JWT_SECRET, {
      expiresIn: '24h',
    });

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error('Error during registration:', error);

    // Handle specific errors (e.g., database or validation errors)
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error.', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure `req.db` is defined
    if (!req.db) {
      res.status(500).json({ message: 'Database connection is unavailable.' });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    // Retrieve the user from the database
    const [user] = await req.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    // Verify the password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone } as JwtPayload, JWT_SECRET, {
      expiresIn: '24h',
    });


    // Respond with success
    res.status(200).json({
      message: 'Login successful.',
      user: user,
      token: token
    });
  } catch (error) {
    console.error('Error during login:', error);

    // Handle specific errors (e.g., database or validation errors)
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error.', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure `req.db` is defined
    if (!req.db) {
      res.status(500).json({ message: 'Database connection is unavailable.' });
      return;
    }

    // Retrieve all users from the database
    const user = await req.db.select({
      id: req.authData.id
    }).from(usersTable);

    // Respond with success
    res.status(200).json({
      message: 'Users retrieved successfully.',
      user: user,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);

    // Handle specific errors (e.g., database or validation errors)
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error.', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
}

// Controller for deleting the user
export async function deleteUser(req: Request, res: Response): Promise<void> {
  if (!req.db) {
    res.status(500).json({ message: 'Database connection is unavailable.' });
    return;
  }
  const userId = req.authData?.userId; // Assuming userId is stored in JWT payload

  if (!userId) {
    res.status(400).json({ message: 'User not authenticated.' });
    return;
  }

  try {
    // Delete user from the userTable
    await req.db.delete(usersTable).where(eq(usersTable.id, userId));
    req.authData = null;

    // Simulating a successful user deletion
    res.status(200).json({ message: 'User successfully deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user. Please try again later.' });
  }
}


export default router;
