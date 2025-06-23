import { useState, useEffect, useCallback } from 'react'
import formJson from '../../../../../data/form.json'
import { fetchCases } from '../lib/fetchCases'

interface CaseItem { [key: string]: any }

export interface CasesState {
    data: CaseItem[]
    totalPages: number
    totalCases?: number
}

type UpdateMap = {
    [rowIdx: number]: {
        [questionId: string]: string
    }
}

export function useCases(token: string) {
    const [cases, setCases] = useState<CasesState>({ data: [], totalPages: 1 })
    const [original, setOriginal] = useState<CaseItem[]>([])
    const [page, setPage] = useState<number>(1)
    const [updates, setUpdates] = useState<UpdateMap>({})
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
    const [users, setUsers] = useState<any[]>([])
    const [filters, setFilters] = useState({})

    useEffect(() => {
        console.log(filters)
        if (!token) return
        fetchCases(token, page, filters)
            .then(data => {
                const d = data.data || []
                setCases({ data: d, totalPages: data.totalPages || 1, totalCases: data.totalCases })
                setUsers(data.users || [])
                setOriginal(d)
                setUpdates({})
                setSelectedRows(new Set())
            })
            .catch(console.error)
    }, [token, page, filters])

    const handleCellChange = useCallback(
        (rowIdx: number, questionId: string, newValue: string) => {
            const origValue = original[rowIdx]?.[questionId] ?? ''
            setCases(prev => {
                const dataCopy = [...prev.data]
                dataCopy[rowIdx] = { ...dataCopy[rowIdx], [questionId]: newValue }
                return { ...prev, data: dataCopy }
            })
            setUpdates(prev => {
                if (newValue === origValue) {
                    const { [questionId]: _, ...restFields } = prev[rowIdx] || {}
                    if (Object.keys(restFields).length === 0) {
                        const { [rowIdx]: __, ...restRows } = prev
                        return restRows
                    }
                    return { ...prev, [rowIdx]: restFields }
                }
                return { ...prev, [rowIdx]: { ...prev[rowIdx], [questionId]: newValue } }
            })
        },
        [original]
    )

    const handleSave = useCallback(async () => {
        const changes = Object.entries(updates).map(([rowIdx, fields]) => ({
            id: cases.data[Number(rowIdx)].id,
            ...fields
        }))
        try {
            await fetch(`/api/cases`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ changes })
            })
            setUpdates({})
        } catch (e) {
            console.error(e)
        }
    }, [updates, cases.data, token])

    const handleDelete = useCallback(async () => {
        const idsToDelete = Array.from(selectedRows).map(idx => cases.data[idx].id)
        try {
            await fetch(`/api/cases`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ cases: idsToDelete })
            })
            setSelectedRows(new Set())
            setCases(prev => ({
                ...prev,
                data: prev.data.filter((_, idx) => !selectedRows.has(idx)),
                totalCases: ((prev.totalCases || 0) - selectedRows.size)
            }))
        } catch (e) {
            console.error(e)
        }
    }, [selectedRows, cases.data, token])

    const allQuestions = [
        { id: 'user', title: 'Assigned Steward', type: 'user' },
        {
            id: 'progress', title: 'Progress', type: 'dropdown', options: [
                { id: 'Not_Started', option: 'Not Started' },
                { id: 'In_Progress', option: 'In Progress' },
                { id: 'Meeting_Set', option: 'Meeting Set' },
                { id: 'Awaiting_Response', option: 'Awaiting Response' },
                { id: 'Esculated', option: 'Esculated' },
                { id: 'Complete', option: 'Complete' }
            ], required: false
        },
        { id: 'notes', title: 'Notes', type: 'short_answer' },
        ...formJson.sections.flatMap(section => section.questions)
    ]

    return {
        cases,
        page,
        setPage,
        updates,
        handleCellChange,
        handleSave,
        handleDelete,
        selectedRows,
        setSelectedRows,
        users,
        allQuestions,
        filters,
        setFilters
    }
}
