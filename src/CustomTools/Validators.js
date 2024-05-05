import validator from "validator"

export const isValidEmail = (email = "") => {
    return validator.isEmail(email)
}

export const isValidField = (str) => {
    return !validator.isEmpty(str)
}

export const isValidPhone = (phone) => {
    return validator.isMobilePhone(phone, ['am-AM'])
}
