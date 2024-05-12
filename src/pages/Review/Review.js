import React, { useState } from 'react'
import styles from './Review.module.css'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomTextArea from '../../components/customComponents/CustomTextArea'
import { formatDate } from '../../CustomTools/CustomTools'
import CustomStarRating from '../../components/customComponents/CustomStarRating'



const ratingValues = [1, 2, 3, 4, 5]

export default function Review({
    onSubmit,
    reviews
}) {
    const [rating, setRating] = useState(5)
    const [review, setReview] = useState("")

    return (
        <div className={styles.container}>

            <div className={styles.reviewTitle}>
                <span>ADD REVIEW</span>
            </div>

            <div className={styles.content}>
                {reviews.length > 0
                    ? <div className={styles.reviewsList}>
                        {reviews.map((r, index) =>
                            <div className={styles.reviewConatiner} key={index}>
                                <div className={styles.reviewComment}>
                                    {r.comment}
                                </div>

                                <div className={styles.reviewDate}>
                                    {formatDate(r.posted_at)}
                                </div>
                            </div>
                        )}
                    </div>
                    : <div className={styles.reviewConatiner}>
                        <i>No Reviews Yet. Be The First One to Give a Review!</i>
                    </div>
                }

                <div className={styles.inputs}>
                    <CustomStarRating
                        onChange={(rate) => setRating(rate)}
                        style={{ alignSelf: "center" }}
                    />

                    <CustomTextArea
                        value={review}
                        onChange={setReview}
                        placeholder={"Your Review Here"}
                        style={{ minHeight: "5rem" }}
                    />
                </div>
            </div>

            <div className={styles.sendReview}>
                <CustomButton
                    onClick={() => onSubmit({ reviews: review, rating: rating })}
                    text={"Send Review"}
                />
            </div>
        </div>
    )
}
