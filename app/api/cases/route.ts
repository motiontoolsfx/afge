import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'
import {
    Position,
    PayScale,
    Entitlement,
    ReasonForRequest,
    PayIssueType,
    DisciplinaryActionType,
    Progress,
} from '@/app/generated/prisma'
import { error } from 'console'

interface UserToken {
    id: string
    role: 'owner' | 'admin' | 'steward' | string
}

async function getUser(req: Request): Promise<UserToken> {
    const auth = req.headers.get('authorization')?.split(' ')[1]
    if (!auth) throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return verifyToken(auth) as UserToken
}

// PATCH: create or update Cases
export async function PATCH(req: Request) {
    try {
        const user = await getUser(req)
        const updates: any[] = await req.json()

        const results = await Promise.all(
            updates.map(async (c) => {
                const { id, userId, progress, notes, ...rest } = c

                console.log(rest)

                // Owner/Admin: full create/update
                if (user.role === 'owner' || user.role === 'admin') {
                    if (id) {
                        return prisma.case.update({ where: { id }, data: { ...rest } })
                    }
                }

                // Steward: only updating progress & notes on their own cases
                if (user.role === 'steward') {
                    if (!id) {
                        throw NextResponse.json(
                            { error: 'Stewards may not create cases' },
                            { status: 403 }
                        )
                    }
                    // fetch existing to check ownership
                    const existing = await prisma.case.findUnique({ where: { id } })
                    if (!existing || existing.userId !== user.id) {
                        throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                    }
                    // only update progress & notes
                    return prisma.case.update({
                        where: { id },
                        data: {
                            progress: progress ?? existing.progress,
                            notes: notes ?? existing.notes,
                        },
                    })
                }

                // all others denied
                throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            })
        )

        return NextResponse.json(results, { status: 200 })
    }
    catch (e) {
        console.log(error)
    }
}

// DELETE: delete single Case by ID
export async function DELETE(req: Request) {
    const user = await getUser(req)
    const { id }: { id?: number } = await req.json()

    if (user.role === 'owner' || user.role === 'admin') {
        if (typeof id !== 'number') {
            return NextResponse.json({ error: 'Missing or invalid Case ID' }, { status: 400 })
        }
        await prisma.case.delete({ where: { id } })
        return NextResponse.json({ success: true }, { status: 200 })
    }

    // Stewards and others cannot delete
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
