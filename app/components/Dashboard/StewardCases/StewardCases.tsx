import { StewardCases as StewardCasesType } from "@/types/dashboard";
import React from "react";

export default function StewardCases({ cases }: { cases: StewardCasesType | undefined }) {
    return (
        <div>
            <pre>{JSON.stringify(cases, null, 2)}</pre>
        </div>
    );
}
