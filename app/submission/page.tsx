import Link from 'next/link'
import styles from './submission.module.css'

import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Submission() {
    return (
        <div className={`${styles.form} page-width`}>
            <CheckCircleIcon className={styles.icon} />
            <h2>Thank You!</h2>
            <p>Your request for assistance was successfully submited.</p>
            <small>A team member will be in touch with you shortly.</small>
            <Link className={`${styles.link} button-solid`} href={'/'}>Submit another form</Link>
        </div>
    )
}