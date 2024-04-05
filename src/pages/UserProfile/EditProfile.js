import React, { useState, useRef } from 'react'
import styles from './EditProfile.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import { storage } from '../../Firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { isNullOrUndefined } from '../../CustomTools/CustomTools'
import CustomImage from '../../components/customComponents/CustomImage'
import { useMessageBox } from '../../components/Messages/MessageBox'

export default function EditProfile({ user, closeModal }) {

    const [newFirstName, setNewFirstName] = useState(user.first_name)
    const [newLastName, setNewLastName] = useState(user.last_name)

    const [newEmail, setNewEmail] = useState(user.email)
    const [newPhone, setNewPhone] = useState(user.phone)

    const [newGender, setnewGender] = useState(user.gender)

    const [newImageUrl, setNewImageUrl] = useState(user.profile_image)
    const [newImageObject, setNewImageObject] = useState(null)

    const fileInputRef = useRef(null)

    const { showMessage } = useMessageBox()

    const uploadImageToFB = () => {
        if (!newImageObject) {
            return Promise.resolve(newImageUrl)
        }
        // TODO: Remove id from application (maybe we could use id's hash)
        const imageRef = ref(storage, `images/${sessionStorage.getItem("id")}/avatar/${newImageObject?.name}`)
        return uploadBytes(imageRef, newImageObject)
            .then(() => getDownloadURL(imageRef))
            .catch(() => {
                showMessage({ msg: "Something Went Wrong", msgType: "error" })
            })
    }

    const handleSaveChangesClick = () => {
        uploadImageToFB()
            .then(fbImageUrl => {
                closeModal({
                    first_name: newFirstName,
                    last_name: newLastName,
                    email: newEmail,
                    phone: newPhone,
                    gender: newGender,
                    profile_image: fbImageUrl
                })
            }).catch(() => {
                showMessage({ msg: "Something Went Wrong", msgType: "error" })
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.nameField}>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Name</label>
                    <CustomInputs value={newFirstName} onChange={setNewFirstName} />
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Lastname</label>
                    <CustomInputs value={newLastName} onChange={setNewLastName} />
                </div>
            </div>

            <div className={styles.contactField}>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Email</label>
                    <CustomInputs value={newEmail} onChange={setNewEmail} />
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Phone</label>
                    <CustomInputs value={newPhone} onChange={setNewPhone} />
                </div>
            </div>

            <div className={styles.detailsField}>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Age</label>
                    <CustomInputs value={newGender} onChange={setnewGender} />
                </div>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Phone</label>
                    <CustomInputs value={newPhone} onChange={setNewPhone} />
                </div>
            </div>

            <div className={styles.imageField}>
                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Image</label>
                    <CustomInputs
                        type={"file"}
                        inputContainerRef={fileInputRef}
                        parentStyle={{ display: "none" }}
                        onChange={(image) => {
                            if (image?.type.startsWith('image/')) {
                                setNewImageObject(image)
                                const url = URL.createObjectURL(image)
                                setNewImageUrl(url)
                            }
                        }}
                    />

                    <div className={styles.imageControls}>
                        {!isNullOrUndefined(newImageUrl) &&
                            <CustomImage
                                url={newImageUrl}
                                name={"new image"}
                                style={{
                                    width: "2.5rem",
                                    height: "2.5rem"
                                }}
                            />
                        }
                        <CustomButton
                            onClick={() => {
                                fileInputRef?.current?.click()
                            }}
                            text={"Choose Image"}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.saveButton}>
                <CustomButton
                    text={"Save Changes"}
                    onClick={() => handleSaveChangesClick()}
                />
            </div>

        </div>
    )
}
