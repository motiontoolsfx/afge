import React from "react";

import styles from './overview.module.css'

type CardData = {
    label: string;
    value: number | string;
    Icon: React.ElementType;
    backgroundColor?: string;
};

type RowData = {
    header: string;
    cards: CardData[];
};

export function OverviewRow({ row }: { row: RowData }) {
    return (
        <section className={styles.row}>
            <h3 className={styles.sectionTitle}>{row.header}</h3>
            <ul className={styles.progressStats}>
                {row.cards.map(({ label, value, Icon, backgroundColor }, i) => (
                    <li key={i} className={styles.card}>
                        <div className={styles.icon} style={backgroundColor ? { backgroundColor } : undefined}>
                            <Icon className={styles.icon} />
                        </div>
                        <div>
                            <h3>{value}</h3>
                            <p>{label}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function Overview({ rows }: { rows: RowData[] }) {
    return (
        <div>
            {rows.map((row, i) => (
                <OverviewRow key={i} row={row} />
            ))}
        </div>
    );
}
