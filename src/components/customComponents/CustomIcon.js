import React from 'react'
import styles from './CustomIcon.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CustomIcon({
    icon,
    size,
    onClick,
    style
}) {
    return (
        <div className={styles.container} style={style} onClick={onClick}>
            <FontAwesomeIcon icon={icon} size={size} />
        </div>
    )
}
