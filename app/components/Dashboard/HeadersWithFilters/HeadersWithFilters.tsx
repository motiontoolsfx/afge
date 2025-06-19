'use client';

import { useState } from "react";
import { Filters } from "@/types/dashboard";

import styles from './HeadersWithFilters.module.css'
import { FunnelIcon } from "@heroicons/react/24/solid";

type CellType = "userDropdown" | "dropdown" | "text" | "date";

type CaseChartData = {
    [key: string]: {
        headerName: string;
        cellType: CellType;
        editable: boolean;
        options?: Record<string, string>;
    };
};

type Props = {
    chartData: CaseChartData;
    users?: string[];
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    onFiltersChange: (filters: Filters) => void;
};

export default function HeadersWithFilters({
    chartData,
    users = [],
    filters,
    setFilters,
    onFiltersChange,
}: Props) {
    const [openKey, setOpenKey] = useState<string | null>(null);

    const [textSearches, setTextSearches] = useState<Record<string, string[]>>({});
    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    const toggleKey = (key: string) => {
        setOpenKey(openKey === key ? null : key);
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        const newFilters = {
            ...filters,
            orderBy: { [key]: direction },
        };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const getValuesForKey = (key: string): string[] => {
        if (chartData[key].cellType === "userDropdown") {
            return users;
        } else if (
            chartData[key].cellType === "dropdown" &&
            chartData[key].options
        ) {
            return Object.keys(chartData[key].options);
        }
        return [];
    };

    const handleCheckboxChange = (key: string, value: string) => {
        const allValues = getValuesForKey(key);
        const currentNotIn =
            filters.where?.[key]?.notIn && Array.isArray(filters.where[key].notIn)
                ? filters.where[key].notIn
                : [];

        // Compute selected by excluding notIn
        const selectedValues = allValues.filter((v) => !currentNotIn.includes(v));
        const isSelected = selectedValues.includes(value);

        let newNotIn: string[];
        if (isSelected) {
            newNotIn = [...currentNotIn, value];
        } else {
            newNotIn = currentNotIn.filter((v: any) => v !== value);
        }

        let newWhere = { ...filters.where };
        if (newNotIn.length === 0) {
            delete newWhere[key];
        } else {
            newWhere[key] = { notIn: newNotIn };
        }

        const newFilters = { ...filters, where: newWhere };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleSelectAll = (key: string) => {
        const allValues = getValuesForKey(key);
        const currentNotIn =
            filters.where?.[key]?.notIn && Array.isArray(filters.where[key].notIn)
                ? filters.where[key].notIn
                : [];

        const isAllSelected = currentNotIn.length === 0;

        let newWhere = { ...filters.where };
        if (isAllSelected) {
            newWhere[key] = { notIn: allValues };
        } else {
            delete newWhere[key];
        }

        const newFilters = { ...filters, where: newWhere };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleInputChange = (key: string, value: string) => {
        setInputValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleTextEnter = (key: string) => {
        const value = inputValues[key]?.trim();
        if (!value) return;

        const updated = [...(textSearches[key] || []), value];
        const newTextSearches = { ...textSearches, [key]: updated };

        const newWhere = { ...filters.where, [key]: { in: updated } };
        const newFilters = { ...filters, where: newWhere };

        setTextSearches(newTextSearches);
        setFilters(newFilters);
        onFiltersChange(newFilters);
        setInputValues((prev) => ({ ...prev, [key]: "" }));
    };

    const removeSearch = (key: string, value: string) => {
        const updated = (textSearches[key] || []).filter((v) => v !== value);
        const newTextSearches = { ...textSearches, [key]: updated };

        let newWhere = { ...filters.where };
        if (updated.length > 0) {
            newWhere[key] = { in: updated };
        } else {
            delete newWhere[key];
        }

        const newFilters = { ...filters, where: newWhere };

        setTextSearches(newTextSearches);
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    return (
        <thead>
            <tr>
                {Object.entries(chartData).map(([key, config]) => {
                    const isSelectable =
                        config.cellType === "userDropdown" ||
                        (config.cellType === "dropdown" && config.options);

                    const values = getValuesForKey(key);

                    const notInValues: string[] =
                        filters.where?.[key]?.notIn && Array.isArray(filters.where[key].notIn)
                            ? filters.where[key].notIn
                            : [];

                    const selected = isSelectable
                        ? values.filter((v) => !notInValues.includes(v))
                        : [];

                    const isAllSelected = selected.length === values.length;

                    return (
                        <th key={key}>
                            <div className={styles.header} onClick={() => toggleKey(key)}>{config.headerName}<FunnelIcon /></div>
                            {openKey === key && (
                                <div className={styles.popup}>
                                    <button onClick={() => handleSort(key, "asc")}>Sort A-Z</button>
                                    <button onClick={() => handleSort(key, "desc")}>Sort Z-A</button>

                                    {isSelectable && (
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={() => handleSelectAll(key)}
                                                />
                                                Select All
                                            </label>
                                            {values.map((value) => (
                                                <label key={value}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(value)}
                                                        onChange={() => handleCheckboxChange(key, value)}
                                                    />
                                                    {config.cellType === "dropdown"
                                                        ? config.options?.[value]
                                                        : value}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {(config.cellType === "text" || config.cellType === "date") && (
                                        <div>
                                            <input
                                                type="text"
                                                value={inputValues[key] || ""}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleTextEnter(key);
                                                }}
                                            />
                                            <button onClick={() => handleTextEnter(key)}>Enter</button>
                                            <div>
                                                {(textSearches[key] || []).map((value) => (
                                                    <span key={value}>
                                                        {value}{" "}
                                                        <button onClick={() => removeSearch(key, value)}>x</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}
