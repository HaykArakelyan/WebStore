import styles from './CustomCheckbox.module.css'

export default function CustomCheckbox({ text, onChange }) {

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type={'checkbox'}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label className={styles.title}>
                {text}
            </label>
        </div>
    )
}
