import { AnimatePresence } from 'framer-motion'
import { delete_user, update_user, get_user, add_product } from '../../CustomTools/Requests'
import { makeFirstUpper, makeStringShorter, clearStorage, getDefaultAvatar } from '../../CustomTools/CustomTools'
import { useMessageBox } from '../../components/Messages/MessageBox'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/customComponents/CustomButton'
import CustomModal from '../../components/customComponents/CustomModal'
import EditProfile from './EditProfile'
import ProductForm from '../../components/Product/ProductForm'
import React, { useState, useEffect } from 'react'
import styles from './UserProfile.module.css'

export default function UserProfile({ }) {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        profile_image: ""
    })

    const [userProducts, setUserProducts] = useState([])
    const [userCart, setUserCart] = useState([])

    const [isModalHidden, setIsModalHidden] = useState(true)
    const [modalElement, setModalElement] = useState()
    const [isNewProductAdded, setIsNewProductAdded] = useState(false)

    const { showMessage } = useMessageBox()

    useEffect(() => {
        get_user()
            .then((res) => {
                setUser(res.user_info)
                setUserProducts([...userProducts, ...res.products_info])
                setUserCart([...userCart, ...res.cart_products_info])
            })
            .catch((err) => {
                showMessage({ msg: err.message, msgType: "error" })
            })
    }, [isNewProductAdded])


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
            updatedUser,
        ).then((res) => {
            showMessage({ msg: res.message, msgType: "success" })
            setUser({ ...user, ...updatedUser })
            setIsModalHidden(true)
        }).catch((err) => {
            showMessage({ msg: err.messgae, msgType: "error" })
        })
    }


    const handleDeleteProfile = () => {
        const answer = prompt("You will lose forever access to your account. Type 'Delete' to continue the process... ", "")
        if (answer === "Delete") {
            delete_user()
                .then((res) => {
                    showMessage({ msg: res.message, msgType: "success" })
                    clearStorage()
                    navigate('/')
                })
                .catch((err) => {
                    showMessage({ msg: err.messgae, msgType: "error" })
                })
                .finally(() => {
                })
        }
    }


    const handleAddProductButtonClick = () => {
        setModalElement(
            <ProductForm
                onSubmit={handlePostProductButtonClick}
                newProduct
            />)
        setIsModalHidden(false)
    }


    const handlePostProductButtonClick = (e, productId, imagesBlobsAndUrls) => {
        add_product(e)
            .then((res) => {
                showMessage({ msg: res.message, msgType: "success" })
                // setUserProducts(prevProducts => [...prevProducts, imagesBlobsAndUrls])
                setIsNewProductAdded(prevValue => !prevValue)
                setIsModalHidden(true)
            }).catch((err) => {
                showMessage({ msg: err.messgae, msgType: "error" })
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
                            src={getDefaultAvatar(user)}
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
                    <div
                        className={styles.userProducts}
                        onClick={() => navigate('/my-products')}
                    >
                        <span className={styles.userProductsTitle}>My Products</span>
                        {userProducts && userProducts.length === 0
                            ? <span className={styles.userEmptyList}>The List is Empty...</span>
                            : userProducts.map((e, i) => {
                                if (i < 2) {
                                    return (
                                        <div className={styles.productBox} key={i}>
                                            <div className={styles.product}>
                                                <img src={e.images[0].path} className={styles.productImage} />
                                                <span className={styles.productDescription}>
                                                    {makeStringShorter(e.title, 41)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div
                        className={styles.userProducts}
                        onClick={() => navigate('/my-saves')}
                    >
                        <span className={styles.userProductsTitle}>My Saves</span>
                        {userCart && userCart.length === 0
                            ? <span className={styles.userEmptyList}>No Saved Products</span>
                            : userCart.map((e, i) => {
                                if (i < 2) {
                                    return (
                                        <div className={styles.productBox} key={i}>
                                            <div className={styles.product}>
                                                <img src={e.images[0].path} className={styles.productImage} />
                                                <span className={styles.productDescription}>
                                                    {makeStringShorter(e.title, 41)}
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
                {!isModalHidden
                    ? <CustomModal
                        onCloseModal={setIsModalHidden}
                        element={() =>
                            modalElement
                        }
                    />
                    : null
                }
            </AnimatePresence>
        </div >
    )
}
