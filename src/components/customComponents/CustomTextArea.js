import React, { useCallback, useRef } from 'react'
import styles from './CustomTextArea.module.css'

export default function CustomTextArea({ value, placeholder, onChange, style }) {
    const textAreaRef = useRef(null)

    const handleKeyDown = useCallback(e => {
        if (e.key === 'Escape') {
            textAreaRef.current.blur();
        }
    }, [])

    return (
        <div className={styles.container}>
            <textarea
                ref={textAreaRef}
                value={value}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onChange={e => onChange(e.target.value)}
                className={styles.textArea}
                style={style}
            >
            </textarea>
        </div>
    )
}
