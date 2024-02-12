import React, { useState, useEffect } from 'react'
import styles from "./Login.module.css"
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomCheckbox from '../../components/customComponents/CustomCheckbox'
import { motion } from 'framer-motion'
import { routeVariants } from '../../Navigation/RouteVariants'

import { isEmpty } from '../../CustomTools/CustomTools'
import { Link } from 'react-router-dom'

import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import { get_token_login, get_user_by_id } from '../../CustomTools/Requests'

export default function Login() {
  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [passwd, setPasswd] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false)

  const [user, setUser] = useState({})

  // useEffect(() => {
  //   areValidCredentials()
  // }, [passwd, login])

  // const areValidCredentials = () => {
  //   if (isEmpty(login) || isEmpty(passwd)) {
  //     setIsDisabled(true)
  //     return true
  //   }
  //   setIsDisabled(false)
  //   return false
  // }

  const handleLoginClick = () => {
    get_token_login(login, passwd)
      .then(userId => {
        if (userId) {
          get_user_by_id(userId)
            .then((userdata) => {
              setUser(userdata)
              navigate(`/user-profile/${userdata.id}`)
            }).catch((err) => {
              console.log(err)
            })

        }
      })
      .catch((err) => {
        console.log(err)
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
          <CustomCheckbox
            text={"Remember Me"}
            onChange={setIsCheckBoxChecked}
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
