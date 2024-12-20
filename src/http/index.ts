import axios from 'axios';
import {Constants} from "../util/Constants";
import {accountStore, globalStore, popUpStore} from "../Context";
import {User} from "../models/User";
import {Type} from "../fragment/popup-block/Type";

export const API_URL = "http://localhost:7080/api/v1/";

 const $api= axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem(Constants.ACCESS_TOKEN_KEY);
    console.log(token);
    if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    // const originalRequest = error.config;
    // if (error.response.status === 401 && error.config && !error.config._isRetry) {
    //     originalRequest._isRetry = true;
    //     try {
    //         const response = await axios.post(`${API_URL}auth/refresh`, {}, {
    //             withCredentials: true
    //         })
    //         localStorage.setItem(Constants.ACCESS_TOKEN_KEY, response.data.accessToken);
    //         return $api.request(originalRequest);
    //     } catch (e) {
    //         globalStore.isAuthenticated = false;
    //         authStore.user = {} as User;
    //         localStorage.removeItem(Constants.ACCESS_TOKEN_KEY);
    //     }
    // }
    if (error.response && error.response.status === 401) {
        globalStore.isAuthenticated = false;
        accountStore.user = {} as User
        localStorage.removeItem(Constants.ACCESS_TOKEN_KEY);
        return
    }
    popUpStore.setPopUp(true, Type.ERROR, error.response.data.message);
    throw error;
})

export default $api;