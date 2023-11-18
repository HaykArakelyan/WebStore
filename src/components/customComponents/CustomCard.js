import React from 'react'
import styles from './CustomCard.module.css'
import CustomImage from './CustomImage'

import { faStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { colorIdentifier } from '../../CustomTools/CustomTools'

export default function CustomCard({ p }) {
    const colors = {
        lowRank: "red",
        midRank: "yellow",
        highRank: "green"
    }

    console.log(colorIdentifier(4.92))

    return (
        <div className={styles.container}>
            <CustomImage
                url={p.images[0]}
                name={p.title}
            />
            <label className={styles.title}>
                {p.title}
            </label>
            <label
                className={styles.description}
                title={p.description}
            >
                {p.description}
            </label>
            <div className={styles.bottomCard}>
                <label className={styles.rating}>
                    {p.rating}
                    <FontAwesomeIcon
                        icon={faStar}
                        style={{
                            color: colorIdentifier(p.rating, colors)
                        }}
                    />
                </label>
                <label className={styles.price}>
                    ${p.price}
                </label>
            </div>
        </div>
    )
}
