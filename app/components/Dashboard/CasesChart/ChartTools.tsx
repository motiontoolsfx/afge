import { useState } from 'react'

import { ArrowDownTrayIcon, DocumentCheckIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
    onSave: () => Promise<void>
    onDelete: () => Promise<void>
    onExport: () => void;
    selected: boolean;
    updates: any;
    accountType: string;
}

export default function ChartTools({ onSave, onDelete, onExport, selected, updates, accountType }: Props) {
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

    return (
        <div className='chart-tools'>
            <button
                className={updates && Object.keys(updates).length === 0 ? 'button-solid button-icon' : 'button-solid button-loading button-icon'}
                onClick={handleSave}
                disabled={updates && Object.keys(updates).length === 0 || loadingSave}
            >
                <span>{loadingSave ? 'Saving...' : 'Save Changes'}</span><DocumentCheckIcon />
            </button>
            {accountType === 'admin' && (
                <button
                    className='button-outline button-loading button-icon'
                    onClick={handleDelete}
                    disabled={loadingDelete}
                >
                    <span>{loadingDelete ? 'Deleting...' : 'Delete'}</span><TrashIcon />
                </button>
            )}
            <button
                className='button-solid button-icon'
                onClick={onExport}
            >
                <span>Export Data</span><ArrowDownTrayIcon />
            </button>
        </div>
    )
}
