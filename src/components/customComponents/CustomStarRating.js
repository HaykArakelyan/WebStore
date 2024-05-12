import React, { useState } from "react";
import styles from './CustomStarRating.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'

export default function CustomStarRating({
    onChange,
    startStyle,
    style,
}) {
    const [rating, setRating] = useState(0);

    const handleRating = (rate) => {
        setRating(rate);
        onChange(rate)
    };

    return (
        <div
            className={styles.container}
            style={style}
        >
            {[1, 2, 3, 4, 5].map((star, index) => (
                <FontAwesomeIcon
                    key={index}
                    icon={star <= rating ? faStarSolid : faStarRegular}
                    onClick={() => handleRating(star)}
                    style={{ cursor: 'pointer', color: 'gold', fontSize: "1.8rem", ...startStyle }}
                />
            ))}
        </div>
    );
}
