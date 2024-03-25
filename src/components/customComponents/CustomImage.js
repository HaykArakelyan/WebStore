import React from 'react'
import styles from './CustomImage.module.css'

export default function CustomImage({ url, name, style }) {
    // console.log(url)
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
