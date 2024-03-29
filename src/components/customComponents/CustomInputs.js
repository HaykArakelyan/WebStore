import React, { useRef, useEffect } from 'react'
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
    inputContainerRef = null,
    value,
    parentStyle
}) {

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputContainerRef) {
            inputContainerRef.current = {
                click: () => inputRef.current?.click(),
            };
        }
    }, [inputContainerRef]);


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
        <div className={styles.container} style={parentStyle} ref={inputContainerRef}>
            <input
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                className={styles.input}
                onChange={(e) =>
                    onChange(type === "file" ? e.target.files[0] : e.target.value)
                }
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
