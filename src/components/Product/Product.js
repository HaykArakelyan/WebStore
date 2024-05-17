import React, { useEffect, useState } from 'react'
import styles from './Product.module.css'
import SlickSlider from '../Slider/SlickSlider'
import StarCounter from '../Icons/StarCounter'
import CustomButton from '../customComponents/CustomButton'
import { add_product_to_cart } from '../../CustomTools/Requests'
import { useNavigate } from 'react-router-dom'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { makeStringShorter } from '../../CustomTools/CustomTools'
import ProductForm from './ProductForm'
import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import { edit_product } from '../../CustomTools/Requests'

export default function Product({
    currentUserProduct = false,
    onDeleteButtonClick,
    product,
    setIsModalHidden,
    setIsNewProductAdded,
    setModalElement,
    updateProductList,
    userCartProduct = false,
}) {

    const navigate = useNavigate()
    const { showMessage } = useMessageBox()

    const [productImages, setProductImages] = useState([])

    useEffect(() => {
        setProductImages(product.images)
    }, [])

    const handleAddToCart = () => {
        add_product_to_cart(product)
            .then((res) => {
                showMessage({ msg: res.message, msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: err.message, msgType: "warning" })
            })
    }

    const handleViewFullProductButtonClick = () => {
        navigate(`/product/${product.product_id}`, { state: { product } })
    }

    const handleOpenEditProductForm = (activeProduct) => {
        setModalElement(
            <ProductForm
                p={activeProduct}
                onSubmit={handleEditProductButtonClick}
            />
        )
    }

    const isProductValid = (product) => {
        if (!Object.values(product).some(element => {
            return isNullOrUndefined(element)
        })) {
            return true
        } else {
            showMessage({ msg: "Invalid Data", msgType: "error" })
            return false
        }
    }

    const handleEditProductButtonClick = (e, productId, imageBlobsAndUrls) => {
        if (isProductValid(e)) {
            edit_product(productId, e)
                .then((res) => {
                    updateProductList(imageBlobsAndUrls)
                    setProductImages(imageBlobsAndUrls)
                    setIsNewProductAdded(prevValue => !prevValue)
                    setIsModalHidden(true)
                    showMessage({ msg: res.message, msgType: "success" })
                })
                .catch((err) => {
                    showMessage({ msg: err.message, msgType: "error" })
                })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.productImageSlider}>
                {product?.images?.length > 0
                    ? <SlickSlider images={productImages} />
                    : null
                }
            </div>

            <div className={styles.productInfo}>
                <label className={styles.productTitle}>
                    {product.title}
                </label>

                <label className={styles.productDescription}>
                    {makeStringShorter(product.description, 255)}
                </label>

                <div className={styles.productCostAndSale}>
                    <label className={styles.productPrice}>
                        Price: ${product.price}
                    </label>


                    <label className={styles.productDiscount}>
                        Save {product.discountPercentage}%
                    </label>
                </div>

                <label className={styles.productRating}>
                    <StarCounter rating={product.rating} title={`${product.rating}`} />
                </label>
                <div className={styles.reviews}>
                    <label className={styles.reviewTitle}>Reviews</label>
                    {product.reviews.length > 0
                        ? <div className={styles.reviewsList}>
                            {product.reviews.map((review, index) =>
                                <div className={styles.review} key={index}>
                                    {review.comment}
                                </div>
                            )}
                        </div>
                        : <div className={styles.review} style={{ marginTop: "1rem" }}>
                            No Reviews
                        </div>
                    }
                </div>


                {!currentUserProduct
                    ? <div className={styles.cartButtons}>
                        <CustomButton
                            text={"View Full Product"}
                            onClick={() => handleViewFullProductButtonClick()}
                        />

                        <CustomButton
                            text={"Add to Cart"}
                            onClick={() => handleAddToCart()}
                        />
                    </div>
                    : !userCartProduct
                        ? <div className={styles.controlButtons}>
                            <CustomButton
                                text={"Edit Product"}
                                onClick={() => handleOpenEditProductForm({ ...product, images: [...productImages] })}
                            />

                            <CustomButton
                                text={"Delete Product"}
                                onClick={onDeleteButtonClick}
                            />
                        </div>
                        : <div className={styles.controlButtons}>
                            <CustomButton
                                text={"View Full Product"}
                                onClick={() => handleViewFullProductButtonClick()}
                            />

                            <CustomButton
                                text={"Delete From Cart"}
                                onClick={() => onDeleteButtonClick()}
                            />
                        </div>

                }
            </div>
        </div>
    )
}
