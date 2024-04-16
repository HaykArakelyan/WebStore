import React, { useEffect } from 'react'
import styles from "./Home.module.css"
import { useMessageBox } from '../../components/Messages/MessageBox'
import CustomButton from '../../components/customComponents/CustomButton'
import { useNavigate } from 'react-router-dom'
import CustomImage from '../../components/customComponents/CustomImage'
import phoneImage from '../../assets/home/home_phone.png'

export default function Home({ }) {
  const { showMessage } = useMessageBox()

  const naviagate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.slogan}>
          <span>
            Advertise Smarter: Unleash Your Product's Potential.
          </span>
        </div>
        <div className={styles.message}>
          <span>
            Don't Hesitate, Join Us!
          </span>
          <CustomButton
            text={"Join Us"}
            onClick={() => naviagate('/login')}
          />
        </div>
      </div>
      <div className={styles.phoneImage}>
        <img src={phoneImage} />
      </div>
    </div>
  )
}
