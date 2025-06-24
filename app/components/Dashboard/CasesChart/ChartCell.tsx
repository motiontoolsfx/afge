// ChartCell.tsx
import Link from 'next/link'
import { ChangeEvent } from 'react'

interface Props {
    question: any
    value: string | null
    users: { id: string; fname: string; lname: string }[];
    onChange: (newValue: string) => void;
    accountType: string;
}

export default function ChartCell({ question, value, users, onChange, accountType }: Props) {
    const safeValue = value ?? ''

    if (accountType === 'steward') {
        if (question.id === 'progress' || question.id === 'notes' || question.id === 'documents' || question.type == 'file') {
            // show full editable/selectable input as below
        } else {
            return (<p>{safeValue}</p>)
        }
    } else if (accountType !== 'admin') {
        return (<p>{safeValue}</p>)
    }

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
                    {!question.required && <option value={''}>Select</option>}
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
            return (
                <select
                    value={safeValue}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                >
                    {!question.required && <option value={''}>Not Assigned</option>}
                    {users.map((user, index) => (
                        <option key={index} value={user.id}>
                            {user.fname} {user.lname}
                        </option>
                    ))}
                </select>
            );
        case 'file':
            return safeValue ? (
                <Link className='downloadBtn' href={safeValue} target='_blank' rel='noopener noreferrer'>
                    Download File
                </Link>
            ) : (
                <div>None</div>
            )
        default:
            return <div>Error</div>
    }
}
