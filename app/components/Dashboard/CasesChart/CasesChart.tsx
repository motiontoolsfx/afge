'use client'
import { useState, useCallback } from 'react'
import { useCases } from './hooks/useCases'
import ChartCell from './ChartCell'
import styles from './styles/casesChart.module.css'
import Pagination from './Pagination'
import ChartTools from './ChartTools'
import HeaderChartCell from './HeaderChartCell'
import Loader from '../../Loader/Loader'
import MsgBox from '../../MsgBox/MsgBox'

interface Props {
    token: string
    accountType: string
}

function useMessage(timeout = 3000) {
    const [message, setMessage] = useState<{ msg: string; status: 'success' | 'warning' | 'error' } | null>(null)

    const showMessage = useCallback((msg: string, status: 'success' | 'warning' | 'error') => {
        setMessage({ msg, status })
        setTimeout(() => setMessage(null), timeout)
    }, [timeout])

    return { message, showMessage }
}

export default function CasesChart({ token, accountType }: Props) {
    const { message, showMessage } = useMessage()

    const {
        cases,
        isLoadingCases,
        page,
        setPage,
        updates,
        handleCellChange,
        handleSave: originalHandleSave,
        handleDelete: originalHandleDelete,
        selectedRows,
        setSelectedRows,
        users,
        allQuestions,
        filters,
        setFilters,
        handleExport,
    } = useCases({ token, accountType })

    const handleSave = async () => {
        try {
            await originalHandleSave()
            showMessage('Changes saved successfully', 'success')
        } catch {
            showMessage('Failed to save changes', 'error')
        }
    }

    const handleDelete = async () => {
        try {
            await originalHandleDelete()
            showMessage('Rows deleted successfully', 'success')
        } catch {
            showMessage('Failed to delete rows', 'error')
        }
    }

    return (
        <div className={styles.container}>
            <ChartTools
                onSave={handleSave}
                updates={updates}
                selected={selectedRows.size > 0}
                onDelete={handleDelete}
                onExport={handleExport}
                accountType={accountType}
                selectedRows={selectedRows}
                cases={cases}
            />

            {isLoadingCases ? (
                <Loader />
            ) : (
                <>
                    {message && <MsgBox msg={message.msg} status={message.status} />}
                    <div className={styles.chartContainer}>
                        <table className="table">
                            <thead>
                                <tr>
                                    {accountType === 'admin' && <th className="chart-header-cell">Select</th>}
                                    {allQuestions.map((q, i) => (
                                        <th className="chart-header-cell" key={i}>
                                            <HeaderChartCell question={q} filters={filters} setFilters={setFilters} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cases.data.map((item, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {accountType === 'admin' && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.has(rowIdx)}
                                                    onChange={() =>
                                                        setSelectedRows((prev) => {
                                                            const newSet = new Set(prev)
                                                            newSet.has(rowIdx) ? newSet.delete(rowIdx) : newSet.add(rowIdx)
                                                            return newSet
                                                        })
                                                    }
                                                />
                                            </td>
                                        )}
                                        {allQuestions.map((q, colIdx) => {
                                            const isEdited = updates[rowIdx]?.[q.id] !== undefined
                                            return (
                                                <td key={colIdx} className={isEdited ? 'chart-changed' : undefined}>
                                                    <ChartCell
                                                        question={q}
                                                        value={item[q.id]}
                                                        users={users}
                                                        onChange={(value) => handleCellChange(rowIdx, q.id, value)}
                                                        accountType={accountType}
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {cases.data.length === 0 && <div className={styles.chartMsg}><p>No Cases Found</p></div>}
                </>
            )}

            <Pagination page={page} setPage={setPage} totalPages={cases.totalPages} totalCases={cases.totalCases || 0} />
        </div>
    )
}
