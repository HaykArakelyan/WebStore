import React, { useState } from 'react'
import styles from './UserProducts.module.css'
import { useLocation } from 'react-router-dom'
import CustomCard from '../../components/customComponents/CustomCard'

import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'

import tempImage from './temp-image.png'
import ProductForm from '../../components/Product/ProductForm'

import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import { edit_product } from '../../CustomTools/Requests'

export default function UserProducts() {
    const location = useLocation()

    const products = location?.state?.products
    const [isModalHidden, setIsModalHidden] = useState(true);
    const [activeProduct, setActiveProduct] = useState(null);


    const handleCardClick = (e) => {
        setIsModalHidden(false)
        setActiveProduct(e)
    }

    const isProductValid = (product) => {
        if (!Object.values(product).some(element => isNullOrUndefined(element))) {
            return true
        } else {
            console.log("Invalid Data")
            return false
        }
    }

    const handleEditProductButtonClick = (e) => {
        if (isProductValid(e)) {
            // TODO: Get product ID with request
            edit_product(7, e)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }

    return (
        <div className={styles.container}>
            {products.map((product, i) =>
                <CustomCard
                    key={i}
                    //TODO: Get Image URLs from Database
                    p={{ ...product, images: [tempImage] }}
                    onClick={() => handleCardClick(product)}
                />

            )}

            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {!isModalHidden ?
                    <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() =>
                            <ProductForm
                                p={activeProduct}
                                updateProduct={setActiveProduct}
                                onSubmit={handleEditProductButtonClick}
                            />
                        }
                    /> : null
                }
            </AnimatePresence>
        </div>
    )
}
