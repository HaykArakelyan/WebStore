import React, { useState } from 'react'
import styles from './EdiProfile.module.css'
import CustomInputs from '../../components/customComponents/CustomInputs'
import CustomButton from '../../components/customComponents/CustomButton'

export default function EditProfile({ user, closeModal }) {

    const [newFirstName, setNewFirstName] = useState(user.first_name)
    const [newLastName, setNewLastName] = useState(user.last_lame)

    const [newEmail, setNewEmail] = useState(user.email)
    const [newPhone, setNewPhone] = useState(user.phone)

    const [newGender, setnewGender] = useState(user.gender)

    const [newImageurl, setNewImageUrl] = useState(user.imageUrl)

    const handleSaveChangesClick = () => {
        // const updatedUser = {
        //     "id": user.id,
        //     "info": {
        //         "firstName": newFirstName,
        //         "lastName": newLastName,
        //         "email": newEmail,
        //         "phone": newPhone,
        //         "gender": newGender,
        //         "age": user.age
        //     },
        //     "imageUrl": newImageurl,
        //     "products": user.products,
        //     "cart": user.cart
        // }

        console.log(123)
        closeModal(false)
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

            <div className={styles.saveButton}>
                <CustomButton
                    text={"Save Changes"}
                    onClick={() => handleSaveChangesClick()}
                />
            </div>

        </div>
    )
}
