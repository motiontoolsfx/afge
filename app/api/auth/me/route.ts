import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const user = verifyToken(token)
        return NextResponse.json(user)
    } catch {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
