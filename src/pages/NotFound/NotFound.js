import React from 'react'
import styles from './NotFound.module.css'
import CustomButton from '../../components/customComponents/CustomButton'
import { useNavigate } from 'react-router-dom'
import notFoundImage from '../../assets/default/404.png'

export default function NotFound() {

    const navigate = useNavigate()

    return (
        <div className={styles.container}>
            <img src={notFoundImage} className={styles.notFoundImage} />

            <div className={styles.title}>
                Not Found
            </div>

            <div className={styles.goBackButton}>
                <CustomButton
                    text={"Go Back"}
                    onClick={() => navigate(-1, { replace: true })}
                />
            </div>
        </div>
    )
}
