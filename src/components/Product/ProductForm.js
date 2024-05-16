import { isBlob, parseBase64 } from '../../CustomTools/CustomTools'
import { useMessageBox } from '../../components/Messages/MessageBox'
import CustomButton from '../customComponents/CustomButton'
import CustomImage from '../customComponents/CustomImage'
import CustomInputs from '../customComponents/CustomInputs'
import React, { useEffect, useState, useRef } from 'react'
import styles from './ProductForm.module.css'
import { fetchAndConvertToBase64 } from '../../CustomTools/Requests'
import CustomTextArea from '../customComponents/CustomTextArea'


export default function ProductForm({
    newProduct = false,
    onSubmit,
    p = null,
}) {

    const [product, setProduct] = useState(
        p ? p
            : {
                title: "",
                description: "",
                price: "",
                discountPercentage: "",
                stock: "",
                category: "",
                brand: "",
                images: []
            }
    )

    const fileInputRef = useRef(null)

    const [deletedImages, setDeletedImages] = useState([]) // {id, path}
    const [newImages, setNewImages] = useState([]) // {image, path--blob}
    const [imagesBlobsAndUrls, setImagesBlobsAndUrls] = useState(product.images) // All

    const [productImages, setProductImages] = useState(product.images) // { id, url }

    const { showMessage } = useMessageBox()

    useEffect(() => {
        if (p) {
            setProduct(p)
        }
    }, [p])

    const handleProductEdit = (value) => {
        setProduct(value)
    }

    const handleRemoveImageClick = (removedImage) => {
        if (!isBlob(removedImage)) {
            setDeletedImages(prevDeletedImages => [...prevDeletedImages, removedImage]) // If URL
        } else {
            setNewImages(prevImages => prevImages.filter(image => removedImage !== image.path)) // if Blob
        }
        setImagesBlobsAndUrls(prevBlobs => prevBlobs.filter(blob => removedImage !== blob))
    }

    const handleSubmitButtonClick = async () => {
        if (
            product.price < 0 ||
            product.stock < 0 ||
            product.discountPercentage > 100 ||
            product.discountPercentage < 0
        ) {
            showMessage({ msg: "Ensure that the Fields are filled Correctly" })
            return
        }

        const deletedImagesIds = deletedImages.map(deletedImage => deletedImage.id)
        const newImagesFiles = newImages.map(newImages => newImages.image)

        const formData = new FormData()

        const newProduct = {
            ...product,
            price: parseFloat(product.price),
            discountPercentage: parseFloat(product.discountPercentage),
            stock: parseFloat(product.stock),
            images: {
                deleted_images: deletedImagesIds,
                new_images: newImagesFiles
            },
        }

        const newProductJson = JSON.stringify(newProduct)
        formData.append("data", newProductJson)
        onSubmit(newProductJson)
    }

    const parseImagestoBase64 = () => {
        // try {
        //     const base64Promises = newImagesObjects.map((imageFile) => {
        //         return parseBase64(imageFile, showMessage)
        //     });

        //     return Promise.all(base64Promises)
        // } catch (err) {
        //     throw err
        // }
    }

    const parseUrlToBase64 = () => {
        // try {
        //     const base64Url = newImagesBlobs.map((url) => {
        //         if (!url.startsWith('blob:')) {
        //             return fetchAndConvertToBase64(url)
        //         }
        //     })
        //     return Promise.all(base64Url.filter(url => url != undefined))
        // }
        // catch (err) {
        //     throw err
        // }

    }

    return (
        <div className={styles.container}>
            <div className={styles.productInfo}>
                <div className={styles.titleAndDesc}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Title</label>
                        <CustomInputs
                            value={product.title}
                            placeholder={"Ex: New Phone"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, title: e })
                            }}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Brand</label>
                        <CustomInputs
                            value={product.brand}
                            placeholder={"Ex: apple"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, brand: e })
                            }}
                        />
                    </div>
                </div>

                <div className={styles.priceAndSale}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Price ($)</label>

                        <CustomInputs
                            value={product.price}
                            placeholder={"Ex: 500"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, price: e })
                            }}
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Discount (%)</label>

                        <CustomInputs
                            value={product.discountPercentage}
                            placeholder={"Ex: 50"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, discountPercentage: e })
                            }}
                        />
                    </div>
                </div>
                <div className={styles.productStats}>
                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>In Stock</label>

                        <CustomInputs
                            value={product.stock}
                            placeholder={"Ex: 10"}
                            type={"number"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, stock: e })
                            }}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label className={styles.inputLabel}>Category</label>
                        <CustomInputs
                            value={product.category}
                            placeholder={"Ex: electronics"}
                            onChange={(e) => {
                                handleProductEdit({ ...product, category: e })
                            }}
                        />
                    </div>
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Description</label>
                    <CustomTextArea
                        value={product.description}
                        placeholder={"Ex: Very good phone"}
                        onChange={e => handleProductEdit({ ...product, description: e })}
                        style={{ height: "4.5rem" }}
                    />
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Image</label>
                    <CustomInputs
                        type={"file"}
                        inputContainerRef={fileInputRef}
                        parentStyle={{ display: "none" }}
                        multiple
                        onChange={(imagesFiles) => {
                            const images = Array.from(imagesFiles).filter(file => file.type.startsWith('image/'));
                            const totalImages = productImages.length + images.length;

                            if (totalImages <= 5) {
                                images.forEach((image) => {
                                    const imageBlob = URL.createObjectURL(image)
                                    setImagesBlobsAndUrls(prevBlobs => [...prevBlobs, imageBlob])
                                    setNewImages(prevNewImages => [...prevNewImages, { image, path: imageBlob }])
                                })
                            } else {
                                showMessage({ msg: "You can only upload up to 5 images.", msgType: "warning" });
                            }
                        }}
                    />

                    <div className={styles.imageControls}>
                        <div className={styles.productImages}>
                            {imagesBlobsAndUrls.map((image, index) => {
                                return (
                                    <div key={index} onClick={() => handleRemoveImageClick(image)}>
                                        <CustomImage
                                            url={image.path ? image.path : image}
                                            name={"new image"}
                                            style={{
                                                width: "2.5rem",
                                                height: "2.5rem"
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <CustomButton
                            onClick={() => {
                                fileInputRef?.current?.click()
                            }}
                            text={"Choose Image"}
                        />
                    </div>
                </div>
            </div>





            <div className={styles.postProduct}>
                <CustomButton
                    text={newProduct ? "Post Product" : "Update Product"}
                    onClick={handleSubmitButtonClick}
                />
            </div>


        </div>
    )
}
