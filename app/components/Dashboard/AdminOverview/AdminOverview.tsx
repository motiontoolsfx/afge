import { AdminOverview as AdminOverviewType } from "@/types/dashboard";
import React from "react";

import {
    ClockIcon,
    BoltIcon,
    CalendarIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    FolderIcon,
    UserIcon,
    UserMinusIcon,
} from "@heroicons/react/24/solid";

import Overview from "../Overview/Overview";

export default function AdminOverview({ data }: { data: AdminOverviewType | undefined }) {
    if (!data) return <div>No data available</div>;

    const rows = [
        {
            header: "Cases",
            cards: [
                { label: "Total Cases", value: data.totalCases, Icon: FolderIcon },
                { label: "Assigned Cases", value: data.casesWithUser, Icon: UserIcon },
                { label: "Unassigned Cases", value: data.casesWithoutUser, Icon: UserMinusIcon },
            ],
        },
        {
            header: "Open Cases",
            cards: [
                { label: "Not Started", value: data?.casesByProgress?.[0]?.count ?? 0, Icon: ClockIcon, backgroundColor: "hsl(0, 0%, 85%)" },
                { label: "In Progress", value: data?.casesByProgress?.[1]?.count ?? 0, Icon: BoltIcon, backgroundColor: "hsl(60, 80%, 85%)" },
                { label: "Meeting Set", value: data?.casesByProgress?.[2]?.count ?? 0, Icon: CalendarIcon, backgroundColor: "hsl(226, 80%, 85%)" },
                { label: "Not Started", value: data?.casesByProgress?.[3]?.count ?? 0, Icon: EnvelopeIcon, backgroundColor: "hsl(30, 80%, 85%)" },
                { label: "In Progress", value: data?.casesByProgress?.[4]?.count ?? 0, Icon: ExclamationTriangleIcon, backgroundColor: "hsl(0, 80%, 85%)" },
                { label: "Meeting Set", value: data?.casesByProgress?.[5]?.count ?? 0, Icon: CheckCircleIcon, backgroundColor: "hsl(120, 80%, 85%)" },
            ],
        },
    ]

    return (
        <div>
            <h2>Admin Overview</h2>
            <Overview rows={rows} />
        </div>
    );
}
