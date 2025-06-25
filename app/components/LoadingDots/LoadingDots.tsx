import styles from './loadingDots.module.css'

export default function LoadingDots({ color = 'light' }: { color?: string }) {
    const classes = styles.loader + ' ' + (color === 'dark' ? styles.dark : styles.light);

    return (
        <div className={classes}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}