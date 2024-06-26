import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import CustomButton from '../customComponents/CustomButton'
import { clearStorage } from '../../CustomTools/CustomTools'
import { useAuth } from '../../auth/Auth'
import { logout } from '../../CustomTools/Requests'
import { useMessageBox } from '../Messages/MessageBox'

export default function Header() {
  const navigate = useNavigate()

  const { isAuth } = useAuth()
  const { showMessage } = useMessageBox()

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.navbar}>
          <ul className={styles.ul}>
            <li><Link to={'/'} className={styles.a}>Home</Link></li>
            <li><Link to={'/dashboard'} className={styles.a}>Dashboard</Link></li>

            {isAuth() ?
              <>
                <li>
                  <Link
                    to={'/my-products'}
                    className={styles.a}
                  >
                    My Products
                  </Link>
                </li>

                <li>
                  <Link
                    to={'/my-saves'}
                    className={styles.a}
                  >
                    My Saves
                  </Link>
                </li>
              </>
              :
              null
            }

            <li><Link to={'/contact-us'} className={styles.a}>Contact Us</Link></li>
            <li><Link to={'/about-us'} className={styles.a}>About Us</Link></li>
          </ul>
        </div>

        {isAuth()
          ? <div className={styles.profileButtons}>
            <CustomButton
              text={'My Profile'}
              onClick={() => navigate(`/user-profile`)}
            />

            <CustomButton
              text={"Sign Out"}
              onClick={() => {
                logout()
                  .then(res => {
                    clearStorage()
                    navigate('/login')
                    showMessage({ msg: res.message, msgType: "success" })
                  })
                  .catch(err => showMessage({ msg: err.msg, msgType: "error" }))
              }}
            />
          </div>
          : <div className={styles.authButtons}>
            <CustomButton
              text={"Sign In"}
              onClick={() => navigate("/login")}
            />

            <CustomButton text={"Sign Up"}
              onClick={() => navigate("/register")}
            />
          </div>
        }
      </div>

      <div className={styles.bottomBar} />

    </div>
  )
}
