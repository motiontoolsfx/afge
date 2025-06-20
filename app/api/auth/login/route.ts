// import prisma from '@/lib/prisma'
// import { signToken } from '@/lib/auth'
// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//     const { username, password } = await req.json()
//     const user = await prisma.user.findUnique({ where: { username } })

//     if (!user || user.password !== password) {
//         return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
//     }

//     const token = signToken({ id: user.id, role: user.role })
//     const res = NextResponse.json({ success: true })
//     res.cookies.set('token', token, { httpOnly: true, path: '/' })

//     return res
// }
