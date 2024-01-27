import React from 'react'
import styles from './Product.module.css'
import SlickSlider from '../Slider/SlickSlider'
import StarCounter from '../Icons/StarCounter'
import CustomButton from '../customComponents/CustomButton'

export default function Product({ product }) {
    return (
        <div className={styles.container}>
            <div className={styles.productImageSlider}>
                <SlickSlider images={product.images} />
            </div>

            <div className={styles.productInfo}>
                <label className={styles.productTitle}>
                    {product.title}
                </label>

                <label className={styles.productDescription}>
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


                <div className={styles.cartButtons}>
                    <CustomButton
                        text={"View Full Product"}
                        onClick={() => console.log("Navigate to Full Produtc Page")}
                    />

                    <CustomButton
                        text={"Add to Cart"}
                        onClick={() => console.log("Added to Cart")}
                    />
                </div>
            </div>
        </div>
    )
}
