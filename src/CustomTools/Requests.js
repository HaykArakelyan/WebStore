import axios from "axios"


const BASE_URL = "http://localhost:5000/"

const api = axios.create({
    baseURL: BASE_URL
})


api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("access_token")
        if (token && !config?.url?.includes("refresh_token")) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


let isRefreshing = false
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null
        const originalRequest = error.config
        if (status === 401) {
            if (!isRefreshing) {
                isRefreshing = true
                api.post('/refresh_token', {}, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("refresh_token")}`
                    }
                }).then(refreshTokenResponse => {
                    const newAccessToken = refreshTokenResponse.data.access_token
                    sessionStorage.setItem("access_token", newAccessToken)
                    return api(originalRequest)
                }).then(retryResponse => {
                    isRefreshing = false
                    return retryResponse
                }).catch(refreshError => {
                    isRefreshing = false
                })
            } else {
                new Promise((resolve) => setTimeout(resolve, 1000))
                const retryResponse = api(originalRequest)
                return retryResponse
            }
        } else {
            return Promise.reject(error)
        }
    }
)


export const register_user = (newUser) => {
    return api.post("register", newUser)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const get_token_login = (email, password) => {
    return api.post("login", { email, password })
        .then((res) => {
            sessionStorage.setItem("refresh_token", res.data.refresh_token)
            sessionStorage.setItem("access_token", res.data.access_token)
            sessionStorage.setItem("id", res.data.id)
            return res.data.id
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const get_user = () => {
    return api.get(`user_profile`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const delete_user = () => {
    return api.delete(`user_profile`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const update_user = (updatedUser) => {
    return api.put(`/user_profile`, updatedUser)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const add_product = (newProduct) => {
    return api.post('add_product', newProduct)
        .then((res) => {
            return res.data
        }).catch((err) => {
            return Promise.reject(err)
        })
}


export const edit_product = (productId, updatedProduct) => {
    return api.put(`edit_product/${productId}`, updatedProduct)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const get_products = () => {
    return api.get(`/get_products`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const get_all_products = () => {
    return api.get(`/products`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const delete_product = (productId) => {
    return api.delete(`edit_product/${productId}`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const get_user_cart = () => {
    return api.get('/get_from_cart')
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const add_product_to_cart = (product) => {
    return api.post('/add_to_cart', product)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const add_review = (productId, review) => {
    return api.post(`/add_review/${productId}`, review)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const get_product_by_id = (productId) => {
    return api.get(`/product/${productId}`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const delete_from_cart_by_id = (product_id) => {
    return api.delete(`/delete_from_cart/${product_id}`,)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}


export const add_rating = (productId, rating) => {
    return api.post(`/product/${productId}`, rating)
        .then((res) => ({ data: res.data, status: res.status }))
        .catch((err) => Promise.reject(err))
}


export const fetchAndConvertToBase64 = (url) => {
    return api.get(url, { responseType: 'blob' })
        .then((res) => {
            const reader = new FileReader()
            reader.readAsDataURL(res.data)
            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const base64String = reader.result
                    resolve(base64String.split(',')[1])
                }
                reader.onerror = (error) => {
                    reject(error)
                }
            })
        })
        .catch((error) => {
            return Promise.reject(error)
        })
}


export const recover_password = (email) => {
    return api.post('/recover_password', email)
        .then(res => res.data)
        .catch(err => Promise.reject(err))
}


export const contact_us = (message) => {
    return api.post('/contact-us', message)
        .then(res => res.data)
        .catch(err => Promise.reject(err))
}


export const send_report = (report) => {
    return api.post('/report', report)
        .then(res => res.data)
        .catch(err => Promise.reject(err))
}


export const logout = () => {
    return api.post("/logout", { refresh_token: sessionStorage.getItem("refresh_token"), })
        .then(res => res.data)
        .catch(err => Promise.reject(err))
}