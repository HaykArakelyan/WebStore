import React from 'react'
import styles from './Product.module.css'
import SlickSlider from '../Slider/SlickSlider'
import StarCounter from '../Icons/StarCounter'
import CustomButton from '../customComponents/CustomButton'
import { add_product_to_cart } from '../../CustomTools/Requests'
import { useNavigate } from 'react-router-dom'

export default function Product({
    product,
    currentUserProduct = false,
    onEditButtonClick,
    onDeleteButtonClick,
}) {

    const navigate = useNavigate()

    const handleAddToCart = () => {
        add_product_to_cart(product)
            .then((res) => console.log(res))
            .catch((err) => console.log(123))
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
                    {/* TODO: Remove replace function */}
                    {product.description.replace('...', "")}
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