import React from 'react'
import styles from './PaginationControl.module.css'
import CustomButton from '../customComponents/CustomButton'
import CustomPaginator from '../customComponents/CustomPaginator'

export default function PaginationControl({
    currentPage,
    filteredProductList,
    itemsPerPage,
    productsLength,
    setCurrentPage,
}) {

    const handlePageSwitch = (action, n) => {
        const MAX_PAGE_COUNT = Math.ceil(productsLength / itemsPerPage)

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

    return (
        <div className={styles.container}>
            <CustomButton
                text={"Back"}
                onClick={() => handlePageSwitch("back")}
            />

            <CustomPaginator
                numberOfPages={Math.ceil(filteredProductList.length / itemsPerPage)}
                handlePageSwitch={handlePageSwitch}
            />

            <CustomButton
                text={"Next"}
                onClick={() => handlePageSwitch("next")}
            />
        </div>
    )
}
