import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import CustomCard from '../../components/customComponents/CustomCard';
import CustomButton from '../../components/customComponents/CustomButton'
import CustomPaginator from '../../components/customComponents/CustomPaginator'
import { AnimatePresence } from 'framer-motion';
import CustomModal from '../../components/customComponents/CustomModal';
import Product from '../../components/Product/Product';
import CustomInputs from '../../components/customComponents/CustomInputs';
import { filteredProducts } from '../../CustomTools/CustomTools';

import { faX } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
    const [products, setProducts] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [activeProduct, setActiveProduct] = useState({})

    const [searchQuery, setSearchQuery] = useState("")
    const [filteredProductList, setFilteredProductList] = useState([])

    const [errorMessege, setErrorMessege] = useState(null)

    useEffect(() => {
        axios.request('https://dummyjson.com/products')
            .then((res) => {
                setProducts(res.data.products)
                setFilteredProductList(res.data.products)
            })
            .catch((err) => {
                if (err.code === "ERR_NETWORK") {
                    setErrorMessege("No Internet Connection")
                } else {
                    setErrorMessege("Something Went Wrong")
                }
            })
    }, [])


    useEffect(() => {
        window.scrollTo(0, window.innerHeight)
    }, [currentPage])


    useEffect(() => {
        const result = filteredProducts(products, searchQuery)
        if (result.length === 0) {
            setErrorMessege(`No Product Found With "${searchQuery}"`)
        }
        setFilteredProductList(result)
        setCurrentPage(0)
    }, [products, searchQuery])


    const handlePageSwitch = (action, n) => {
        const MAX_PAGE_COUNT = Math.ceil(products.length / ITEMS_PER_PAGE)

        switch (action) {
            case "next":
                if (currentPage === MAX_PAGE_COUNT - 1)
                    return
                setCurrentPage(currentPage + 1)
                break;

            case "back":
                if (currentPage === 0)
                    return
                setCurrentPage(currentPage - 1)
                break
            case "switch":
                if (n >= 0 && n < MAX_PAGE_COUNT) {
                    setCurrentPage(n)
                }
                break;
            default:
                break;
        }
    }

    const handleCardClick = (e) => {
        setIsModalHidden(false)
        setActiveProduct(e)
    }

    const handleSeatchQueryChange = (value) => {
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
                        onChange={handleSeatchQueryChange}
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
                            key={e.id}
                            p={e}
                            onClick={() => handleCardClick(e)}
                        />
                    )}
                </div>
                {filteredProductList.length !== 0 ?
                    Math.ceil(filteredProductList.length / ITEMS_PER_PAGE) !== 1 &&
                    <div className={styles.paginationControl}>
                        <CustomButton
                            text={"Back"}
                            onClick={() => handlePageSwitch("back")}
                        />
                        <CustomPaginator
                            numberOfPages={Math.ceil(filteredProductList.length / ITEMS_PER_PAGE)}
                            handlePageSwitch={handlePageSwitch}
                        />
                        <CustomButton
                            text={"Next"}
                            onClick={() => handlePageSwitch("next")}
                        />
                    </div> :
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
