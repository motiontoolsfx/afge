// CasesChart.tsx
'use client'
import { useCases } from './hooks/useCases'
import ChartCell from './ChartCell'
import styles from './styles/casesChart.module.css'
import Pagination from './Pagination'
import ChartTools from './ChartTools'
import HeaderChartCell from './HeaderChartCell'

interface Props { token: string }

export default function CasesChart({ token }: Props) {
    const {
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
    } = useCases(token)

    return (
        <div className={styles.container}>
            <ChartTools
                onSave={handleSave}
                updates={updates}
                selected={selectedRows.size > 0}
                onDelete={handleDelete}
            />

            <div className={styles.chartContainer}>
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='chart-header-cell'></th>
                            {allQuestions.map((q, i) => (
                                <th className='chart-header-cell' key={i}>
                                    <HeaderChartCell question={q} filters={filters} setFilters={setFilters}/>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {cases.data.map((item, rowIdx) => (
                            <tr key={rowIdx}>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={selectedRows.has(rowIdx)}
                                        onChange={() => {
                                            setSelectedRows(prev => {
                                                const newSet = new Set(prev)
                                                if (newSet.has(rowIdx)) newSet.delete(rowIdx)
                                                else newSet.add(rowIdx)
                                                return newSet
                                            })
                                        }}
                                    />
                                </td>

                                {allQuestions.map((q, colIdx) => {
                                    const isEdited = updates[rowIdx]?.[q.id] !== undefined
                                    return (
                                        <td key={colIdx} className={isEdited ? styles.editedCell : undefined}>
                                            <ChartCell
                                                question={q}
                                                value={item[q.id]}
                                                users={users}
                                                onChange={value => handleCellChange(rowIdx, q.id, value)}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                setPage={setPage}
                totalPages={cases.totalPages}
                totalCases={cases.totalCases || 0}
            />
        </div>
    )
}
