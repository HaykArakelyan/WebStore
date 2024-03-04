import React, { useEffect, useState } from 'react'
import styles from './UserProducts.module.css'
import { useLocation } from 'react-router-dom'
import CustomCard from '../../components/customComponents/CustomCard'

import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'

import tempImage from './temp-image.png'//TODO: Temp
import ProductForm from '../../components/Product/ProductForm'
import PaginationControl from '../../components/PaginationControl/PaginationControl'

import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import { delete_user_product, edit_product, get_products_by_userId, add_product } from '../../CustomTools/Requests'
import Product from '../../components/Product/Product'
import CustomInputs from '../../components/customComponents/CustomInputs'
import { faX } from '@fortawesome/free-solid-svg-icons';
import { filteredProducts } from '../../CustomTools/CustomTools'
import Loader from '../../components/Loader/Loader'
import CustomButton from '../../components/customComponents/CustomButton'
import { useMessageBox } from '../../components/Messages/MessageBox'


const userId = sessionStorage.getItem("id")

export default function UserProducts() {

    const [products, setProducts] = useState([])
    const [filteredProductList, setFilteredProductList] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12

    const [errorMessege, setErrorMessege] = useState("")
    const [isFetching, setIsFethcing] = useState(true)
    const [isNewProductAdded, setIsNewProductAdded] = useState(false)

    const { showMessage } = useMessageBox()

    useEffect(() => {
        if (isFetching) {
            setErrorMessege(<Loader />)
        }
    }, [isFetching])


    useEffect(() => {
        get_products_by_userId(userId)
            .then((res) => {
                setProducts(res.products)
                setFilteredProductList(res.products)
            })
            .catch((err) => {
                if (err.code === "ERR_NETWORK") {
                    setErrorMessege("No Internet Connection")
                } else {
                    setErrorMessege("Something Went Wrong")
                }
            })
            .finally(() => {
                setIsFethcing(false)
                setIsNewProductAdded(false)
            })
    }, [isNewProductAdded])


    useEffect(() => {
        const result = filteredProducts(products, searchQuery)
        if (result.length === 0 && products.length !== 0) {
            setErrorMessege(`No Product Found With "${searchQuery}"`)
        }
        setFilteredProductList(result)
        setCurrentPage(0)
    }, [products, searchQuery])


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
                    updateProductsOnproductUpdate(e)
                    setModalElement(
                        <Product
                            product={{ ...e, images: [] }}
                            onEditButtonClick={handleOpenEditProductForm}
                            userProduct
                        />
                    )
                    showMessage({ msg: "Product Updated", msgType: "success" })
                })
                .catch((err) => {
                    showMessage({ msg: "Error Occured While Updating a Product", msgType: "error" })
                })
        }

    }

    const handleDeleteProduct = (deletedProduct) => {
        delete_user_product(deletedProduct.product_id)
            .then((res) => {
                setIsModalHidden(true)
                setProducts((prevProductsState) => {
                    return prevProductsState.filter((product => product != deletedProduct))
                })
                showMessage({ msg: "Product Deleted", msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: "Error Occured While Deleting a Product", msgType: "error" })
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

    const handleAddproductButtonClick = () => {
        setModalElement(
            <ProductForm
                onSubmit={handlePostProductButtonClick}
                newProduct
            />)
        setIsModalHidden(false)
    }

    const handlePostProductButtonClick = (e) => {
        add_product(e)
            .then((res) => {
                setIsModalHidden(true)
                setIsNewProductAdded(true)
                showMessage({ msg: "Product Added", msgType: "success" })
            }).catch((err) => {
                showMessage({ msg: "Error Occured While Adding a Product", msgType: "error" })
            })
    }

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredProductList.slice(startIndex, endIndex);

    return (
        <div className={styles.container}>
            <div className={styles.controls}>

                <div className={styles.addProduct}>
                    <CustomButton
                        text={"Add Product"}
                        onClick={handleAddproductButtonClick}
                    />
                </div>

                <div className={styles.searchBox}>
                    <CustomInputs
                        placeholder={"Search"}
                        onChange={setSearchQuery}
                        value={searchQuery}
                        icon={faX}
                        onIconClick={() => setSearchQuery("")}
                        parentStyle={{ gap: "1rem" }}
                        iconStyle={{ padding: " 0.5rem .7rem 0.5rem" }}

                    />
                </div>
            </div>
            <div className={styles.userProducts}>
                {currentData.map((product, i) =>
                    <CustomCard
                        key={i}
                        //TODO: Get Image URLs from Database
                        p={{ ...product, images: [tempImage] }}
                        onClick={() => handleCardClick(product, i)}
                    />

                )}
            </div>

            {filteredProductList.length !== 0 ?
                Math.ceil(filteredProductList.length / ITEMS_PER_PAGE) !== 1 &&
                <PaginationControl
                    productsLength={products.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    filteredProductList={filteredProductList}
                />
                :
                <div className={styles.productsError}>
                    <label>{errorMessege}</label>
                </div>
            }
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
