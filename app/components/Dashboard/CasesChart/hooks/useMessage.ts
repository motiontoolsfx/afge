import { useState, useCallback } from 'react'

function useMessage(timeout = 3000) {
    const [message, setMessage] = useState<{ msg: string; status: 'success' | 'warning' | 'error' } | null>(null)

    const showMessage = useCallback((msg: string, status: 'success' | 'warning' | 'error') => {
        setMessage({ msg, status })
        setTimeout(() => setMessage(null), timeout)
    }, [timeout])

    return { message, showMessage }
}
