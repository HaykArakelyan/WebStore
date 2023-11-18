import React from 'react'
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
    iconStyle = null
}) {
    return (
        <div className={styles.container}>
            <input
                type={type}
                placeholder={placeholder}
                className={styles.input}
                onChange={(e) => onChange(e.target.value)}
                style={style}
            />
            {icon && onIconClick ?
                <CustomIcon
                    icon={icon}
                    onClick={onIconClick}
                    size={iconSize}
                    style={iconStyle}
                /> : null
            }
        </div>
    )
}
