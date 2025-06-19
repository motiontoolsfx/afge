import { Case } from "@/app/generated/prisma";
import React, { useEffect, useRef, useState } from "react";

import styles from './EditableChart.module.css'
import { Filters } from "@/types/dashboard";

type CellType = "userDropdown" | "dropdown" | "text" | "date";

interface ChartColumn {
    headerName: string;
    cellType: CellType;
    editable: boolean;
    options?: Record<string, string>;
}

type CaseChartData = Record<string, ChartColumn>;

interface EditableChartProps {
    headerRow: React.ReactNode;
    chartData: Case[];
    chartConfig: CaseChartData;
    users?: string[];
    onChange: (updatedData: Case[]) => void; // called only on Save
}

export default function EditableChart({
    headerRow,
    chartData,
    chartConfig,
    users = [],
    onChange,
}: EditableChartProps) {
    const [data, setData] = useState<Case[]>(chartData);
    const [hasChanges, setHasChanges] = useState(false);
    // keep a deep‐clone of the original values for comparison
    const initialDataRef = useRef<Case[]>(
        chartData.map(row => ({ ...row }))
    );

    // whenever props.chartData changes (e.g. reload), reset both data and initial
    useEffect(() => {
        setData(chartData);
        initialDataRef.current = chartData.map(row => ({ ...row }));
        setHasChanges(false);
    }, [chartData]);

    // detect changes by comparing current data vs initialDataRef
    useEffect(() => {
        let changed = false;
        for (let i = 0; i < data.length; i++) {
            for (const key of Object.keys(chartConfig)) {
                const a = data[i][key as keyof Case];
                const b = initialDataRef.current[i]?.[key as keyof Case];
                // normalize Dates to string
                const av = a instanceof Date ? a.toISOString() : String(a ?? "");
                const bv = b instanceof Date ? b.toISOString() : String(b ?? "");
                if (av !== bv) {
                    changed = true;
                    break;
                }
            }
            if (changed) break;
        }
        setHasChanges(changed);
    }, [data, chartConfig]);

    function handleChange(rowIndex: number, key: string, value: any) {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [key]: value };
        setData(newData);
    }

    function isChanged(rowIndex: number, key: string) {
        const a = data[rowIndex][key as keyof Case];
        const b = initialDataRef.current[rowIndex]?.[key as keyof Case];
        const av = a instanceof Date ? a.toISOString() : String(a ?? "");
        const bv = b instanceof Date ? b.toISOString() : String(b ?? "");
        return av !== bv;
    }

    function renderCell(row: Case, key: string, rowIndex: number) {
        const col = chartConfig[key];
        if (!col) return null;
        if (!col.editable) return <>{String(row[key as keyof Case] ?? "")}</>;

        const raw = row[key as keyof Case];
        const val = raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw ?? "");
        const style = isChanged(rowIndex, key) ? { backgroundColor: "#d4fcd4" } : {};

        switch (col.cellType) {
            case "userDropdown":
                return (
                    <select
                        style={style}
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    >
                        <option value="">-- Select User --</option>
                        {users.map((u) => (
                            <option key={u} value={u}>
                                {u}
                            </option>
                        ))}
                    </select>
                );
            case "dropdown":
                return (
                    <select
                        style={style}
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {col.options &&
                            Object.entries(col.options).map(([optKey, optLabel]) => (
                                <option key={optKey} value={optKey}>
                                    {optLabel}
                                </option>
                            ))}
                    </select>
                );
            case "text":
                return (
                    <input
                        style={style}
                        type="text"
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    />
                );
            case "date":
                return (
                    <input
                        style={style}
                        type="date"
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    />
                );
        }
    }

    function handleSave() {
        // update parent
        onChange(data);
        // reset initial to current
        initialDataRef.current = data.map(row => ({ ...row }));
        setHasChanges(false);
    }

    return (
        <>
            <button onClick={handleSave} disabled={!hasChanges}>
                Save
            </button>
            <table className={styles.table}>
                {headerRow}
                <tbody>
                    {data.map((row, ri) => (
                        <tr key={row.id ?? ri}>
                            {Object.keys(chartConfig).map((key) => (
                                <td key={key}>{renderCell(row, key, ri)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
