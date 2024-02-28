import React from 'react'
import styles from './Loader.module.css'
import ReactLoading from 'react-loading'

export default function Loader() {
    return (
        <div className={styles.container}>
            <label>Loading</label>
            <ReactLoading
                type='bubbles'
                color='#515151'
                width={32}
                height={32}
            />
        </div>
    )
}
