import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { UserRole } from './types/permit';

const JWT_SECRET = process.env.JWT_SECRET || 'opmaint-ptw-cmms-super-secret-key-2026';
const TOKEN_COOKIE_NAME = 'opmaint_session_token';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  assignedAreaId?: string | null;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

/**
 * Extracts current user from NextRequest (via Cookie or Bearer Authorization header)
 */
export function getCurrentUserFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }

  const cookieToken = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

/**
 * Extracts current user from Next.js server component / server actions
 */
export async function getCurrentUserFromSession(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { DEMO_USERS } from './constants';

