import { useState } from 'react'

import { ArrowDownTrayIcon, DocumentCheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import LoadingDots from '../../LoadingDots/LoadingDots';

interface Props {
    onSave: () => Promise<void>
    onDelete: () => Promise<void>
    onExport: () => void;
    selected: boolean;
    updates: any;
    accountType: string;
    selectedRows: Set<number>;
    cases: any;
}

export default function ChartTools({ onSave, onDelete, onExport, selected, updates, accountType, selectedRows, cases }: Props) {
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleSave = async () => {
        setLoadingSave(true)
        try {
            await onSave()
        } finally {
            setLoadingSave(false)
        }
    }

    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            await onDelete()
        } finally {
            setLoadingDelete(false)
        }
    }

    console.log(selectedRows)

    return (
        <div className='chart-tools'>
            <button
                className={updates && Object.keys(updates).length === 0 ? 'button-solid button-icon' : 'button-solid button-loading button-icon'}
                onClick={handleSave}
                disabled={updates && Object.keys(updates).length === 0 || loadingSave}
            >
                <span>{loadingSave ? <LoadingDots /> : 'Save Changes'}</span><DocumentCheckIcon />
            </button>
            {accountType === 'admin' && selectedRows.size !== 0 && (
                <button
                    className='button-outline button-loading button-icon button-delete'
                    onClick={handleDelete}
                    disabled={loadingDelete}
                >
                    <span>{loadingDelete ? <LoadingDots /> : 'Delete Selected'}</span><TrashIcon />
                </button>
            )}
            <button
                style={{ marginLeft: 'auto' }}
                className='button-solid button-icon'
                onClick={onExport}
                disabled={cases.data.length == 0}
            >
                <span>Export Data</span><ArrowDownTrayIcon />
            </button>
        </div >
    )
}
