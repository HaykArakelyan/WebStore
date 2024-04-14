import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { filteredProducts } from '../../CustomTools/CustomTools';
import PaginationControl from '../../components/PaginationControl/PaginationControl';
import Product from '../../components/Product/Product';
import CustomInputs from '../../components/customComponents/CustomInputs';
import CustomModal from '../../components/customComponents/CustomModal';
import styles from './Dashboard.module.css';
import CustomCard from '../../components/customComponents/CustomCard';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { get_all_products } from '../../CustomTools/Requests';
import Loader from '../../components/Loader/Loader';
import tempImage from './temp-image.png'; //TODO: Temp

export default function Dashboard() {
    const [products, setProducts] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [activeProduct, setActiveProduct] = useState({})

    const [searchQuery, setSearchQuery] = useState("")
    const [filteredProductList, setFilteredProductList] = useState([])

    const [errorMessege, setErrorMessege] = useState("")
    const [isFetching, setIsFethcing] = useState(true)

    useEffect(() => {
        if (isFetching) {
            setErrorMessege(<Loader />)
        }
    }, [isFetching])


    useEffect(() => {
        get_all_products()
            .then((res) => {
                setProducts(res.products)
                setFilteredProductList(res.products)
            })
            .catch(err => console.log(err))
        setIsFethcing(false)
    }, [])


    useEffect(() => {
        window.scrollTo(0, window.innerHeight)
    }, [currentPage])


    useEffect(() => {
        const result = filteredProducts(products, searchQuery)
        if (result.length === 0 && products.length !== 0) {
            setErrorMessege(`No Product Found With "${searchQuery}"`)
        }
        setFilteredProductList(result)
        setCurrentPage(0)
    }, [products, searchQuery])


    const handleCardClick = (e) => {
        setIsModalHidden(false)
        setActiveProduct(e)
    }


    const handleSearchQueryChange = (value) => {
        setSearchQuery(value)
    }

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredProductList.slice(startIndex, endIndex);

    return (
        <div className={styles.outterContainer}>
            <div className={styles.container}>
                <div className={styles.searchBox}>
                    <CustomInputs
                        placeholder={"Search"}
                        onChange={handleSearchQueryChange}
                        value={searchQuery}
                        icon={faX}
                        onIconClick={() => setSearchQuery("")}
                        parentStyle={{ gap: "1rem" }}
                        iconStyle={{ padding: " 0.5rem .7rem 0.5rem" }}

                    />
                </div>

                <div className={styles.products}>
                    {currentData.map((e) =>
                        <CustomCard
                            key={e.product_id}
                            p={e}
                            onClick={() => handleCardClick(e)}
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
                            element={() => <Product product={activeProduct} />}
                        /> : null
                    }
                </AnimatePresence>
            </div >
        </div>
    )
}
