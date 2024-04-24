import React from 'react'
import styles from './VerifyEmail.module.css'
import verifyEmailImage from '../../assets/default/verify-email.png'
import CustomButton from '../../components/customComponents/CustomButton'
import { useNavigate } from 'react-router-dom'

export default function VerifyEmail() {

    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <div className={styles.content}>

                <div className={styles.verifyEmailImageContainer}>
                    <img src={verifyEmailImage} className={styles.verifyEmailImage} />
                </div>

                <div className={styles.message}>
                    We have sent a verification letter to your Email.
                </div>

                <div className={styles.message}>
                    Go check it first and come back!
                </div>

                <div className={styles.loginButtonContainer}>
                    <div className={`${styles.message}, ${styles.buttonLabel}`}>
                        If you verified than welcome on board!
                    </div>
                    <CustomButton
                        text={"Go To Login Page"}
                        onClick={() => navigate('/login')}
                    />
                </div>
            </div>

        </div>
    )
}
