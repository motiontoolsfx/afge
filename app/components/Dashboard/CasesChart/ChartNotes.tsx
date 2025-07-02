import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import styles from './styles/casesChart.module.css';
import { ChangeEvent, ReactNode, useState } from "react";

interface Props {
    value: string;
    children?: ReactNode;
    onChange: (newValue: string) => void;
}

export default function ChartNotes({ value, children, onChange }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.noteCell}>
            {children}
            <button className={styles.noteCellBtn} onClick={() => setOpen(true)}>
                <ArrowTopRightOnSquareIcon />
            </button>

            {open && (
                <div className={styles.notesModal}>
                    <div className={styles.notesModalContent}>
                        <div className={styles.notesToolbar}>
                            <h3>Notes</h3>
                            <button className='button-solid button-icon button-delete' onClick={() => setOpen(false)}>Close <XMarkIcon /></button>
                        </div>
                        <textarea className={styles.notesTextarea} value={value} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} />
                    </div>
                </div>
            )}
        </div>
    );
}
