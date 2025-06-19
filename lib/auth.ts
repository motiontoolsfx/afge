import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function signToken(user: { id: string; role: string }) {
    return jwt.sign(user, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET) as { id: string; role: string }
}
