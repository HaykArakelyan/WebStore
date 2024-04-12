import React from 'react'
import styles from './Product.module.css'
import SlickSlider from '../Slider/SlickSlider'
import StarCounter from '../Icons/StarCounter'
import CustomButton from '../customComponents/CustomButton'
import { add_product_to_cart } from '../../CustomTools/Requests'
import { useNavigate } from 'react-router-dom'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { makeStringShorter } from '../../CustomTools/CustomTools'
export default function Product({
    product,
    currentUserProduct = false,
    onEditButtonClick,
    onDeleteButtonClick,
}) {

    const navigate = useNavigate()
    const { showMessage } = useMessageBox()

    const handleAddToCart = () => {
        add_product_to_cart(product)
            .then((res) => {
                showMessage({ msg: "Added to Cart ", msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: "Somethig Went Wrong", msgType: "warning" })
            })
    }

    const handleViewFullProductButtonClick = () => {
        navigate(`/product/${product.product_id}`, { state: { product } })
    }

    return (
        <div className={styles.container}>
            <div className={styles.productImageSlider}>
                {product?.images?.length > 0 ? <SlickSlider images={product.images} /> : null}
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
                    {product.reviews.length > 0 ?
                        <div>
                            {/* TODO */}
                            {product.reviews[0]}
                        </div>
                        :
                        <div>
                            No Reviews
                        </div>
                    }
                </div>


                {!currentUserProduct ?
                    <div className={styles.cartButtons}>
                        <CustomButton
                            text={"View Full Product"}
                            onClick={() => handleViewFullProductButtonClick()}
                        />

                        <CustomButton
                            text={"Add to Cart"}
                            onClick={() => handleAddToCart()}
                        />
                    </div>
                    :
                    <div className={styles.controlButtons}>
                        <CustomButton
                            text={"Edit Product"}
                            onClick={onEditButtonClick}
                        />

                        <CustomButton
                            text={"Delete Product"}
                            onClick={onDeleteButtonClick}
                        />
                    </div>
                }
            </div>
        </div>
    )
}
