import React from 'react'
import styles from './CustomButton.module.css'

export default function CustomButton({
    isDisabled = false,
    onClick,
    style = null,
    text,
}) {
    return (
        <button
            className={styles.container}
            type="button"
            onClick={onClick}
            style={style}
            disabled={isDisabled}
        >
            <div className={styles.title}>
                {text}
            </div>
        </button>
    )
}
