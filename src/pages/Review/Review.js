import React, { useState } from 'react'
import styles from './Review.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomDropdown from '../../components/customComponents/CustomDropdown'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomTextArea from '../../components/customComponents/CustomTextArea'


const ratingValues = [1, 2, 3, 4, 5]

export default function Review({
    onSubmit,
    reviews
}) {

    console.log(reviews)

    const [rating, setRating] = useState(5)
    const [review, setReview] = useState("")

    return (
        <div className={styles.container}>

            <div className={styles.reviewTitle}>
                <span>ADD REVIEW</span>
            </div>

            <div className={styles.allReviews}>
                {/* {reviews.map((r, i) => {
                    <div key={i}>
                        {r.comment}
                    </div>
                })} */}
            </div>

            <div className={styles.reviewRating}>
                <CustomDropdown
                    options={ratingValues}
                    onSelect={(e) => setRating(e)}
                />
            </div>

            <div className={styles.reviewBox}>
                <CustomTextArea
                    value={review}
                    onChange={setReview}
                    placeholder={"Your Review Here"}
                    style={{
                        height: "5rem"
                    }}
                />
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
