// ChartCell.tsx
import Link from 'next/link'
import { ChangeEvent } from 'react'

interface Props {
    question: any
    value: string | null
    users: string[];
    onChange: (newValue: string) => void
}

export default function ChartCell({ question, value, users, onChange }: Props) {
    const safeValue = value ?? ''

    switch (question.type) {
        case 'short_answer':
            return (
                <input
                    type='text'
                    value={safeValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                />
            )
        case 'dropdown':
            return question.options?.length ? (
                <select
                    value={safeValue}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                >
                    {!question.required && <option value={""}>-- Select an option --</option>}
                    {question.options.map((opt: any) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.option}
                        </option>
                    ))}
                </select>
            ) : (
                <div>Error</div>
            )
        case 'user':
            return <select>
                {users.map((user, index) => (
                    <option key={index} value={user}>
                        {user}
                    </option>
                ))}
            </select>
        case 'file':
            return safeValue ? (
                <Link href={safeValue} target='_blank' rel='noopener noreferrer'>
                    Download File
                </Link>
            ) : (
                <div>None</div>
            )
        default:
            return <div>Error</div>
    }
}
