'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon } from "@heroicons/react/24/solid"
import styles from './login.module.css'
import LoadingDots from '../components/LoadingDots/LoadingDots'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                router.push('/dashboard')
            } else {
                const { message } = await res.json()
                setError(message || 'Invalid username or password.')
                setLoading(false)
            }
        } catch {
            setError('Network error, please try again.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <UserCircleIcon className={styles.icon} />
            <h2>User Login</h2>

            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        passwordRef.current?.focus()
                    }
                }}
            />

            <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button
                type="submit"
                className="button-solid"
                disabled={loading || !username || !password}
            >
                {loading ? <LoadingDots /> : 'Login'}
            </button>

            {error && <p className={`${styles.error} requiredText`}>{error}</p>}
        </form>
    )
}
