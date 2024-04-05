import React from 'react'
import styles from './ProductPage.module.css'
import { useParams, useLocation } from 'react-router-dom'
import SlickSlider from '../../components/Slider/SlickSlider'
import { isAuth, makeFirstUpper } from '../../CustomTools/CustomTools'
import CustomButton from '../../components/customComponents/CustomButton'
import { add_product_to_cart } from '../../CustomTools/Requests'
import { useMessageBox } from '../../components/Messages/MessageBox'

export default function ProductPage() {

    const location = useLocation()
    const product = location?.state?.product
    const { id } = useParams()
    const { showMessage } = useMessageBox()

    const handleAddToCart = () => {
        if (isAuth()) {
            add_product_to_cart(product)
                .then(() => showMessage({ msg: "Product Added Successfully", msgType: "success" }))
                .catch(() => showMessage({ msg: "Unable to Add to Cart" }))
        } else {

        }
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
                                {makeFirstUpper(product.category)}
                            </div>
                        </div>

                        <div className={styles.labelBox}>
                            <label className={styles.componentLabel}>Brand</label>
                            <div className={styles.productBrand}>
                                {makeFirstUpper(product.brand)}
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
                            text={"Give a Feedback"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
