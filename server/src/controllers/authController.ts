import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken, AUTH_COOKIE_NAME } from '../utils/generateToken';
import { Request, Response } from 'express';
import { googleClient } from '../utils/googleAuth';
import { AuthRequest } from '../middlewares/authMiddleware';

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'name, email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'user already exists with the email entered',
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // generate JWT
    const token = generateToken(user.id, res);

    return res.status(201).json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      error: 'internal server error',
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check all fields entered
    if (!email || !password) {
      return res.status(400).json({
        error: 'email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // check if user exists in the table
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        error: 'invalid email or password',
      });
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'invalid email or password',
      });
    }

    // generate JWT
    const token = generateToken(user.id, res);

    return res.status(200).json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      error: 'internal server error',
    });
  }
};

const logout = async (req: Request, res: Response) => {
  // remove the jwt from cookies
  res.cookie(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

  return res.status(200).json({
    status: 'success',
    message: 'logged out successfully',
  });
};

const getMe = async (req: AuthRequest, res: Response) => {
  // req.user is populated by the protect middleware
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      status: 'error',
      error: 'Not authorized',
    });
  }

  return res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    },
  });
};

const googleAuthInit = async (req: Request, res: Response) => {
  console.log('DEBUG_OAUTH_ENV', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    client: googleClient._clientId,
  });

  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
  });
  res.redirect(url);
};

const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: 'OAuth code missing' });
    }

    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res
        .status(400)
        .json({ error: 'Failed to retrieve email from Google' });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || 'Google User';
    const picture = payload.picture || '';

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          picture,
        },
      });
    }

    generateToken(user.id, res);

    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return res.redirect(frontendUrl);
  } catch (error) {
    console.error('Error in Google OAuth:', error);
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/?error=oauth_failed`);
  }
};

export { signup, login, logout, getMe, googleAuthInit, googleAuthCallback };
