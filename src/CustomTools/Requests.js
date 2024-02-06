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
        console.log(error)
        return Promise.reject(error)
    }
)

export const register_user = (newUser) => {
    api.post("register", newUser)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
}

export const get_token_login = (email, password) => {
    return api.post("login", { email, password })
        .then((res) => {
            localStorage.setItem("access_token", res.data.access_token);
            return res.data.id;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};


export const get_user_by_id = (id) => {
    return api.get(`user_profile/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err)
        })
}


export const delete_user_by_id = (id) => {
    return api.delete(`user_profile/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err)
        })
}