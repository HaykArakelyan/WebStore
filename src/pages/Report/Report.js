import React, { useState } from 'react'
import styles from './Report.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomTextArea from '../../components/customComponents/CustomTextArea'
import CustomButton from '../../components/customComponents/CustomButton'
import { makeFirstUpper } from '../../CustomTools/CustomTools'

export default function Report({
    onSubmit,
    productId,
}) {

    const [subject, setSubject] = useState("")
    const [report, setReport] = useState("")

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <span>SEND REPORT</span>
            </div>

            <div className={styles.inputs}>
                <CustomInputs
                    value={subject}
                    placeholder={"Subject"}
                    onChange={setSubject}
                    parentStyle={{ alignSelf: "center" }}
                />

                <CustomTextArea
                    value={report}
                    placeholder={"What happened?"}
                    onChange={setReport}
                    style={{ minHeight: "20rem" }}
                />
            </div>

            <div className={styles.button}>
                <CustomButton
                    onClick={() => onSubmit({ subject: "Product ID: " + productId + " -- " + "Subject: " + makeFirstUpper(subject), report })}
                    text={"Send Report"}
                />
            </div>
        </div>
    )
}
