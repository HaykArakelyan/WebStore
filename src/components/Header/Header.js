import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import CustomButton from '../customComponents/CustomButton'
import { clearStorage, isAuth } from '../../CustomTools/CustomTools'

import logo from '../../assets/logo/logo_removed_bg.png'
export default function Header() {
  const navigate = useNavigate()

  const [isUserAuth, setIsUserAuth] = useState(isAuth());

  useEffect(() => {
    setIsUserAuth(isAuth())
  }, [isAuth()])

  useEffect(() => {
    if (isUserAuth) {
      // navigate("/user-profile", { replace: true })
    }
  }, [])


  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <img
              src={logo}
              className={styles.logo}
              onClick={handleLogoClick}
            />
          </div>
          <ul className={styles.ul}>
            {/* <li><Link to={'/'} className={styles.a}>Home</Link></li> */}
            <li><Link to={'/dashboard'} className={styles.a}>Dashboard</Link></li>
            {isUserAuth ?
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
          </ul>
        </div>
        {isUserAuth ?
          <div className={styles.profileButtons}>
            <CustomButton
              text={'My Profile'}
              onClick={() => navigate(`/user-profile`)}
            />
            <CustomButton
              text={"Sign Out"}
              onClick={() => {
                clearStorage()
                navigate('/login')
              }}
            />
          </div> :
          <div className={styles.authButtons}>
            <CustomButton
              text={"Sign In"}
              onClick={() => navigate("/login")}
            />
            <CustomButton text={"Sing Up"}
              onClick={() => navigate("/register")}
            />
          </div>
        }

      </div>
      <div className={styles.bottomBar} />
    </div>
  )
}
