import axios from "axios";


const BASE_URL = "http://localhost:5000/"

const api = axios.create({
    baseURL: BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("access_token")
        if (token && !config?.url?.includes("refresh_token")) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false;
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config;
        if (status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                api.post('/refresh_token', {}, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("refresh_token")}`
                    }
                }).then(refreshTokenResponse => {
                    const newAccessToken = refreshTokenResponse.data.access_token;
                    sessionStorage.setItem("access_token", newAccessToken);
                    return api(originalRequest);
                }).then(retryResponse => {
                    isRefreshing = false;
                    return retryResponse;
                }).catch(refreshError => {
                    console.error('Refresh token failed:', refreshError);
                    isRefreshing = false;
                    throw refreshError;
                });
            } else {
                new Promise((resolve) => setTimeout(resolve, 1000));
                const retryResponse = api(originalRequest);
                return retryResponse;
            }
        } else {
            return Promise.reject(error);
        }
    }
);

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
            sessionStorage.setItem("access_token", res.data.access_token);
            sessionStorage.setItem("id", res.data.id)
            return res.data.id;
        })
        .catch((err) => {
            return Promise.reject(err)
        });
};


export const get_user_by_id = (id) => {
    return api.get(`user_profile/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


export const delete_user_by_id = (id) => {
    return api.delete(`user_profile/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

export const update_user = (id, updatedUser) => {
    return api.put(`user_profile/${id}`, updatedUser)
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

export const edit_product = (productId, updatedtProduct) => {
    return api.put(`edit_product/${productId}`, updatedtProduct)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}

export const get_products_by_userId = (userId) => {
    return api.get(`/get_products/${userId}`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}

export const delete_user_product = (productId) => {
    return api.delete(`edit_product/${productId}`)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err))
}