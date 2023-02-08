import axios from 'axios'
import Store from '../js/Redux/Store'
import { refreshToken, send_token, get_token_clean, get_token_success } from '../js/Redux/Actions/Actions'

export default () => {

    const storeData = Store.getState();
    let headers = {};

    if (storeData.UserToken_reducer.token.data.accessToken) {
        headers.Authorization = `Bearer ${storeData.UserToken_reducer.token.data.accessToken}`;
    }

    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(
        config => {
            const token = storeData.UserToken_reducer.token.data.accessToken;
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });

    axiosInstance.interceptors.response.use((response) => {
        return response
    }, async function (error) {
        const originalRequest = error.config;
        console.log("original request =", originalRequest)
        const refresh = storeData.UserToken_reducer.token.data.refreshToken;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const access_token = await refreshToken(refresh);
            if (access_token === false) {
                Store.dispatch(get_token_clean());
                return;
            }
            Store.dispatch(get_token_success(access_token));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token.accessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + access_token.accessToken;
            return axios(originalRequest);
        }
        return Promise.reject(error);
    });

    return axiosInstance;
};