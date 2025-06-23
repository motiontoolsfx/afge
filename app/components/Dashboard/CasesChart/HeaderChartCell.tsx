import { FunnelIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import styles from './styles/casesChart.module.css';

interface Option {
    id: string;
    option: string;
}

interface Filters {
    where?: Record<string, { notIn?: string[]; in?: string[] }>;
    orderBy?: Record<string, "asc" | "desc">;
}

interface Props {
    question: any;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

// Helper to remove empty filter entries
function cleanWhere(where: Filters['where'] = {}) {
    const cleaned: Record<string, { notIn?: string[]; in?: string[] }> = {};
    Object.entries(where).forEach(([key, val]) => {
        const notInArr = val.notIn ?? [];
        const inArr = val.in ?? [];
        const hasNotIn = notInArr.length > 0;
        const hasIn = inArr.length > 0;
        if (hasNotIn || hasIn) {
            cleaned[key] = { ...(hasNotIn ? { notIn: notInArr } : {}), ...(hasIn ? { in: inArr } : {}) };
        }
    });
    return Object.keys(cleaned).length ? cleaned : undefined;
}

function cleanOrderBy(orderBy: Filters['orderBy'] = {}) {
    return Object.keys(orderBy).length ? orderBy : undefined;
}

export default function HeaderChartCell({ question, filters, setFilters }: Props) {
    const [open, setOpen] = useState(false);
    const id = question.id;

    if (question.type === "file") {
        return (
            <div className={styles.headerChartCell}>
                <span>{question.title}</span>
            </div>
        );
    }

    const toggleOpen = () => setOpen(prev => !prev);

    const setOrder = (dir: "asc" | "desc") => {
        setFilters(f => ({
            ...f,
            orderBy: cleanOrderBy({ [id]: dir })
        }));
    };

    const onCheckboxChange = (optId: string, checked: boolean) => {
        setFilters(f => {
            const prevNotIn = f.where?.[id]?.notIn ?? [];
            const newNotIn = checked
                ? prevNotIn.filter(x => x !== optId)
                : [...prevNotIn, optId];
            return {
                ...f,
                where: cleanWhere({ ...f.where, [id]: { notIn: newNotIn } })
            };
        });
    };

    const toggleSelectAll = () => {
        setFilters(f => {
            const allIds: string[] = question.options!.map((opt: Option) => opt.id);
            const prevNotIn = f.where?.[id]?.notIn ?? [];
            const allSelected = prevNotIn.length === 0;
            const newNotIn = allSelected ? allIds : [];
            return {
                ...f,
                where: cleanWhere({ ...f.where, [id]: { notIn: newNotIn } })
            };
        });
    };

    const addSearch = (val: string) => {
        const term = val.trim();
        if (!term) return;
        setFilters(f => {
            const prevIn = f.where?.[id]?.in ?? [];
            const updatedIn = [...prevIn, term];
            return {
                ...f,
                where: cleanWhere({ ...f.where, [id]: { in: updatedIn } })
            };
        });
    };

    const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addSearch((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
        }
    };

    const savedSearches: string[] = filters.where?.[id]?.in ?? [];

    return (
        <div className={styles.headerChartCell}>
            <button className={styles.filterBtn} onClick={toggleOpen}>
                <span>{question.title}</span>
                <FunnelIcon />
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <button onClick={() => setOrder("asc")} className={styles.dropdownBtn}>
                        Sort A-Z
                    </button>
                    <button onClick={() => setOrder("desc")} className={styles.dropdownBtn}>
                        Sort Z-A
                    </button>

                    {question.type === "short_answer" && (
                        <div className={styles.searchSection}>
                            <input
                                type="text"
                                placeholder="Enter keyword…"
                                onKeyDown={onSearchKey}
                                className={styles.searchInput}
                            />
                            <button
                                onClick={() => {
                                    const input = document.querySelector<HTMLInputElement>(
                                        `.${styles.searchInput}`
                                    );
                                    if (input) {
                                        addSearch(input.value);
                                        input.value = "";
                                    }
                                }}
                            >
                                Enter
                            </button>
                            <div className={styles.savedKeys}>
                                {savedSearches.map((k: string, i: number) => (
                                    <span key={i} className={styles.keyBadge}>
                                        {k}
                                        <button
                                            className={styles.removeKeyBtn}
                                            onClick={() =>
                                                setFilters(f => {
                                                    const updatedIn = (f.where?.[id]?.in ?? []).filter(val => val !== k);
                                                    return {
                                                        ...f,
                                                        where: cleanWhere({ ...f.where, [id]: { in: updatedIn } })
                                                    };
                                                })
                                            }
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {question.type === "dropdown" && question.options && (
                        <>
                            <label className={styles.checkboxOption}>
                                <input
                                    type="checkbox"
                                    checked={(filters.where?.[id]?.notIn ?? []).length === 0}
                                    onChange={toggleSelectAll}
                                />
                                Select All
                            </label>
                            {question.options.map((opt: Option) => (
                                <label key={opt.id} className={styles.checkboxOption}>
                                    <input
                                        type="checkbox"
                                        checked={!(filters.where?.[id]?.notIn ?? []).includes(opt.id)}
                                        onChange={e => onCheckboxChange(opt.id, e.target.checked)}
                                    />
                                    {opt.option}
                                </label>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
