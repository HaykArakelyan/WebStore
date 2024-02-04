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

export default function Login() {
  const navigate = useNavigate()

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
      return true
    }
    setIsDisabled(false)
    return false
  }

  const handleLoginClick = () => {
    //if user is logged in
    //TODO **Simulation of getting the data of the current User**
    // Scenario is the following:
    // Front -(login, password)-> Back
    // Front <-(JWT with user-data)- Back
    // Front redirect(/user-profile/<username>)
    // Currently login, but we should extract username having email

    const fake_user = {
      "id": 1,
      "info": {
        "firstName": "Hayk",
        "lastName": "Arakelyan",
        "email": "hayk.arakelyan@gmail.com",
        "phone": "+37477345227",
        "gender": "male",
        "age": 21,
        "address": "Armenia, Yerevan, bla bla bla",
        "balance": 1000
      },
      "imageUrl": "",
      "products": [{
        "id": 1,
        "title": "iPhone 9",
        "description": "An apple mobile which is nothing like apple",
        "price": 549,
        "discountPercentage": 12.96,
        "rating": 4.69,
        "stock": 94,
        "brand": "Apple",
        "category": "smartphones",
        "thumbnail": "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        "images": [
          "https://cdn.dummyjson.com/product-images/1/1.jpg",
          "https://cdn.dummyjson.com/product-images/1/2.jpg",
          "https://cdn.dummyjson.com/product-images/1/3.jpg",
          "https://cdn.dummyjson.com/product-images/1/4.jpg",
          "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
        ]
      },
      {
        "id": 2,
        "title": "iPhone X",
        "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
        "price": 899,
        "discountPercentage": 17.94,
        "rating": 4.44,
        "stock": 34,
        "brand": "Apple",
        "category": "smartphones",
        "thumbnail": "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
        "images": [
          "https://cdn.dummyjson.com/product-images/2/1.jpg",
          "https://cdn.dummyjson.com/product-images/2/2.jpg",
          "https://cdn.dummyjson.com/product-images/2/3.jpg",
          "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg"
        ]
      }],
      "cart": [{
        "id": 5,
        "title": "Huawei P30",
        "description": "Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.",
        "price": 499,
        "discountPercentage": 10.58,
        "rating": 4.09,
        "stock": 32,
        "brand": "Huawei",
        "category": "smartphones",
        "thumbnail": "https://cdn.dummyjson.com/product-images/5/thumbnail.jpg",
        "images": [
          "https://cdn.dummyjson.com/product-images/5/1.jpg",
          "https://cdn.dummyjson.com/product-images/5/2.jpg",
          "https://cdn.dummyjson.com/product-images/5/3.jpg"
        ]
      }]
    }


    const arg = fake_user.id
    if (areValidCredentials) {
      navigate(`/user-profile/${arg}`, { state: { user: fake_user } })
    }
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
