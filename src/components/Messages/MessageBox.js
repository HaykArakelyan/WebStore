import React, { createContext, useContext, useEffect, useState } from 'react'
import styles from './MessageBox.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import { messageBoxVariants } from '../../Navigation/RouteVariants';
import { isNullOrUndefined, makeFirstUpper } from '../../CustomTools/CustomTools';

const MessageBoxContext = createContext()
export const useMessageBox = () => useContext(MessageBoxContext)


export const MessageBoxProvider = ({ children }) => {
    const [message, setMessage] = useState({ msg: "", msgType: "" });

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage({
                msg: "",
                msgType: ""
            });
        }, 3000);
    };

    return (
        <MessageBoxContext.Provider value={{ showMessage }}>
            {children}
            <AnimatePresence>
                {!isNullOrUndefined(message.msg) && (
                    <MessageBox
                        msg={message}
                        onExit={() => setMessage({ msg: "", msgType: "" })}
                    />
                )}
            </AnimatePresence>
        </MessageBoxContext.Provider>
    )
}

export default function MessageBox({
    msg,
    onExit = () => { },
}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onExit();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        !isNullOrUndefined(msg) &&
        <motion.div
            className={`${styles.container} ${styles[msg?.msgType]}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={messageBoxVariants}
            transition={{ duration: .8 }}
        >
            <strong className={styles.messageTitle}>
                {makeFirstUpper(msg.msgType)}
            </strong>
            <span className={styles.message}>
                {msg?.msg}
            </span>
        </motion.div>
    )
}
