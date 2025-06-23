import { useState } from 'react'

interface Props {
    onSave: () => Promise<void>
    onDelete: () => Promise<void>
    selected: boolean;
    updates: any
}

export default function ChartTools({ onSave, onDelete, selected, updates }: Props) {
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
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button
                className={updates && Object.keys(updates).length === 0 ? 'button-solid' : 'button-solid button-loading'}
                onClick={handleSave}
                disabled={updates && Object.keys(updates).length === 0 || loadingSave}
            >
                {loadingSave ? 'Saving...' : 'Save Changes'}
            </button>
            <button
                className="button-outline button-loading"
                onClick={handleDelete}
                disabled={loadingDelete}
            >
                {loadingDelete ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    )
}
