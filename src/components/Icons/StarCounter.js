import React from 'react'
import Star from './Star'

export default function StarCounter({
    rating,
    title,
}) {

    const PARTIAL_STAR = (rating % 1) * 100

    return (
        <div title={title}>
            {rating && [...Array(Math.floor(rating))].map((_, i) => <Star rating={4} key={i} />)}
            <Star
                rating={4}
                partialStar={100 - PARTIAL_STAR}
            />
        </div>
    )
}
