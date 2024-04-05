import { isNullOrUndefined, isObjectValid } from '../../CustomTools/CustomTools'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../Firebase/firebase'
import { useMessageBox } from '../../components/Messages/MessageBox'
import CustomButton from '../customComponents/CustomButton'
import CustomImage from '../customComponents/CustomImage'
import CustomInputs from '../customComponents/CustomInputs'
import React, { useEffect, useState, useRef } from 'react'
import styles from './ProductForm.module.css'


export default function ProductForm({ p = null, updateProduct = null, onSubmit, newProduct = false }) {

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
    const [newImagesObjects, setNewImagesObjects] = useState([])
    const [newImagesUrls, setNewImagesUrls] = useState(product.images)

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
        setNewImagesUrls(prevUrls => prevUrls.filter((url, index) => index !== indexToRemove));
        setNewImagesObjects(prevImagesObjects => prevImagesObjects.filter((image, index) => index !== indexToRemove));
    };

    const handleSubmitButtonClick = () => {
        if (
            product.price < 0 ||
            product.stock < 0 ||
            product.discountPercentage > 100 ||
            product.discountPercentage < 0
        ) {
            console.log("Invalid Data!");
            return;
        }

        const newProduct = {
            ...product,
            price: parseFloat(product.price),
            discountPercentage: parseFloat(product.discountPercentage),
            stock: parseFloat(product.stock)
        };

        if (isObjectValid(newProduct)) {
            uploadImagesAndSubmit(newProduct);
        } else {
            console.log("Invalid Data");
        }
    };

    const uploadImagesAndSubmit = async (newProduct) => {
        try {
            const imageUrls = await uploadImagesToFirebase();
            newProduct.images = imageUrls; // Assuming 'images' is the key in newProduct where image URLs are stored
            onSubmit(newProduct); // Send the complete data including image URLs to API call
        } catch (error) {
            showMessage({ msg: "Something Went Wrong", msgType: "error" });
        }
    };

    const uploadImagesToFirebase = async () => {
        const imageUrls = [];

        for (const imageObject of newImagesObjects) {
            const imageRef = ref(storage, `images/${sessionStorage.getItem("id")}/products/${imageObject?.name}`);
            try {
                await uploadBytes(imageRef, imageObject);
                const downloadURL = await getDownloadURL(imageRef);
                imageUrls.push(downloadURL);
            } catch (error) {
                showMessage({ msg: "Error uploading image", msgType: "error" });
                throw error; // Propagate the error to the caller
            }
        }

        return imageUrls;
    };

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
                        {/* TODO: Maybe changed to dropdown menu */}
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

                        {/* TODO: Maybe changed to dropdown menu */}
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

                    <CustomInputs
                        value={product.description}
                        placeholder={"Ex: Very good phone"}
                        onChange={(e) => {
                            handleProductEdit({ ...product, description: e })
                        }}
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
                            const totalImages = newImagesObjects.length + images.length;
                            if (totalImages <= 5) {
                                setNewImagesObjects(prevImagesObjects => [...prevImagesObjects, ...images]);
                                const urls = images.map(image => URL.createObjectURL(image));
                                setNewImagesUrls(prevUrls => [...prevUrls, ...urls]);
                            } else {
                                showMessage({ msg: "You can only upload up to 5 images.", msgType: "warning" });
                            }
                        }}
                    />

                    <div className={styles.imageControls}>
                        <div className={styles.productImages}>
                            {newImagesUrls.map((newImageUrl, index) => (
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
