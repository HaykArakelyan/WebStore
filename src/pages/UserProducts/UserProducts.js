import React, { useEffect, useState } from 'react'
import styles from './UserProducts.module.css'
import { useLocation } from 'react-router-dom'
import CustomCard from '../../components/customComponents/CustomCard'

import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'

import tempImage from './temp-image.png'//TODO: Temp
import ProductForm from '../../components/Product/ProductForm'

import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import { delete_user_product, edit_product, get_products_by_userId } from '../../CustomTools/Requests'
import Product from '../../components/Product/Product'

export default function UserProducts() {
    const location = useLocation()
    const userId = sessionStorage.getItem("id")

    const [products, setProducts] = useState([])

    useEffect(() => {
        get_products_by_userId(userId)
            .then((res) =>
                setProducts(res.products)
            )
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const [isModalHidden, setIsModalHidden] = useState(true);
    const [activeProduct, setActiveProduct] = useState(null);

    const [modalElement, setModalElement] = useState(null)

    const handleCardClick = (e) => {
        setActiveProduct(e)
        setModalElement(
            //TODO: Get Product Images with API
            <Product
                product={{ ...e, images: [tempImage] }}
                onEditButtonClick={() => handleOpenEditProductForm(e)}
                onDeleteButtonClick={() => handleDeleteProduct(e)}
                currentUserProduct
            />
        )
        setIsModalHidden(false)
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
        if (!Object.values(product).some(element => isNullOrUndefined(element))) {
            return true
        } else {
            console.log("Invalid Data")
            return false
        }
    }

    const handleEditProductButtonClick = (e) => {
        if (isProductValid(e)) {
            edit_product(e.product_id, e)
                .then((res) => {
                    console.log(res)
                    updateProductsOnproductUpdate(e)
                    setModalElement(
                        <Product
                            product={{ ...e, images: [] }}
                            onEditButtonClick={handleOpenEditProductForm}
                            userProduct
                        />
                    )
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }

    const handleDeleteProduct = (deletedProduct) => {
        delete_user_product(deletedProduct.product_id)
            .then((res) => {
                console.log(res)
                setIsModalHidden(true)
                setProducts((prevProductsState) => {
                    return prevProductsState.filter((product => product != deletedProduct))
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const updateProductsOnproductUpdate = (updatedProduct) => {
        setProducts((prevProductsState) => {
            return prevProductsState.map((product) => {
                if (product.product_id === updatedProduct.product_id) {
                    return updatedProduct
                } else {
                    return product
                }
            })
        })
    }

    return (
        <div className={styles.container}>
            {products.map((product, i) =>
                <CustomCard
                    key={i}
                    //TODO: Get Image URLs from Database
                    p={{ ...product, images: [tempImage] }}
                    onClick={() => handleCardClick(product, i)}
                />

            )}

            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {!isModalHidden ?
                    <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() => modalElement}
                    />
                    :
                    null
                }
            </AnimatePresence>
        </div>
    )
}
