import axios from "axios";


const BASE_URL = "http://localhost:5000/"

const api = axios.create({
    baseURL: BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
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
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("id", res.data.id)
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