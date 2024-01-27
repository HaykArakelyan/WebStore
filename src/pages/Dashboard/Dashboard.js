import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import CustomCard from '../../components/customComponents/CustomCard';
import CustomButton from '../../components/customComponents/CustomButton'
import CustomPaginator from '../../components/customComponents/CustomPaginator'
import { AnimatePresence } from 'framer-motion';
import CustomModal from '../../components/customComponents/CustomModal';

export default function Dashboard() {
    const [products, setProducts] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12
    const MAX_PAGE_COUNT = Math.ceil(products.length / ITEMS_PER_PAGE)

    const START_INDEX = currentPage * ITEMS_PER_PAGE
    const END_INDEX = START_INDEX + ITEMS_PER_PAGE
    const CURRENT_DATA = products.slice(START_INDEX, END_INDEX)

    const [isModalHidden, setIsModalHidden] = useState(true)

    const [activeProduct, setActiveProduct] = useState({})

    const handlePageSwitch = (action, n) => {
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

    useEffect(() => {
        axios.get('https://dummyjson.com/products').then((res) => {
            setProducts(res.data.products)
        })
    }, [])


    useEffect(() => {
        window.scrollTo(0, window.innerHeight)
    }, [currentPage])

    return (
        <div className={styles.outterContainer}>
            <div className={styles.container}>

                <div className={styles.products}>
                    {CURRENT_DATA.map(e =>
                        <CustomCard
                            key={e.id}
                            p={e}
                            onClick={() => handleCardClick(e)}
                        />
                    )}
                </div>

                {products.length !== 0 ?
                    <div className={styles.paginationControl}>
                        <CustomButton
                            text={"Back"}
                            onClick={() => handlePageSwitch("back")}
                        />
                        <CustomPaginator
                            numberOfPages={MAX_PAGE_COUNT}
                            handlePageSwitch={handlePageSwitch}
                        />
                        <CustomButton
                            text={"Next"}
                            onClick={() => handlePageSwitch("next")}
                        />
                    </div> : null
                }

                <AnimatePresence
                    initial={false}
                    mode='wait'
                >
                    {!isModalHidden ?
                        <CustomModal
                            onCloseModal={setIsModalHidden}
                            activeProduct={activeProduct}
                        /> : null
                    }
                </AnimatePresence>
            </div >
        </div>
    )
}
