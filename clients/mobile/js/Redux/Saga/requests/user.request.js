import axiosInstance from '../../../../helpers/axios'

import { BASE_URL } from '@env';

const base_url = BASE_URL;

export function requestGetUser(isTherapist) {
    const url = isTherapist
        ? `${base_url}/therapists/current`
        : `${base_url}/users/current`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current` : `http://10.0.2.2:8080/users/current`;

    return axiosInstance().request({
        method: 'get',
        url: url
    });
}