import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'

interface UserToken {
    id: string
    role: 'owner' | 'admin' | 'steward' | string
}

async function getUser(req: Request): Promise<UserToken> {
    const auth = req.headers.get('authorization')?.split(' ')[1]
    if (!auth) {
        throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return verifyToken(auth) as UserToken
}

export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { changes } = (await req.json()) as { changes: Array<Record<string, any>> }

        const results = await Promise.all(
            changes.map(async (c) => {
                const { id, progress, notes, ...rest } = c
                if (!id) {
                    throw NextResponse.json({ error: 'Missing case ID' }, { status: 400 })
                }

                const cleanedData = Object.fromEntries(
                    Object.entries({ ...rest, progress, notes }).map(([key, value]) => [
                        key,
                        value === '' ? null : value,
                    ])
                );

                if (user.role === 'owner' || user.role === 'admin') {
                    return prisma.case.update({
                        where: { id },
                        data: cleanedData,
                    })
                }

                if (user.role === 'steward') {
                    const existing = await prisma.case.findUnique({ where: { id } })
                    if (!existing || existing.userId !== user.id) {
                        throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                    }
                    return prisma.case.update({
                        where: { id },
                        data: {
                            progress: progress ?? existing.progress,
                            notes: notes ?? existing.notes,
                        },
                    })
                }

                throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            })
        )

        return NextResponse.json(results, { status: 200 })
    } catch (e: any) {
        if (e instanceof NextResponse) return e
        console.error(e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { cases } = (await req.json()) as { cases: number[] }

        if (user.role !== 'owner' && user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (!Array.isArray(cases) || cases.some(id => typeof id !== 'number')) {
            return NextResponse.json({ error: 'Missing or invalid Case IDs' }, { status: 400 })
        }

        await prisma.case.deleteMany({
            where: { id: { in: cases } }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
