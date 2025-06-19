import { getAuthUser } from '@/lib/getAuthUser'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { page = 1, filters = {} } = await req.json()
    const pageNum = parseInt(page, 10) || 1
    const limit = 10
    const skip = (pageNum - 1) * limit

    console.log(filters);

    const [cases, total, users] = await Promise.all([
        prisma.case.findMany({
            ...filters,
            skip,
            take: limit,
        }),
        prisma.case.count({
            where: filters.where,
        }),
        prisma.user.findMany({
            select: { fname: true }
        })
    ])

    return NextResponse.json({
        data: cases,
        page: pageNum,
        totalPages: Math.ceil(total / limit),
        total,
        users: users.map(u => u.fname)
    })
}
