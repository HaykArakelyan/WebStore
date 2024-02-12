import React from 'react'
import { motion } from 'framer-motion';
import styles from './CustomModal.module.css'
import Product from '../Product/Product';

export default function CustomModal({ onCloseModal, product = null, element = null }) {
    const handleModalClick = (e) => {
        e.stopPropagation()
        // onCloseModal(false)
    }

    if (product || element) {
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                onCloseModal(true)
            }
        })
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
                {product ?
                    <Product product={product} />
                    : element()
                }
            </div>
        </motion.div >
    )
}
