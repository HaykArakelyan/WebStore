import React, { useState, useEffect } from 'react'
import styles from './UserProfile.module.css'

import { useParams, useLocation } from 'react-router-dom'

import male_image from '../../assets/user_image_male.jpg'
import female_image from '../../assets/user_image_female.jpg'
import { makeFirstUpper, makeStringShorter } from '../../CustomTools/CustomTools'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomModal from '../../components/customComponents/CustomModal'
import { AnimatePresence } from 'framer-motion'
import EditProfile from './EditProfile'

export default function UserProfile({ }) {
    const location = useLocation()
    const user = location.state?.user

    const [imageUrl, setImageUrl] = useState(user.img)
    const [userProducts, setUserProducts] = useState(user.products)
    const [userCart, setUserCart] = useState(user.cart)

    const [isModalHidden, setIsModalHidden] = useState(true)

    const { id } = useParams()

    //TODO
    const hasImage = (image) => {
        if (image === "" || image) {
            return false
        }
        return true
    }

    const handleEditbuttonClick = () => {
        setIsModalHidden(false)
    }

    const handleSaveButtonClick = () => {
        setIsModalHidden(true)
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>

                <div className={styles.contentLeft}>
                    <div className={styles.userImage}>
                        <img
                            title={"It's you dude"}
                            alt={"Your image"}
                            src={hasImage(imageUrl) ?
                                imageUrl : user.gender == "Male" ?
                                    male_image : female_image}
                        />
                    </div>
                    <div className={styles.userBio}>
                        <span className={styles.userName}>
                            {makeFirstUpper(user.first_name)} {makeFirstUpper(user.last_name)}
                        </span>
                        <span className={styles.userEmail}>
                            {user.email}
                        </span>
                    </div>
                    <div className={styles.deleteProile}>
                        <CustomButton text={"Delete Profile"} />
                    </div>
                </div>

                <div className={styles.contentCenter}>
                    <div className={styles.nameFields}>
                        <div className={styles.firstNameBlock}>
                            <label className={styles.dataBoxLabels}>
                                Name
                            </label>
                            <span className={styles.dataBox}>
                                {makeFirstUpper(user.first_name)}
                            </span>
                        </div>
                        <div className={styles.lastNameBlock}>
                            <label className={styles.dataBoxLabels}>
                                Surname
                            </label>
                            <span className={styles.dataBox}>
                                {makeFirstUpper(user.last_name)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.contactFields}>
                        <div className={styles.emailBlock}>
                            <label className={styles.dataBoxLabels}>
                                Email
                            </label>
                            <span className={styles.dataBox}>
                                {user.email}
                            </span>
                        </div>

                        <div className={styles.phoneBlock}>
                            <label className={styles.dataBoxLabels}>
                                Phone
                            </label>
                            <span className={styles.dataBox}>
                                {user.phone}
                            </span>
                        </div>
                    </div>

                    <div className={styles.bioFields}>
                        <div className={styles.ageBlock}>
                            <label className={styles.dataBoxLabels}>
                                Age
                            </label>
                            <span className={styles.dataBox}>
                                {user.age}
                            </span>
                        </div>

                        <div className={styles.genderBlock}>
                            <label className={styles.dataBoxLabels}>
                                Gender
                            </label>
                            <span className={styles.dataBox}>
                                {makeFirstUpper(user.gender)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.editInfoField}>
                        <CustomButton
                            text={"Update Profile"}
                            onClick={() => handleEditbuttonClick()}
                        />
                    </div>
                </div>
                <div className={styles.contentRight}>
                    <div className={styles.userProducts}>
                        <span className={styles.userProductsTitle}>My Products</span>
                        {userProducts.length === 0 ?
                            <span className={styles.userEmptyList}>The List is Empty...</span> :
                            userProducts.map((e, i) =>
                                <div className={styles.productBox} key={i}>
                                    <div className={styles.product}>
                                        <img src={e.images[0]} className={styles.productImage}></img>
                                        <span className={styles.productDescription}>
                                            {makeStringShorter(e.description, 41)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {/* TODO: Add limitations to the list */}
                    <div className={styles.userProducts}>
                        <span className={styles.userProductsTitle}>My Cart</span>
                        {userCart.length === 0 ?
                            <span className={styles.userEmptyList}>The Cart is Empty...</span> :
                            userCart.map((e, i) =>
                                <div className={styles.productBox} key={i}>
                                    <div
                                        className={styles.product}
                                    >
                                        <img src={e.images[0]} className={styles.productImage}></img>
                                        <span className={styles.productDescription}>
                                            {makeStringShorter(e.description, 41)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>



            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {!isModalHidden ?
                    <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() =>
                            <EditProfile
                                user={user}
                                closeModal={handleSaveButtonClick}
                            />
                        }
                    /> :
                    null
                }
            </AnimatePresence>
        </div >
    )
}
