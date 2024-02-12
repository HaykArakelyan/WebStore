import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import CustomButton from '../customComponents/CustomButton'

export default function Header() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.navbar}>
          <ul className={styles.ul}>
            <li><Link to={'/'} className={styles.a}>Home</Link></li>
            <li><Link to={'/dashboard'} className={styles.a}>Dashboard</Link></li>
            <li><Link to={'/'} className={styles.a}>Home</Link></li>
            <li><Link to={'/login'} className={styles.a}>Sign In</Link></li>
            <li><Link to={'/register'} className={styles.a}>Sign Up</Link></li>
            <li><Link to={`/user-profile/${localStorage.getItem("id")}`} className={styles.a}>My Page</Link></li>
          </ul>
        </div>
        <div className={styles.authButtons}>
          <CustomButton
            text={"Sign In"}
            onClick={() => navigate("/login")}
          />
          <CustomButton text={"Sing Up"}
            onClick={() => navigate("/register")}
          />
        </div>
      </div>
      <div className={styles.bottomBar} />
    </div>
  )
}
