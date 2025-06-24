'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon } from "@heroicons/react/24/solid";

import styles from './login.module.css'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) router.push('/dashboard')
        else alert('Login failed')
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <UserCircleIcon className={styles.icon}/>
            <h2>User Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" className='button-solid'>Login</button>
        </form>
    )
}
