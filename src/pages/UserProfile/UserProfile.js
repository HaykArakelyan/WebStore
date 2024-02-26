import React, { useState, useEffect } from 'react'
import styles from './UserProfile.module.css'

import { useNavigate } from 'react-router-dom'

import male_image from '../../assets/user_image_male.jpg'
import female_image from '../../assets/user_image_female.jpg'
import { clearStorage, makeFirstUpper, makeStringShorter } from '../../CustomTools/CustomTools'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomModal from '../../components/customComponents/CustomModal'
import { AnimatePresence } from 'framer-motion'
import EditProfile from './EditProfile'
import { delete_user_by_id, update_user, get_user_by_id, add_product } from '../../CustomTools/Requests'
import ProductForm from '../../components/Product/ProductForm'

export default function UserProfile({ }) {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
    })
    const userId = sessionStorage.getItem("id")

    const [imageUrl, setImageUrl] = useState("")
    const [userProducts, setUserProducts] = useState([])
    const [userCart, setUserCart] = useState([])

    useEffect(() => {
        get_user_by_id(userId)
            .then((res) => {
                setUser(res.user_info)
                setImageUrl(res.user_info.img)
                setUserProducts([...userProducts, ...res.products_info])
                setUserCart([])
            })
            .catch((err) => {
                console.log(err)
                clearStorage();
                navigate("/login")
            })
    }, [])


    const [isModalHidden, setIsModalHidden] = useState(true)
    const [modalElement, setModalElement] = useState()

    const hasImage = (image) => {
        if (image === "" || image) {
            return false
        }
        return true
    }

    const handleEditbuttonClick = () => {
        setModalElement(
            <EditProfile
                user={user}
                closeModal={handleSaveButtonClick}
            />
        )
        setIsModalHidden(false)
    }

    const handleSaveButtonClick = (updatedUser) => {
        update_user(
            user.id,
            updatedUser,
        ).then((msg) => {
            console.log(msg)
            setUser({ ...user, ...updatedUser })
        }).catch((err) => {
            console.log(err)
        })
        setIsModalHidden(true)
    }

    const handleDeleteProfile = () => {
        const answer = prompt("You will lose forever access to your account. Type 'Delete' to continue the process... ", "")
        if (answer === "Delete") {
            delete_user_by_id(user.id)
                .then(() => {
                    localStorage.removeItem("access_token")
                    navigate('/login')
                })
                .catch((err) => {
                    console.log(err)
                })

        }
    }

    const handleAddProductButtonClick = () => {
        setModalElement(<ProductForm
            onSubmit={handlePostProductButtonClick}
            newProduct
        />)
        setIsModalHidden(false)
    }

    const handlePostProductButtonClick = (e) => {

        add_product(e)
            .then((res) => {
                console.log(res)
                setIsModalHidden(true)
            }).catch((err) => {
                console.log(err)
            })
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
                    <div className={styles.manageProducts}>
                        <CustomButton
                            text={"Add Product"}
                            onClick={handleAddProductButtonClick}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div className={styles.deleteProile}>
                        <CustomButton
                            text={"Delete Profile"}
                            onClick={handleDeleteProfile}
                            style={{ width: "100%" }}
                        />
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
                            <span key={123} className={styles.dataBox}>
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
                    <div
                        className={styles.userProducts}
                        onClick={() => navigate('/my-products',
                            {
                                state: {
                                    products: userProducts
                                }
                            })
                        }
                    >
                        <span className={styles.userProductsTitle}>My Products</span>
                        {userProducts && userProducts.length === 0 ?
                            <span className={styles.userEmptyList}>The List is Empty...</span> :
                            userProducts.map((e, i) => {
                                if (i < 2) {
                                    return (
                                        <div className={styles.productBox} key={i}>
                                            <div className={styles.product}>
                                                {/* TODO: Back should return product images */}
                                                {/* <img src={e.images[0]} className={styles.productImage} /> */}
                                                <span className={styles.productDescription}>
                                                    {makeStringShorter(e.description, 41)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    {/* TODO: Add limitations to the list */}
                    <div className={styles.userProducts}>
                        <span className={styles.userProductsTitle}>My Cart</span>
                        {userCart && userCart.length === 0 ?
                            <span className={styles.userEmptyList}>The Cart is Empty...</span> :
                            userCart.map((e, i) => {
                                if (i < 2) {
                                    return (
                                        <div className={styles.productBox} key={i}>
                                            <div
                                                className={styles.product}
                                            >
                                                <img src={e.images[0]} className={styles.productImage} />
                                                <span className={styles.productDescription}>
                                                    {makeStringShorter(e.description, 41)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            })
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
                            modalElement
                        }
                    /> :
                    null
                }
            </AnimatePresence>
        </div >
    )
}