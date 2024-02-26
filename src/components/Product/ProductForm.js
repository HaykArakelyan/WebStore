import React, { useEffect, useState } from 'react'
import styles from './ProductForm.module.css'

import CustomInputs from '../customComponents/CustomInputs'
import CustomButton from '../customComponents/CustomButton'


export default function ProductForm({ p = null, updateProduct = null, onSubmit, newProduct = false }) {

    const [product, setProduct] = useState(
        p ? p
            : {
                title: "",
                description: "",
                price: "",
                discountPercentage: "",
                stock: "",
                category: "",
                brand: ""
                // images: []
            }
    )

    const handleProductEdit = (value) => {
        setProduct(value)
    }

    useEffect(() => {
        if (p) {
            setProduct(p)
        }
    }, [p])

    const handleSubmitButtockClick = () => {
        if (product.price < 0 ||
            product.stock < 0 ||
            product.discountPercentage > 100 ||
            product.discountPercentage < 0
        ) {
            console.log("Invalid Data!")
            return
        }
        else {
            onSubmit({
                ...product,
                price: parseFloat(product.price),
                discountPercentage: parseFloat(product.discountPercentage),
                stock: parseFloat(product.stock)
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.productInfo}>
                <div className={styles.titleAndDesc}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Title</label>
                        <CustomInputs
                            value={product.title}
                            placeholder={"Ex: New Phone"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, title: e })
                            }}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Brand</label>
                        {/* TODO: Maybe changed to dropdown menu */}
                        <CustomInputs
                            value={product.brand}
                            placeholder={"Ex: electronics"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, brand: e })
                            }}
                        />
                    </div>
                </div>

                <div className={styles.priceAndSale}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Price ($)</label>

                        <CustomInputs
                            value={product.price}
                            placeholder={"Ex: 500"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, price: e })
                            }}
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Discount (%)</label>

                        <CustomInputs
                            value={product.discountPercentage}
                            placeholder={"Ex: 50"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, discountPercentage: e })
                            }}
                        />
                    </div>
                </div>
                <div className={styles.productStats}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>In Stock</label>

                        <CustomInputs
                            value={product.stock}
                            placeholder={"Ex: 10"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, stock: e })
                            }}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Category</label>

                        {/* TODO: Maybe changed to dropdown menu */}
                        <CustomInputs
                            value={product.category}
                            placeholder={"Ex: electronics"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, category: e })
                            }}
                        />
                    </div>
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Description</label>

                    <CustomInputs
                        value={product.description}
                        placeholder={"Ex: Very good phone"}
                        onChange={(e) => {
                            handleProductEdit({ ...product, description: e })
                        }}
                    />
                </div>
            </div>


            <div className={styles.postProduct}>
                <CustomButton
                    text={newProduct ? "Post Product" : "Update Product"}
                    onClick={handleSubmitButtockClick}
                />
            </div>


        </div>
    )
}
