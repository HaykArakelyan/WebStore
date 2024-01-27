import React from 'react'
import { motion } from 'framer-motion';
import styles from './CustomModal.module.css'
import Product from '../Product/Product';

export default function CustomModal({ onCloseModal, activeProduct }) {
    const handleModalClick = (e) => {
        e.stopPropagation()
        onCloseModal(false)
    }
    return (
        <motion.div
            key={"modal"}
            className={styles.modal}
            onClick={() => onCloseModal(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div
                className={styles.modalContainer}
                onClick={(e) => handleModalClick(e)}
            >
                <Product product={activeProduct} />
            </div>
        </motion.div >
    )
}
