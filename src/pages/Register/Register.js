import React, { useState } from 'react'
import styles from './Register.module.css'
import CustomBox from '../../components/customComponents/CustomBox'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { routeVariants } from '../../Navigation/RouteVariants'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import CustomDropdown from '../../components/customComponents/CustomDropdown'
import { register_user } from '../../CustomTools/Requests'
import { useMessageBox } from '../../components/Messages/MessageBox'

const genders = ["Male", "Female", "Attack helicopter"]


export default function Register() {
    const navigate = useNavigate()

    const [newUser, setNewUser] = useState({ gender: genders[0] })

    const [notMatchingStyle, setNotMatchingStyle] = useState({ "color": "red" })
    const [isPasswdHidden, setIsPasswdHidden] = useState(false)

    const { showMessage } = useMessageBox()


    const setNewFirstName = (newFirstName) => {
        setNewUser({
            ...newUser,
            first_name: newFirstName
        })
    }
    const setNewLastname = (newLastName) => {
        setNewUser({
            ...newUser,
            last_name: newLastName
        })
    }

    const setNewEmail = (newEmail) => {
        setNewUser({
            ...newUser,
            email: newEmail
        })
    }

    const setNewPhone = (newPhone) => {
        setNewUser({
            ...newUser,
            phone: newPhone
        })
    }

    const setNewPassword = (newPassword) => {
        setNewUser({
            ...newUser,
            password: newPassword
        })
    }

    const setNewGender = (newGender) => {
        setNewUser({
            ...newUser,
            gender: newGender.target.value
        })
    }

    const setNewAge = (age) => {
        setNewUser({
            ...newUser,
            age: parseInt(age)
        })
    }

    const isMatching = (e) => {
        if (e === newUser.password) {
            setNotMatchingStyle({ "color": "black" })
            return
        }
        setNotMatchingStyle({ "color": "red" })
    }

    const handleRegister = () => {
        register_user(newUser)
            .then((res) => {
                showMessage({ msg: "Account created", msgType: "success" })
                navigate("/login")
            })
            .catch((err) => {
                showMessage({ msg: "Invalid Credentials", msgType: "error" })
            })
    }

    return (
        <motion.div
            className={styles.container}
            variants={routeVariants}
            initial='initial'
            animate='final'
        >
            <CustomBox style={{ "backgroundColor": "red" }}>
                <CustomInputs
                    placeholder={"First Name"}
                    onChange={setNewFirstName}
                />
                <CustomInputs
                    placeholder={"Last Name"}
                    onChange={setNewLastname}
                />
                <CustomInputs
                    placeholder={"Email"}
                    type={"email"}
                    onChange={setNewEmail}
                />
                <CustomInputs
                    placeholder={"Phone"}
                    type={"tel"}
                    onChange={setNewPhone}
                />

                <div className={styles.ageAndGender}>
                    <CustomInputs
                        placeholder={"Age"}
                        type={"number"}
                        onChange={setNewAge}
                    />
                    <CustomDropdown
                        options={genders}
                        selectedValue={newUser.gender}
                        onSelect={setNewGender}
                    />
                </div>

                <CustomInputs
                    placeholder={"Password"}
                    type={isPasswdHidden ? "text" : "password"}
                    onChange={setNewPassword}
                    icon={isPasswdHidden ? faEyeSlash : faEye}
                    onIconClick={() => setIsPasswdHidden(!isPasswdHidden)}
                    iconSize={"lg"}
                    iconStyle={{ "width": "2rem" }}
                />
                <CustomInputs
                    placeholder={"Repeat Password"}
                    type={"password"}
                    onChange={isMatching}
                    style={notMatchingStyle}
                />
                <CustomButton
                    text={"Register"}
                    style={{ "marginTop": ".5rem" }}
                    onClick={() => handleRegister()}
                />

                <Link to={'/login'} className={styles.linkToLogin}>
                    Already have an account?
                </Link>
            </CustomBox>
        </motion.div >
    )
}
