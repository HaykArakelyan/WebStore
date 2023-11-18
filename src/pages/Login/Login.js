import React, { useState, useEffect } from 'react'
import styles from "./Login.module.css"
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomCheckbox from '../../components/customComponents/CustomCheckbox'
import { motion } from 'framer-motion'
import { routeVariants } from '../../Navigation/RouteVariants'

import { isEmpty } from '../../CustomTools/CustomTools'
import { Link } from 'react-router-dom'

export default function Login() {
  const [login, setLogin] = useState('')
  const [passwd, setPasswd] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false)

  useEffect(() => {
    areValidCredentials()
  }, [passwd, login])

  const areValidCredentials = () => {
    if (isEmpty(login) || isEmpty(passwd)) {
      setIsDisabled(true)
      return
    }
    setIsDisabled(false)
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
          <CustomCheckbox
            text={"Remember Me"}
            onChange={setIsCheckBoxChecked}
          />
          <CustomButton
            text={"Click Me!"}
            onClick={() => console.log(login, passwd)}
            style={{ marginTop: "8px" }}
            isDisabled={isDisabled}
          />

          <Link to={"/register"} className={styles.linkToReg}>
            Don't have an account yet?
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
