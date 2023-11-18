import React, { useState, useEffect } from 'react'
import styles from './Register.module.css'
import CustomBox from '../../components/customComponents/CustomBox'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { routeVariants } from '../../Navigation/RouteVariants'
import { isEmpty } from '../../CustomTools/CustomTools'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'


export default function Register() {
    const navigate = useNavigate()

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [passwd, setPasswd] = useState()
    const [isDisabled, setIsDisabled] = useState(true)
    const [notMatchingStyle, setNotMatchingStyle] = useState({ "color": "red" })
    const [isPasswdHidden, setIsPasswdHidden] = useState(false)

    useEffect(() => {
        areValidCredentials()
    }, [username, email, passwd])

    const isMatching = (e) => {
        if (e === passwd) {
            setNotMatchingStyle({ "color": "black" })
            return
        }
        setNotMatchingStyle({ "color": "red" })
    }

    const areValidCredentials = () => {
        if (isEmpty(username) || isEmpty(email) || isEmpty(passwd)) {
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
            <CustomBox style={{ "backgroundColor": "red" }}>
                <CustomInputs
                    placeholder={"Username"}
                    onChange={setUsername}
                />
                <CustomInputs
                    placeholder={"Email"}
                    type={"email"}
                    onChange={setEmail}
                />
                <CustomInputs
                    placeholder={"Password"}
                    type={isPasswdHidden ? "text" : "password"}
                    onChange={setPasswd}
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
                    onClick={() => navigate('/login')}
                    isDisabled={isDisabled}
                />

                <Link to={'/login'} className={styles.linkToLog}>Already have an account?</Link>
            </CustomBox>
        </motion.div >
    )
}
