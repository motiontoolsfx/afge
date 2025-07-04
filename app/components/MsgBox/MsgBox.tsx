import styles from './msgBox.module.css';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Props {
    msg: string;
    status: 'success' | 'warning' | 'error';
}

const statusColors = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
};

export default function MsgBox({ msg, status }: Props) {
    const Icon = {
        success: CheckCircleIcon,
        warning: ExclamationTriangleIcon,
        error: XCircleIcon,
    }[status];

    return (
        <div className={`${styles.msgBox} card`}>
            <div className={styles.line} style={{ backgroundColor: statusColors[status] }} />
            <Icon className={styles.icon} style={{ color: statusColors[status] }} />
            <p>{msg}</p>
        </div>
    );
}
