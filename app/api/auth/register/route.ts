// import prisma from '@/app/lib/prisma'
// import { signToken } from '@/app/lib/auth'
// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//     const { username, password } = await req.json()

//     const existing = await prisma.user.findUnique({ where: { username } })
//     if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 })

//     const user = await prisma.user.create({
//         data: { username, password, role: 'owner' }
//     })

//     const token = signToken({ id: user.id, role: user.role })
//     return NextResponse.json({ token, role: user.role })
// }
