import React, { useState, useEffect } from 'react'
import styles from "./Login.module.css"
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomCheckbox from '../../components/customComponents/CustomCheckbox'
import { motion } from 'framer-motion'
import { routeVariants } from '../../Navigation/RouteVariants'
import { isAuth, } from '../../CustomTools/CustomTools'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

import { get_token_login } from '../../CustomTools/Requests'
import { useMessageBox } from '../../components/Messages/MessageBox'

export default function Login() {
  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [passwd, setPasswd] = useState('')

  const { showMessage } = useMessageBox()

  useEffect(() => {
    if (isAuth()) {
      navigate(`/user-profile/${sessionStorage.getItem('id')}`)
    }
  }, [isAuth()])

  const handleLoginClick = () => {
    get_token_login(login, passwd)
      .then(userId => {
        if (userId) {
          showMessage({ msg: "Login Successful", msgType: "success" })
          navigate(`/user-profile/${userId}`, { replace: true })
        }
      })
      .catch((err) => {
        showMessage({ msg: "Invalid Credentials", msgType: "error" })
      });
  }

  return (
    <motion.div
      className={styles.container}
      variants={routeVariants}
      initial='initial'
      animate='final'
    >
      <div className={styles.innerContainer}>
        <div className={styles.loginBox}>
          <CustomInputs
            type={"text"}
            placeholder={"example@gmail.com"}
            onChange={setLogin}
          />
          <CustomInputs
            type={"password"}
            placeholder={"MySuperPassword"}
            onChange={setPasswd}
          />
          <CustomButton
            text={"Sign In!"}
            onClick={() => handleLoginClick()}
            style={{ marginTop: "8px" }}
          />

          <Link to={"/register"} className={styles.linkToReg}>
            Don't have an account yet?
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
