import React, { useEffect, useState } from 'react'
import styles from './UserProducts.module.css'
import CustomCard from '../../components/customComponents/CustomCard'
import { AnimatePresence } from 'framer-motion'
import CustomModal from '../../components/customComponents/CustomModal'
import ProductForm from '../../components/Product/ProductForm'
import PaginationControl from '../../components/PaginationControl/PaginationControl'
import { delete_product, get_products, add_product } from '../../CustomTools/Requests'
import Product from '../../components/Product/Product'
import CustomInputs from '../../components/customComponents/CustomInputs'
import { faX } from '@fortawesome/free-solid-svg-icons';
import { filteredProducts } from '../../CustomTools/CustomTools'
import Loader from '../../components/Loader/Loader'
import CustomButton from '../../components/customComponents/CustomButton'
import { useMessageBox } from '../../components/Messages/MessageBox'


export default function UserProducts() {

    const [products, setProducts] = useState([])
    const [filteredProductList, setFilteredProductList] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12

    const [errorMessege, setErrorMessege] = useState("")
    const [isFetching, setIsFethcing] = useState(true)
    const [isNewProductAdded, setIsNewProductAdded] = useState(false)

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [modalElement, setModalElement] = useState(null)

    const { showMessage } = useMessageBox()

    useEffect(() => {
        if (isFetching) {
            setErrorMessege(<Loader />)
        }
    }, [isFetching])


    useEffect(() => {
        get_products()
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


    const handleCardClick = (e) => {
        setModalElement(
            <Product
                product={e}
                onDeleteButtonClick={() => handleDeleteProduct(e)}
                currentUserProduct
                setIsModalHidden={setIsModalHidden}
                setModalElement={setModalElement}
                updateProductList={updateProductsOnproductUpdate}
                setIsNewProductAdded={setIsNewProductAdded}
                isNewProductAdded={isNewProductAdded}
            />
        )
        setIsModalHidden(false)
    }

    const handleDeleteProduct = (deletedProduct) => {
        delete_product(deletedProduct.product_id)
            .then((res) => {
                setIsModalHidden(true)
                setProducts((prevProductsState) => {
                    return prevProductsState.filter((product => product != deletedProduct))
                })
                showMessage({ msg: res.message, msgType: "success" })
            })
            .catch((err) => {
                showMessage({ msg: err.messgae, msgType: "error" })
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
        add_product({ ...e, images: e.imagesBase64 })
            .then((res) => {
                setIsModalHidden(true)
                setIsNewProductAdded(prevValue => !prevValue)
                showMessage({ msg: res.message, msgType: "success" })
            }).catch((err) => {
                showMessage({ msg: err.messgae, msgType: "error" })
            })
    }

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredProductList.length > ITEMS_PER_PAGE ? filteredProductList.slice(startIndex, endIndex) : filteredProductList;

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
                {products.map((product, i) =>
                    <CustomCard
                        key={i}
                        p={product}
                        onClick={() => handleCardClick(product, i)}
                    />
                )}
            </div>

            {filteredProductList.length !== 0
                ? Math.ceil(filteredProductList.length / ITEMS_PER_PAGE) !== 1
                && <PaginationControl
                    productsLength={products.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    filteredProductList={filteredProductList}
                />
                : <div className={styles.productsError}>
                    <label>{errorMessege}</label>
                </div>
            }

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
