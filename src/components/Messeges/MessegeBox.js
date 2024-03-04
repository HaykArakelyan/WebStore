import React, { useEffect, useState } from 'react'
import styles from './MessegeBox.module.css'
import { motion } from 'framer-motion';
import { messegeBoxVariants } from '../../Navigation/RouteVariants';
import { isNullOrUndefined, makeFirstUpper } from '../../CustomTools/CustomTools';

export default function MessegeBox({
    msg = {
        msg: "",
        msgType: ""
    },
    timeOut = "",
    onExit = () => { }
}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onExit()
        }, timeOut)

        return () => clearTimeout(timer)
    }, [])

    return (
        !isNullOrUndefined(msg) &&
        <motion.div
            className={`${styles.container} ${styles[msg?.msgType]}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={messegeBoxVariants}
            transition={{ duration: .8 }}
        >
            <strong className={styles.messegeTitle}>
                {makeFirstUpper(msg.msgType)}
            </strong>
            <span className={styles.messege}>
                {msg?.msg}
            </span>
        </motion.div>
    )
}
