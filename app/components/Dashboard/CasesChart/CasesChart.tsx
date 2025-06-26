// CasesChart.tsx
'use client'
import { useCases } from './hooks/useCases'
import ChartCell from './ChartCell'
import styles from './styles/casesChart.module.css'
import Pagination from './Pagination'
import ChartTools from './ChartTools'
import HeaderChartCell from './HeaderChartCell'
import Loader from '../../Loader/Loader'

interface Props {
    token: string,
    accountType: string
}

export default function CasesChart({ token, accountType }: Props) {
    const {
        cases,
        isLoadingCases,
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
        setFilters,
        handleExport
    } = useCases({ token, accountType })

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
                    <div className={styles.chartContainer}>
                        <table className="table">
                            <thead>
                                <tr>
                                    {accountType === 'admin' && <th className="chart-header-cell">Select</th>}
                                    {allQuestions.map((q, i) => (
                                        <th className="chart-header-cell" key={i}>
                                            <HeaderChartCell
                                                question={q}
                                                filters={filters}
                                                setFilters={setFilters}
                                            />
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
                                                        setSelectedRows(prev => {
                                                            const newSet = new Set(prev);
                                                            newSet.has(rowIdx) ? newSet.delete(rowIdx) : newSet.add(rowIdx);
                                                            return newSet;
                                                        })
                                                    }
                                                />
                                            </td>
                                        )}
                                        {allQuestions.map((q, colIdx) => {
                                            const isEdited = updates[rowIdx]?.[q.id] !== undefined;
                                            return (
                                                <td key={colIdx} className={isEdited ? 'chart-changed' : undefined}>
                                                    <ChartCell
                                                        question={q}
                                                        value={item[q.id]}
                                                        users={users}
                                                        onChange={value => handleCellChange(rowIdx, q.id, value)}
                                                        accountType={accountType}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {cases.data.length === 0 && (
                        <div className={styles.chartMsg}><p>No Cases Found</p></div>
                    )}
                </>
            )}

            <Pagination
                page={page}
                setPage={setPage}
                totalPages={cases.totalPages}
                totalCases={cases.totalCases || 0}
            />
        </div >
    )
}
