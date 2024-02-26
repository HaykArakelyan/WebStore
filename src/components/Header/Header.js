import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import CustomButton from '../customComponents/CustomButton'
import { clearStorage, isAuth } from '../../CustomTools/CustomTools'
import { get_products_by_userId } from '../../CustomTools/Requests'
import CustomImage from '../customComponents/CustomImage'

import logo from '../../assets/logo/logo_removed_bg.png'
export default function Header() {
  const navigate = useNavigate()

  const userId = sessionStorage.getItem("id")
  const [isUserAuth, setIsUserAuth] = useState(isAuth());
  const [userProducts, setUserProducts] = useState([])

  useEffect(() => {
    setIsUserAuth(isAuth())
  }, [isAuth()])

  useEffect(() => {
    if (isUserAuth) {
      // navigate(`/user-profile/${userId}`, { replace: true })
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
            <li><Link to={'/'} className={styles.a}>Home</Link></li>
            <li><Link to={'/dashboard'} className={styles.a}>Dashboard</Link></li>
            {isUserAuth &&
              <li>
                <Link
                  to={'/my-products'}
                  state={{
                    products: userProducts
                  }}
                  className={styles.a}
                >
                  My Products
                </Link>
              </li>
            }
          </ul>
        </div>
        {isUserAuth ?
          <div className={styles.profileButtons}>
            <CustomButton
              text={'My Profile'}
              onClick={() => navigate(`/user-profile/${userId}`)}
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
