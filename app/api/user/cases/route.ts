import { getAuthUser } from '@/lib/getAuthUser'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { page = 1, filters = {}, accountType } = await req.json()
    const pageNum = parseInt(page, 10) || 1
    const limit = 25
    const skip = (pageNum - 1) * limit

    const defaultOrder = { orderBy: { createdAt: 'desc' } }
    const finalFilters = Object.keys(filters).length === 0 ? defaultOrder : filters

    if ((user.role === 'admin' || user.role === 'owner') && accountType === 'admin') {
        const [cases, total, users] = await Promise.all([
            prisma.case.findMany({
                ...finalFilters,
                skip,
                take: limit,
            }),
            prisma.case.count({
                where: finalFilters.where,
            }),
            prisma.user.findMany({
                select: { id: true, fname: true, lname: true }
            })
        ])

        return NextResponse.json({
            data: cases,
            page: pageNum,
            totalPages: Math.ceil(total / limit),
            total,
            users
        })
    }

    if (user.role === 'steward' || accountType == 'steward') {
        // Override filters and force userId filter
        const where = {
            ...finalFilters.where,
            userId: user.id
        }

        const [cases, total] = await Promise.all([
            prisma.case.findMany({
                where,
                orderBy: finalFilters.orderBy || { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.case.count({
                where,
            })
        ])

        return NextResponse.json({
            data: cases,
            page: pageNum,
            totalPages: Math.ceil(total / limit),
            total,
            users: []
        })
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
