import React from 'react'
import styles from './CustomDropdown.module.css'

export default function CustomDropdown({ options = [], selectedValue, onSelect }) {
    return (
        <div
            className={styles.container}
            title={selectedValue}
        >
            <select
                className={styles.selectBox}
                value={selectedValue}
                onChange={onSelect}
            >
                {options.map((o, i) =>
                    <option
                        key={i}
                        className={styles.option}
                        value={o}
                        title={o}
                    >
                        {o}
                    </option>
                )}
            </select>
        </div>
    )
}
