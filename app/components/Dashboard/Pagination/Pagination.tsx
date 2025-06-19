import { useState, useEffect } from "react";
import {
    ChevronDoubleLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

import styles from './pagination.module.css'

type Props = {
    page: number;
    totalPages: number;
    totalCases: number;
    onPageChange: (newPage: number) => void;
};

export default function Pagination({ page, totalPages, totalCases, onPageChange }: Props) {
    const [inputValue, setInputValue] = useState(page.toString());

    useEffect(() => {
        setInputValue(page.toString());
    }, [page]);

    function handleCommit() {
        const num = Number(inputValue);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
            onPageChange(num);
        } else {
            setInputValue(page.toString());
        }
    }

    return (
        <div className={styles.container}>
            <button className={"button-outline"} onClick={() => onPageChange(1)} disabled={page === 1}>
                <ChevronDoubleLeftIcon />
            </button>
            <button className={"button-solid"} onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                <ChevronLeftIcon />
            </button>
            <span>
                Page{" "}
                <input
                    className={styles.pageSelect}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setInputValue(val);
                    }}
                    onBlur={handleCommit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommit();
                    }}
                />{" "}
                of {totalPages}
            </span>
            {/* <span>{totalCases} Cases Found</span> */}
            <button className={"button-solid"} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                <ChevronRightIcon />
            </button>
            <button className={"button-outline"} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
                <ChevronDoubleRightIcon />
            </button>
        </div>
    );
}
