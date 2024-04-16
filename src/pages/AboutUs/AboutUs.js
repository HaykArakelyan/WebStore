import React from 'react'
import styles from './AboutUs.module.css'

export default function AboutUs() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                About Us
            </div>
            <div className={styles.text}>
                Welcome to our Capstone Project! At our core, we're a team of passionate students trying to bring our collective vision to life.
                With this project, we are not just building a website; we are creating an experience.
                Our goal is to blend creativity with functionality, delivering a platform that not only meets but exceeds expectations.
                From the sleek design to the unique user experience, every aspect of our website is crafted with precision and care.
            </div>
            <div className={styles.text}>
                Simply put, this Capstone Project is more than just a requirement; it's an opportunity.
                We are each bringing our unique skills and perspectives to the table.
                Driven by a shared ambition to grow and make a long-lasting impact, we navigate the challenges of this journey.
                Thus, this is an opportunity to showcase our creativity, problem-solving abilities, and dedication.
                An opportunity to push boundaries, challenge conventions, and leave a lasting impression.
            </div>
        </div>
    )
}
