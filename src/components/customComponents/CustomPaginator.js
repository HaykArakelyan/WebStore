import React, { useEffect, useState } from 'react'
import styles from './CustomPaginator.module.css'
import CustomButton from './CustomButton'

export default function CustomPaginator({ numberOfPages, handlePageSwitch }) {

    const [pages, setPages] = useState([])

    useEffect(() => {
        setPages(Array.from({ length: numberOfPages }, (_, i) => i))
    }, [numberOfPages])

    return (
        <div className={styles.container}>
            {pages.map(page =>
                <CustomButton
                    key={page}
                    text={page + 1}
                    style={{
                        "marginLeft": "0.1rem",
                        "marginRight": "0.1rem"
                    }}
                    onClick={() => handlePageSwitch("switch", page)}
                />
            )}
        </div>
    )
}
