import { parseBase64 } from '../../CustomTools/CustomTools'
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

    const [newImagesBlobs, setNewImagesBlobs] = useState(product.images)
    const [newImagesObjects, setNewImagesObjects] = useState([])

    const { showMessage } = useMessageBox()


    useEffect(() => {
        if (p) {
            setProduct(p)
        }
    }, [p])

    const handleProductEdit = (value) => {
        setProduct(value)
    }

    const handleRemoveImageClick = (indexToRemove) => {
        setNewImagesBlobs(prevUrls => prevUrls.filter((url, index) => index !== indexToRemove))
        setNewImagesObjects(prevImagesObject => prevImagesObject.filter((imageObject, index) => index !== indexToRemove))
    };

    const handleSubmitButtonClick = async () => {
        if (
            product.price < 0 ||
            product.stock < 0 ||
            product.discountPercentage > 100 ||
            product.discountPercentage < 0
        ) {
            console.log("Invalid Data!");
            return;
        }
        const existingImagesBase64 = await parseUrlToBase64(product.images)
        const newImagesBase64 = await parseImagestoBase64()

        const newProduct = {
            ...product,
            price: parseFloat(product.price),
            discountPercentage: parseFloat(product.discountPercentage),
            stock: parseFloat(product.stock),
            images: newImagesBlobs,
            imagesBase64: [...existingImagesBase64, ...newImagesBase64]
        };

        onSubmit(newProduct)
    };

    const parseImagestoBase64 = () => {
        try {
            const base64Promises = newImagesObjects.map((imageFile) => {
                return parseBase64(imageFile, showMessage)
            });

            return Promise.all(base64Promises)
        } catch (err) {
            throw err
        }
    }

    const parseUrlToBase64 = () => {
        try {
            const base64Url = newImagesBlobs.map((url) => {
                if (!url.startsWith('blob:')) {
                    return fetchAndConvertToBase64(url)
                }
            })
            return Promise.all(base64Url.filter(url => url != undefined))
        }
        catch (err) {
            throw err
        }

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
                            const totalImages = newImagesBlobs.length + images.length;

                            if (totalImages <= 5) {
                                images.forEach((image) => {
                                    setNewImagesObjects(prevImagesObjects => [...prevImagesObjects, image])
                                    const imageBlob = URL.createObjectURL(image);
                                    setNewImagesBlobs(prevBlobs => [...prevBlobs, imageBlob]);
                                });
                            } else {
                                showMessage({ msg: "You can only upload up to 5 images.", msgType: "warning" });
                            }
                        }}
                    />

                    <div className={styles.imageControls}>
                        <div className={styles.productImages}>
                            {newImagesBlobs.map((newImageUrl, index) => (
                                <div key={index} onClick={() => handleRemoveImageClick(index)}>
                                    <CustomImage
                                        url={newImageUrl}
                                        name={"new image"}
                                        style={{
                                            width: "2.5rem",
                                            height: "2.5rem"
                                        }}
                                    />
                                </div>
                            ))}
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
