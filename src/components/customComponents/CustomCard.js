import React from 'react'
import styles from './CustomCard.module.css'
import CustomImage from './CustomImage'

import Star from '../Icons/Star'

export default function CustomCard({ p, onClick }) {
    const colors = {
        lowRank: {
            red: 255,
            green: 0,
            blue: 0
        },
        midRank: {
            red: 255,
            green: 255,
            blue: 0
        },
        highRank: {
            red: 0,
            green: 255,
            blue: 0
        }
    }

    return (
        <div
            className={styles.container}
            onClick={onClick}
        >
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
                    <Star rating={p.rating} colors={colors} />
                    {p.rating}
                </label>
                <label className={styles.price}>
                    ${p.price}
                </label>
            </div>
        </div>
    )
}
