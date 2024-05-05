import React, { useState } from 'react'
import styles from './RecoverPassword.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { recover_password } from '../../CustomTools/Requests'
import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import { isValidEmail } from '../../CustomTools/Validators'
import emailSentImage from '../../assets/default/email-sent.png'
import { useNavigate } from 'react-router-dom'

export default function RecoverPassword() {

    const [email, setEmail] = useState()
    const [isEmailSent, setIsEmailSent] = useState(false)

    const { showMessage } = useMessageBox()
    const navigate = useNavigate()

    const resetPasswordButtonClick = () => {
        if (!isNullOrUndefined(email) && isValidEmail(email)) {
            recover_password({ email })
                .then((res) => {
                    setIsEmailSent(true)
                    showMessage({ msg: 'Email Sent', msgType: 'success' })
                })
                .catch((err) => showMessage({ msg: "Unable to send an email", msgType: "error" }))
        } else {
            showMessage({ msg: "Invalid email", msgType: "error" })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>

                {!isEmailSent
                    ? <>
                        <div className={styles.message}>
                            Enter your account's verified email address and we will send you a password reset link.
                        </div>

                        <CustomInputs
                            type={'email'}
                            placeholder={"example@gmail.com"}
                            onChange={setEmail}
                        />

                        <CustomButton
                            text={"Send"}
                            onClick={resetPasswordButtonClick}
                        />
                    </>
                    : <>
                        <div className={styles.emailSentContainer}>
                            <img src={emailSentImage} />
                            <div className={styles.thanksMessage}>
                                Email Sent Successfully
                            </div>

                            <CustomButton
                                text={"Back to Sign In Page"}
                                onClick={() => navigate("/login", { replace: true })}
                            />
                        </div>
                    </>

                }
            </div>
        </div>
    )
}
