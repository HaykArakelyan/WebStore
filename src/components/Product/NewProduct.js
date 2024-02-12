import React, { useState } from 'react'
import styles from './NewProduct.module.css'
import CustomInputs from '../customComponents/CustomInputs'
import CustomButton from '../customComponents/CustomButton'
import { isNullOrUndefined } from '../../CustomTools/CustomTools'

export default function NewProduct({ closeModal }) {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        discountPercentage: "",
        stock: "",
        category: "",
        // images: []
    })

    const isProductvalid = () => {


        if (!Object.values(product).some(element => isNullOrUndefined(element))) {
            return true
        } else {
            console.log("Invalid Data")
            return false
        }
    }

    const handlePostProductbuttonClick = () => {
        if (isProductvalid()) {
            closeModal(product)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.productInfo}>
                <div className={styles.titleAndDesc}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Title</label>
                        <CustomInputs
                            placeholder={"Ex: New Phone"}
                            onChange={(e) => {
                                product.title = e
                            }}
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Description</label>

                        <CustomInputs
                            placeholder={"Ex: Very good phone"}
                            onChange={(e) => {
                                product.description = e
                            }}
                        />
                    </div>
                </div>

                <div className={styles.priceAndSale}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Price ($)</label>

                        <CustomInputs
                            placeholder={"Ex: 500"}
                            onChange={(e) => {
                                product.price = parseFloat(e)
                            }}
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Discount (%)</label>

                        <CustomInputs
                            placeholder={"Ex: 50"}
                            onChange={(e) => {
                                const num = parseFloat(e)
                                if (num >= 0 && num <= 100) {
                                    product.discountPercentage = num
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={styles.productStats}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>In Stock</label>

                        <CustomInputs
                            placeholder={"Ex: 10"}
                            onChange={(e) => {
                                const num = parseInt(e)
                                if (num > 0) {
                                    product.stock = num
                                }
                            }}
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Category</label>


                        {/* TODO: Maybe changed to dropdown menu */}
                        <CustomInputs
                            placeholder={"Ex: electronics"}
                            onChange={(e) => {
                                product.category = e
                            }}
                        />
                    </div>
                </div>
            </div>


            <div className={styles.postProduct}>
                <CustomButton
                    text={"Post Product"}
                    onClick={handlePostProductbuttonClick}
                />
            </div>


        </div>
    )
}
