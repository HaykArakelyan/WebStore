import React from 'react'
import styles from './CustomBox.module.css'

export default function CustomBox({ children, style }) {
    return (
        <div
            className={styles.container}
            style={style}
        >
            {children}
        </div>
    )
}
