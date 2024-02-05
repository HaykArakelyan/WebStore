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
    iconStyle = null,
    value
}) {

    const handleIconClick = (e) => {
        e.stopPropagation()
        onIconClick()
    }


    return (
        <div className={styles.container}>
            <input
                type={type}
                placeholder={placeholder}
                className={styles.input}
                onChange={(e) => onChange(e.target.value)}
                style={style}
                value={value}

            />
            {icon && onIconClick ?
                <CustomIcon
                    icon={icon}
                    onClick={(e) => handleIconClick(e)}
                    size={iconSize}
                    style={iconStyle}
                /> : null
            }
        </div>
    )
}
