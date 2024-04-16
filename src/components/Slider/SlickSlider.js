import React, { useRef, useState, useEffect } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './SlickSlider.module.css'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import CustomIcon from '../customComponents/CustomIcon';
import CustomCheckbox from '../customComponents/CustomCheckbox'


export default function SlickSlider({ images }) {
    const sliderRef = useRef(null)

    const [isAutoPlayOn, setIsAutoPlayOn] = useState(true)


    const handleCheckboxClick = () => {
        setIsAutoPlayOn(!isAutoPlayOn)
    }


    useEffect(() => {
        sliderRef.current.slickPause();
        sliderRef.current.slickPlay();
    }, [isAutoPlayOn]);

    const settings = {
        autoplay: isAutoPlayOn,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplaySpeed: 3000,
        fade: true,
    }

    return (
        <div className={styles.container}>
            <div className={styles.sliderContainer}>
                <Slider
                    {...settings}
                    ref={sliderRef}
                    className={styles.slider}
                >
                    {images?.map((i) =>
                        <div key={i} className={styles.productImageContainer}>
                            <img src={i} className={styles.productImage} />
                        </div>
                    )}
                </Slider >
            </div>

            <div className={styles.controlPanel}>

                <CustomIcon
                    icon={faChevronLeft}
                    onClick={() => sliderRef?.current?.slickPrev()}
                />

                <div className={styles.checkBoxContainer}>
                    <CustomCheckbox
                        onChange={() => handleCheckboxClick()}
                        defaultChecked={isAutoPlayOn}
                        style={{
                            paddingLeft: 0
                        }}
                    />
                </div>

                <CustomIcon
                    icon={faChevronRight}
                    onClick={() => {
                        sliderRef?.current?.slickNext()
                    }}
                />
            </div>
        </div >
    )
}
