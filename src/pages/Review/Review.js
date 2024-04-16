import React, { useState } from 'react'
import styles from './Review.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomDropdown from '../../components/customComponents/CustomDropdown'
import CustomButton from '../../components/customComponents/CustomButton'


const ratingValues = [1, 2, 3, 4, 5]

export default function Review({ onSubmit, reviews }) {

    const [rating, setRating] = useState(5)
    const [subject, setSubject] = useState("")
    const [review, setReview] = useState("")
    // const [allReviews, setAllReviews] = (reviews)


    return (
        <div className={styles.container}>

            <div className={styles.reviewTitle}>
                <span>ADD REVIEW</span>
            </div>

            <div className={styles.allReviews}>
                {/* {allReviews.map((r, i) => {
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
                <CustomInputs
                    style={{
                        height: 100,
                        textAlign: "left"
                    }}
                    onChange={setReview}
                    value={review}
                />
            </div>

            <div className={styles.sendReview}>
                <CustomButton
                    onClick={() => onSubmit({ reviews: review, subject, rating: rating })}
                    text={"Send Review"}
                />
            </div>
        </div>
    )
}
