import male_image from '../assets/user_image_male.jpg'
import female_image from '../assets/user_image_female.jpg'
import default_image from '../assets/default.jpg'
import { format } from 'date-fns';


export const isEmpty = (string) => {
    if (string == null || string === '') {
        return true
    }
    return false
}

export const colorIdentifier = (rank, colors) => {
    let percentage = (rank % 1)
    const shades = {
        r: 0,
        g: 0,
        b: 0
    }
    if (rank <= 3) {
        shades.r = 255
        shades.g = 0
        shades.b = 0
    } else if (rank > 3 && rank < 4) {
        shades.r = Math.round(colors.lowRank.red + (colors.midRank.red - colors.lowRank.red) * percentage)
        shades.g = Math.round(colors.lowRank.green + (colors.midRank.green - colors.lowRank.green) * percentage)
        shades.b = Math.round(colors.lowRank.blue + (colors.midRank.blue - colors.lowRank.blue) * percentage)

    } else if (rank === 4) {
        shades.r = 255
        shades.g = 255
        shades.b = 0
    }
    else if (rank > 4 && rank < 5) {
        shades.r = Math.round(colors.midRank.red + (colors.highRank.red - colors.midRank.red) * percentage)
        shades.g = Math.round(colors.midRank.green + (colors.highRank.green - colors.midRank.green) * percentage)
        shades.b = Math.round(colors.midRank.blue + (colors.highRank.blue - colors.midRank.blue) * percentage)
    } else if (rank === 5) {
        shades.r = 0
        shades.g = 255
        shades.b = 0
    }

    return `rgb(${shades.r}, ${shades.g}, ${shades.b})`
}

export const makeFirstUpper = (string) => {
    if (string?.length <= 1) {
        return string
    }

    return string?.charAt(0).toUpperCase() + string?.slice(1)
}

export const makeStringShorter = (string, maxLength) => {
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + "..."
    }
    return string
}

export const isNullOrUndefined = (value) => {
    return value === undefined || value === "" || value === null
}

export const clearStorage = () => {
    sessionStorage.clear()
}

export const filteredProducts = (products, condition) => {
    if (condition === "") {
        return products
    }
    return products.filter(p => p.title.toLowerCase().includes(condition.toLowerCase()))
}

export const isObjectValid = (obj) => {
    if (!Object.values(obj).some(element => isNullOrUndefined(element))) {
        return true
    } else {
        return false
    }
}

export const parseBase64 = (file, onError) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const base64String = e.target.result.split(',')[1]
            resolve(base64String)
        };

        reader.onerror = (error) => {
            onError({ msg: "Error with uploading your image", msgType: "error" })
            reject(error)
        }

        reader.readAsDataURL(file);
    })
}

export const getDefaultAvatar = (user) => {
    if (user.profile_image !== "" && user.profile_image !== undefined && user.profile_image !== null) {
        return user.profile_image
    } else {
        switch (user.gender) {
            case "Male":
                return male_image
            case "Female":
                return female_image
            case "Rather Not To Say":
                return default_image
        }
    }
}

export const formatDate = (dateString) => {
    const date = new Date(dateString)

    return format(date, "MMMM dd, yyyy");
}
