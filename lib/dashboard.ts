// services/dashboardService.ts
import prisma from '@/lib/prisma';
import { Progress, Role, User } from '../app/generated/prisma/client';
import { DashboardData } from '@/types/dashboard';

async function getOwnerUsers() {
    const [users, userCount] = await Promise.all([
        prisma.user.findMany(),
        prisma.user.count()
    ])

    return {
        users,
        userCount
    }
}

async function getAdminOverview() {
    const [total, byProgress, withUser, withoutUser, userCount] = await Promise.all([
        prisma.case.count(),
        prisma.case.groupBy({
            by: ['progress'],
            _count: { progress: true },
        }),
        prisma.case.count({ where: { userId: { not: null } } }),
        prisma.case.count({ where: { userId: null } }),
        prisma.user.count()
    ])

    return {
        totalCases: total,
        casesByProgress: byProgress.map(p => ({
            progress: p.progress,
            count: p._count.progress
        })),
        casesWithUser: withUser,
        casesWithoutUser: withoutUser,
        userCount
    }
}

async function getAdminCases(page = 1, limit = 50) {
    const skip = (page - 1) * limit

    const [cases, total, users] = await Promise.all([
        prisma.case.findMany({
            skip,
            take: limit,
        }),
        prisma.case.count(),
        prisma.user.findMany({
            select: { fname: true }
        })
    ])

    return {
        data: cases,
        page,
        totalPages: Math.ceil(total / limit),
        total,
        users: users.map(u => u.fname)
    }
}

async function getStewardCases(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit

    const [cases, total] = await Promise.all([
        prisma.case.findMany({
            where: {
                userId: userId,
            },
            skip,
            take: limit,
        }),
        prisma.case.count({
            where: {
                userId: userId,
            },
        }),
    ])

    return {
        data: cases,
        page,
        totalPages: Math.ceil(total / limit),
        total,
    }
}

async function getStewardOverview(userId: string) {
    const [totalCases, byProgress] = await Promise.all([
        prisma.case.count({
            where: {
                userId: userId,
            },
        }),
        prisma.case.groupBy({
            by: ['progress'],
            _count: {
                progress: true,
            },
            where: {
                userId: userId,
            },
        }),
    ]);

    return {
        totalCases,
        casesByProgress: byProgress.map(p => ({
            progress: p.progress,
            count: p._count.progress
        })),
    };
}

export async function getDashboard(user: User) {
    let data: DashboardData = {};

    if (user.role === Role.owner) {
        [data.ownerUsers, data.adminOverview, data.adminCases, data.stewardCases, data.stewardOverview] = await Promise.all([
            getOwnerUsers(),
            getAdminOverview(),
            getAdminCases(),
            getStewardCases(user.id),
            getStewardOverview(user.id),
        ]);
    } else if (user.role === Role.admin) {
        [data.adminOverview, data.adminCases, data.stewardCases, data.stewardOverview] = await Promise.all([
            getAdminOverview(),
            getAdminCases(),
            getStewardCases(user.id),
            getStewardOverview(user.id),
        ]);
    } else if (user.role === Role.steward) {
        [data.stewardCases, data.stewardOverview] = await Promise.all([
            getStewardCases(user.id),
            getStewardOverview(user.id),
        ]);
    }

    return data;
}