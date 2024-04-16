import React, { useState } from 'react'
import styles from './ContactUs.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs';
import CustomButton from '../../components/customComponents/CustomButton';

export default function ContactUs() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")

    const handleSendMessage = () => {

    }

    return (
        <div className={styles.container}>
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
    )
}
