import React, { useEffect, useState } from 'react'
import styles from './ProductPage.module.css'
import { useParams, useLocation } from 'react-router-dom'
import SlickSlider from '../../components/Slider/SlickSlider'
import { isAuth, makeFirstUpper } from '../../CustomTools/CustomTools'
import CustomButton from '../../components/customComponents/CustomButton'
import { add_product_to_cart, add_rating, add_review, get_product_by_id } from '../../CustomTools/Requests'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'
import Review from '../Review/Review'

export default function ProductPage() {

    const location = useLocation()
    const [product, setProduct] = useState({})
    const { id } = useParams()
    const { showMessage } = useMessageBox()

    useEffect(() => {
        get_product_by_id(id)
            .then((product) => {
                setProduct(product.products_info)
            })
            .catch((err) => {
                showMessage({ msg: "Unable to Get The Requested Product", msgType: "error" })
            })
    }, [])

    const handleAddToCart = () => {
        if (isAuth()) {
            add_product_to_cart(product)
                .then(() => showMessage({ msg: "Product Added Successfully", msgType: "success" }))
                .catch(() => showMessage({ msg: "Unable to Add to Cart" }))
        } else {

        }
    }

    const handleSendReview = (message) => {
        add_review((product.product_id), { reviews: message.reviews })
            .then((res) => {
                add_rating(id, { rating: parseInt(message.rating) })
                    .then((res) => {
                        showMessage({ msg: "Review Added Successfully", msgType: "success" })
                        setIsModalHidden(true)
                    })
                    .catch((err) => {
                        showMessage({ msg: "Unable to Add Review", msgType: "error" })
                    })
            })
            .catch((err) => {
                console.log(err)
                showMessage({ msg: "Unable to Add Review", msgType: "error" })
            })
    }

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [modalElement, setModalElement] = useState(null)

    const handleAddReviewButtonClick = () => {
        setModalElement(
            <Review
                onSubmit={handleSendReview}
                reviews={product.reviews}
            />
        )
        setIsModalHidden(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.productImages}>
                    <SlickSlider
                        images={product.images}
                    />
                </div>
                <div className={styles.productInfo}>
                    <div className={styles.productTitle}>
                        {product.title}
                    </div>

                    <div className={styles.labelBox}>
                        <label className={styles.componentLabel}>About This Item</label>
                        <div className={styles.productDescription}>
                            {product.description}
                        </div>
                    </div>

                    <div className={styles.productPriceDiscountStock}>
                        <div className={styles.labelBox}>
                            <label className={styles.componentLabel}>Price</label>
                            <div className={styles.productPrice}>
                                ${product.price}
                            </div>
                        </div>

                        {!product.discountPercentage !== 0 &&
                            <div className={styles.labelBox}>
                                <label className={styles.componentLabel}>Save</label>
                                <div className={styles.productDiscount}>
                                    {product.discountPercentage + 10}%
                                </div>
                            </div>
                        }

                        <div className={styles.labelBox}>
                            <label className={styles.componentLabel}>In Stock</label>
                            <div className={styles.productStock}>
                                {product.stock}
                            </div>
                        </div>
                    </div>

                    <div className={styles.productBrandAndCategory}>

                        <div className={styles.labelBox}>
                            <label className={styles.componentLabel}>Category</label>
                            <div className={styles.productCategory}>
                                {product.category && makeFirstUpper(product.category)}
                            </div>
                        </div>

                        <div className={styles.labelBox}>
                            <label className={styles.componentLabel}>Brand</label>
                            <div className={styles.productBrand}>
                                {product.brand && makeFirstUpper(product.brand)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <CustomButton
                            text={"Add to Cart"}
                            onClick={() => handleAddToCart()}
                        />

                        <CustomButton
                            text={"Report"}
                        />

                        <CustomButton
                            text={"Add Review"}
                            onClick={() => handleAddReviewButtonClick()}
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {!isModalHidden ?
                    <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() =>
                            modalElement
                        }
                    /> :
                    null
                }
            </AnimatePresence>
        </div>
    )
}
