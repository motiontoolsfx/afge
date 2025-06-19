import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { Role } from '@/app/generated/prisma'

async function authorize(req: Request) {
    const auth = req.headers.get('authorization')?.split(' ')[1]
    if (!auth) throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(auth)
    if (user.role !== 'owner') throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return user
}

// PATCH: create or update users with validation
export async function PATCH(req: Request) {
    await authorize(req)
    const updates: {
        id?: string
        fname: string
        lname: string
        username: string
        password: string
        role: Role
    }[] = await req.json()

    // const validRoles = ['Owner', 'Admin', 'Steward']

    // for (const user of updates) {
    //     const { fname, lname, username, password, role } = user

    //     const isValidLength = (val: string) => val.length >= 2 && val.length <= 18

    //     if (
    //         !isValidLength(fname) ||
    //         !isValidLength(lname) ||
    //         !isValidLength(username) ||
    //         !isValidLength(password) ||
    //         !validRoles.includes(role)
    //     ) {
    //         return NextResponse.json({ error: 'Invalid input: fields must be 2–18 characters and role must be valid' }, { status: 400 })
    //     }
    // }

    const results = await Promise.all(
        updates.map(user => {
            const { id, ...data } = user
            if (id && id.trim() !== '') {
                return prisma.user.update({
                    where: { id },
                    data,
                })
            } else {
                return prisma.user.create({
                    data,
                })
            }
        })
    )

    return NextResponse.json(results, { status: 200 })
}

// DELETE: delete single user by ID
export async function DELETE(req: Request) {
    await authorize(req)
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
}
