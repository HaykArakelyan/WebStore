import React, { useState } from 'react'
import styles from './ContactUs.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs';
import CustomButton from '../../components/customComponents/CustomButton';
import { isValidEmail, isValidField, isValidPhone } from '../../CustomTools/Validators'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { contact_us } from '../../CustomTools/Requests';
import { useNavigate } from 'react-router-dom';
import emailSentImage from '../../assets/default/email-sent.png'
import CustomTextArea from '../../components/customComponents/CustomTextArea';

export default function ContactUs() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isSent, setIsSent] = useState(false)

    const { showMessage } = useMessageBox()
    const navigate = useNavigate()

    const handleSendMessage = () => {
        if (isValidEmail(email)) {
            if (isValidField(name) && isValidPhone(phone) && isValidField(subject) && isValidField(message)) {
                contact_us({ name, phone, email, subject, message })
                    .then((res) => {
                        showMessage({ msg: res.message, msgType: "success" })
                        setIsSent(true)
                    })
                    .catch((err) => showMessage({ msg: err.message, msgType: "error" }))
            } else {
                showMessage({ msg: "Please Fill All Fields Correctly", msgType: "error" })
            }
        } else {
            showMessage({ msg: "Please Enter a Valid Email", msgType: "error" })
        }
    }

    return (
        !isSent
            ? <div className={styles.container}>
                <div className={styles.title}>
                    Contact Us
                </div>

                <div className={styles.messageBox}>
                    <div className={styles.messageBoxRow}>
                        <CustomInputs
                            value={name}
                            placeholder={"Name"}
                            onChange={setName}
                        />
                    </div>

                    <div className={styles.messageBoxRow}>
                        <CustomInputs
                            value={phone}
                            placeholder={"Phone"}
                            onChange={setPhone}
                            type={"number"}
                        />
                    </div>

                    <div className={styles.messageBoxRow}>
                        <CustomInputs
                            value={email}
                            placeholder={"Email"}
                            onChange={setEmail}
                            type={"email"}
                        />
                    </div>

                    <div className={styles.messageBoxRow}>
                        <CustomInputs
                            value={subject}
                            placeholder={"Subject"}
                            onChange={setSubject}
                        />
                    </div>

                    <div className={styles.messageBoxRow}>
                        <CustomTextArea
                            value={message}
                            placeholder={"Your Message"}
                            onChange={setMessage}
                        />
                    </div>

                    <CustomButton
                        text={"Send"}
                        onClick={handleSendMessage}
                    />
                </div>
            </div>
            : <div className={styles.container}>
                <img src={emailSentImage} />
                <div className={styles.thanksMessage}>
                    Email Sent Successfully
                </div>

                <CustomButton
                    text={"Back to Home Page"}
                    onClick={() => navigate("/", { replace: true })}
                />
            </div>
    )
}
