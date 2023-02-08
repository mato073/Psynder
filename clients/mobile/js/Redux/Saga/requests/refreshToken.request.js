import axiosInstance from '../../../../helpers/axios'

import { BASE_URL } from '@env';

const base_url = BASE_URL;

export function request_get_refreshToken(refreshToken) {
    const url = `${base_url}/token/refresh`
    //const url = 'http://10.0.2.2:8080/token/refresh'
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const params = new URLSearchParams();
    params.append('refreshToken', refreshToken);

    return axiosInstance().request({
        method: 'get',
        url: url,
        config: config,
        params: params
    });
}