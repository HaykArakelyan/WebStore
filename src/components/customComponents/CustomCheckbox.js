import styles from './CustomCheckbox.module.css'

export default function CustomCheckbox({
    defaultChecked,
    onChange,
    style,
    text,
}) {

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type={'checkbox'}
                defaultChecked={defaultChecked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label className={styles.title} style={style}>
                {text}
            </label>
        </div>
    )
}
