import { Case } from "@/app/generated/prisma";
import React, { useEffect, useRef, useState } from "react";

import styles from './EditableChart.module.css'
import { Filters } from "@/types/dashboard";
import Link from "next/link";

type CellType = "userDropdown" | "dropdown" | "text" | "date" | "file";

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
    onDelete?: (activeCases: Case[]) => void;
}

export default function EditableChart({
    headerRow,
    chartData,
    chartConfig,
    users = [],
    onChange,
    onDelete
}: EditableChartProps) {
    const [data, setData] = useState<Case[]>(chartData);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const initialDataRef = useRef<Case[]>(chartData.map(row => ({ ...row })));

    useEffect(() => {
        setData(chartData);
        initialDataRef.current = chartData.map(row => ({ ...row }));
        setHasChanges(false);
        setSelectedIds(new Set());
    }, [chartData]);

    useEffect(() => {
        let changed = false;
        for (let i = 0; i < data.length; i++) {
            for (const key of Object.keys(chartConfig)) {
                const a = data[i][key as keyof Case];
                const b = initialDataRef.current[i]?.[key as keyof Case];
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

    function renderCellContent(row: Case, key: string, rowIndex: number) {
        const col = chartConfig[key];
        if (!col) return null;
        if (!col.editable) return <>{String(row[key as keyof Case] ?? "")}</>;

        const raw = row[key as keyof Case];
        const val = raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw ?? "");

        switch (col.cellType) {
            case "userDropdown":
                return (
                    <select
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
                        type="text"
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    />
                );
            case "date":
                return (
                    <input
                        type="date"
                        value={val}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                    />
                );
            case "file":
                return val ? <Link className={styles.downloadBtn} href={val} target="_blank" rel="noopener noreferrer">Download</Link> : <p>None</p>;
        }
    }

    function toggleSelect(id: number | undefined) {
        if (id === undefined) return;
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    }

    function handleDelete() {
        if (!onDelete) return;
        const selectedArray = data.filter(row => selectedIds.has(row.id!));
        onDelete(selectedArray);
        setSelectedIds(new Set());
    }

    function handleSave() {
        onChange(data);
        initialDataRef.current = data.map(row => ({ ...row }));
        setHasChanges(false);
    }

    return (
        <>
            <button onClick={handleSave} disabled={!hasChanges}>
                Save
            </button>
            {onDelete && selectedIds.size > 0 && (
                <button onClick={handleDelete} style={{ marginLeft: 8 }}>
                    Delete ({selectedIds.size})
                </button>
            )}
            <table className="table">
                <thead>
                    {onDelete ? (
                        <th>Delete</th>
                            // {headerRow}
                    ) : (
                    headerRow
                    )}
                </thead>
                <tbody>
                    {data.map((row, ri) => (
                        <tr key={row.id ?? ri}>
                            {onDelete && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(row.id!)}
                                        onChange={() => toggleSelect(row.id)}
                                    />
                                </td>
                            )}
                            {Object.keys(chartConfig).map((key) => (
                                <td key={key} className={isChanged(ri, key) ? 'chart-changed' : ''}>
                                    {renderCellContent(row, key, ri)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
