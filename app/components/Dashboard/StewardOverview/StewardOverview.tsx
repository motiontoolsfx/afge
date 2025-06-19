import { StewardOverview as StewardOverviewType } from "@/types/dashboard";
import React from "react";

import {
    ClockIcon,
    BoltIcon,
    CalendarIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    FolderIcon,
} from "@heroicons/react/24/solid";

import Overview from "../Overview/Overview";

export default function StewardOverview({ data }: { data: StewardOverviewType | undefined }) {
    if (!data) return <div>No data available</div>;

    const rows = [
        {
            header: "Cases",
            cards: [
                { label: "Total Cases", value: data.totalCases, Icon: FolderIcon },
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
