import React from 'react'
import styles from './CustomImage.module.css'

export default function CustomImage({ url, name, style }) {
    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${url})`,
                ...style
            }}
            title={name}
        />
    )
}
