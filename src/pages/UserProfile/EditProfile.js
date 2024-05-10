import React, { useState, useRef } from 'react'
import styles from './EditProfile.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'
import { isNullOrUndefined, parseBase64 } from '../../CustomTools/CustomTools'
import CustomImage from '../../components/customComponents/CustomImage'
import { useMessageBox } from '../../components/Messages/MessageBox'
import CustomDropdown from '../../components/customComponents/CustomDropdown'
import { genders } from '../../constants/GENDERS'

export default function EditProfile({ user, closeModal }) {

    const [newFirstName, setNewFirstName] = useState(user.first_name)
    const [newLastName, setNewLastName] = useState(user.last_name)

    const [newEmail, setNewEmail] = useState(user.email)
    const [newPhone, setNewPhone] = useState(user.phone)

    const [newGender, setNewGender] = useState(user.gender)
    const [newAge, setNewAge] = useState(user.age)

    const [newImageUrl, setNewImageUrl] = useState(user.profile_image)
    const [newImageBlob, setNewImageBlob] = useState(user.profile_image)
    const [newImageBase64, setNewImageBase64] = useState(null)

    const fileInputRef = useRef(null)

    const { showMessage } = useMessageBox()

    const handleSaveChangesClick = () => {
        closeModal({
            first_name: newFirstName,
            last_name: newLastName,
            email: newEmail,
            phone: newPhone,
            gender: newGender,
            profile_image: newImageUrl,
            profile_image_base64: newImageBase64
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
                    <CustomInputs value={newAge} onChange={setNewAge} />
                </div>

                <div className={styles.inputBox}>
                    <label className={styles.inputLabel}>Gender</label>
                    <CustomDropdown
                        options={genders}
                        value={newGender}
                        onSelect={setNewGender}
                    />
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
                                parseBase64(image, showMessage)
                                    .then(base64Image => {
                                        setNewImageBase64(base64Image)
                                        const newImageBlob = URL.createObjectURL(image)
                                        setNewImageBlob(newImageBlob)
                                        setNewImageUrl(newImageBlob)
                                    })
                                    .catch(error => {
                                        showMessage({ msg: error, msgType: "error" })
                                    });
                            }
                        }}
                    />

                    <div className={styles.imageControls}>
                        {!isNullOrUndefined(newImageBlob)
                            && <CustomImage
                                url={newImageBlob}
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
