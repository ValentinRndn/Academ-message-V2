import jwt from 'jsonwebtoken'

// In a real application, this would be stored in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'academ-message-secret-key'
const TOKEN_EXPIRY = '7d' // Token expires in 7 days

interface TokenPayload {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: TokenPayload) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    throw new Error('Invalid token')
  }
}

/**
 * Extract token from authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

/**
 * Check if a token is valid without throwing an error
 */
export function isValidToken(token: string | null): boolean {
  if (!token) return false
  
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}