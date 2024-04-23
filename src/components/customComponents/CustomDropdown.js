import React, { useRef } from 'react'
import styles from './CustomDropdown.module.css'

export default function CustomDropdown({
    onSelect,
    options = [],
    selectedValue,
}) {

    const selectRef = useRef()

    return (
        <div
            className={styles.container}
            title={selectedValue}
        >
            <select
                className={styles.selectBox}
                value={selectedValue}
                onChange={(e) => {
                    onSelect(e.target.value)
                    if (selectRef.current) {
                        selectRef.current.blur()
                    }
                }}
                ref={selectRef}
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
