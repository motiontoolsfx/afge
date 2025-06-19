import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import prisma from './prisma'

export async function getAuthUser() {
    const token = (await cookies()).get('token')?.value
    if (!token) return null

    try {
        const decoded = verifyToken(token)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, role: true },
        })
        return user
    } catch {
        return null
    }
}
