import React, { useEffect, useState } from 'react'
import styles from './ProductPage.module.css'
import { useParams } from 'react-router-dom'
import SlickSlider from '../../components/Slider/SlickSlider'
import { makeFirstUpper, getDefaultAvatar } from '../../CustomTools/CustomTools'
import CustomButton from '../../components/customComponents/CustomButton'
import { add_product_to_cart, add_rating, add_review, get_product_by_id, send_report } from '../../CustomTools/Requests'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'
import Review from '../Review/Review'
import Report from '../Report/Report'
import StarCounter from '../../components/Icons/StarCounter'
import CustomImage from '../../components/customComponents/CustomImage'
import { useAuth } from '../../auth/Auth'

export default function ProductPage() {

    const [product, setProduct] = useState({})
    const [productOwner, setProductOwner] = useState({})
    const { id } = useParams()
    const { showMessage } = useMessageBox()
    const { isAuth } = useAuth()

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [modalElement, setModalElement] = useState(null)

    useEffect(() => {
        get_product_by_id(id)
            .then((product) => {
                setProduct(product.products_info)
                setProductOwner(product.owner_info)
            })
            .catch((err) => {
                showMessage({ msg: err.message, msgType: "error" })
            })
    }, [])

    const handleAddToCart = () => {
        if (isAuth()) {
            add_product_to_cart(product)
                .then((res) => showMessage({ msg: res.message, msgType: "success" }))
                // TODO: Error Handlings
                .catch((err) => showMessage({ msg: err.response.data.message, msgType: "error" }))
        }
    }

    // TODO: Fix the Promise chain
    const handleSendReview = (message) => {
        add_review((product.product_id), { reviews: message.reviews })
            .then((res) => {
                return add_rating(id, { rating: parseInt(message.rating) })
            })
            .catch((err) => {
                showMessage({ msg: err.message, msgType: "error" })
            })
            .then((res) => {
                showMessage({ msg: res.message, msgType: "success" })
                setIsModalHidden(true)
            })
            .catch((err) => {
                showMessage({ msg: err.message, msgType: "error" })
            })
    }

    const handleAddReviewButtonClick = () => {
        setModalElement(
            <Review
                onSubmit={handleSendReview}
                reviews={product.reviews}
            />
        )
        setIsModalHidden(false)
    }

    const handleReportButton = () => {
        setModalElement(
            <Report
                productId={id}
                onSubmit={handleSendReportButtonClick}
            />
        )
        setIsModalHidden(false)
    }

    const handleSendReportButtonClick = (report) => {
        send_report(report)
            .then(res => {
                showMessage({ msg: res.message, msgType: "success" })
                setIsModalHidden(true)
            })
            .catch(err => showMessage({ msg: err.message, msgType: "error" }))
    }

    const handleCopyEmailToClipboard = () => {
        navigator.clipboard.writeText(productOwner.email)
            .then(() => {
                showMessage({ msg: "Email Copied to Clipboard", msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: "Unable to Copy to Clipboard", msgType: "error" })
            })
    }

    const handleCopyPhoneToClipboard = () => {
        navigator.clipboard.writeText(productOwner.phone)
            .then(() => {
                showMessage({ msg: "Phone Copied to Clipboard", msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: "Unable to Copy to Clipboard", msgType: "error" })
            })
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
                        <div className={styles.productRating}>
                            <StarCounter rating={product?.rating} />
                            <span>{product.rating_count} review(s)</span>
                        </div>

                        <div className={styles.productDescription}>
                            {product.description}
                        </div>
                    </div>

                    <div className={styles.box}>
                        <label className={styles.componentLabel}>Price:</label>
                        <div className={styles.productPrice}>
                            ${product.price}
                        </div>
                    </div>

                    {!product.discountPercentage !== 0 &&
                        <div className={styles.box}>
                            <label className={styles.componentLabel}>Sale:</label>
                            <div className={styles.productDiscount}>
                                {product.discountPercentage + 10}%
                            </div>
                        </div>
                    }

                    <div className={styles.box}>
                        <label className={styles.componentLabel}>In Stock:</label>
                        <div className={styles.productStock}>
                            {product.stock}
                        </div>
                    </div>

                    <div className={styles.box}>
                        <label className={styles.componentLabel}>Category:</label>
                        <div className={styles.productCategory}>
                            {product.category && makeFirstUpper(product.category)}
                        </div>
                    </div>

                    <div className={styles.box}>
                        <label className={styles.componentLabel}>Brand:</label>
                        <div className={styles.productBrand}>
                            {product.brand && makeFirstUpper(product.brand)}
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <CustomButton
                            text={"Add to Cart"}
                            onClick={() => handleAddToCart()}
                        />

                        <CustomButton
                            text={"Report"}
                            onClick={() => handleReportButton()}
                        />

                        <CustomButton
                            text={"Add Review"}
                            onClick={() => handleAddReviewButtonClick()}
                        />
                    </div>
                </div>

                <div className={styles.ownerInfo}>
                    <div className={styles.ownerImage}>
                        <CustomImage
                            url={getDefaultAvatar(productOwner)}
                            style={{ borderRadius: "50%", border: "1px solid #5042A8" }}
                            name={productOwner.first_name + " " + productOwner.last_name}
                        />
                    </div>

                    <div className={styles.ownerData}>
                        <div className={styles.box}>
                            <label className={styles.boxData}>Name: </label>
                            <div>
                                {productOwner.first_name} {productOwner.last_name}
                            </div>
                        </div>

                        <div className={styles.box}>
                            <label className={styles.boxData}>Email: </label>
                            <div>
                                {productOwner.email}
                            </div>
                        </div>

                        <div className={styles.box}>
                            <label className={styles.boxData}>Phone: </label>
                            <div>
                                {productOwner.phone}
                            </div>
                        </div>

                        <div className={styles.copyEmailButton}>
                            <CustomButton
                                text={"Copy Email"}
                                onClick={handleCopyEmailToClipboard}
                            />

                            <CustomButton
                                text={"Copy Phone"}
                                onClick={handleCopyPhoneToClipboard}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {!isModalHidden
                    ? <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() => modalElement}
                    />
                    : null
                }
            </AnimatePresence>
        </div>
    )
}
