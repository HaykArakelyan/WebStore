import React, { useRef } from 'react'
import styles from "./Custominputs.module.css"
import CustomIcon from './CustomIcon'

export default function CustomInputs({
    type,
    placeholder,
    onChange,
    style,
    icon = null,
    onIconClick = null,
    iconSize = null,
    iconStyle = null,
    value,
    parentStyle
}) {

    const inputRef = useRef(null);

    const handleIconClick = (e) => {
        e.stopPropagation()
        onIconClick()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            inputRef.current.blur();
        }
    }

    return (
        <div className={styles.container} style={parentStyle}>
            <input
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                className={styles.input}
                onChange={(e) => onChange(e.target.value)}
                style={style}
                value={value}
                onKeyDown={handleKeyDown}
            />
            {icon && onIconClick ?
                <CustomIcon
                    icon={icon}
                    onClick={handleIconClick}
                    size={iconSize}
                    style={iconStyle}
                /> : null
            }
        </div>
    )
}
