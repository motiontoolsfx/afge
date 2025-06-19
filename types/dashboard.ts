// types/dataTypes.ts
import { Case, Progress, User } from '../app/generated/prisma/client';

export interface AdminOverview {
    totalCases: number;
    casesByProgress: {
        progress: Progress | null;
        count: number;
    }[];
    casesWithUser: number;
    casesWithoutUser: number;
    userCount: number;
}

export interface StewardOverview {
    totalCases: number;
    casesByProgress: {
        progress: Progress | null;
        count: number;
    }[];
}

export interface OwnerUsers {
    users: User[];
    userCount: number;
}

export interface AdminCases {
    data: Case[];
    page: number;
    totalPages: number;
    total: number;
    users: string[];
}

export interface StewardCases {
    data: Case[];
    page: number;
    totalPages: number;
    total: number;
}

export interface DashboardData {
    ownerUsers?: OwnerUsers;
    adminOverview?: AdminOverview;
    adminCases?: AdminCases;
    stewardCases?: StewardCases;
    stewardOverview?: StewardOverview;
}

export type Filters = {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
};
