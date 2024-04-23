import React from 'react'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colorIdentifier } from '../../CustomTools/CustomTools'

export default function Star({
    colors,
    partialStar = 0,
    rating,
    style,
}) {
    return (
        <FontAwesomeIcon
            icon={faStar}
            style={{
                ...style,
                color: colorIdentifier(rating, colors),
                clipPath: `inset(0 ${partialStar}% 0 0)`
            }}
        />
    )
}
