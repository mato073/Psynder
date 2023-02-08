import axiosInstance from '../../../../helpers/axios'

import { BASE_URL } from '@env';

const base_url = BASE_URL;

export function request_get_Location(isTherapist) {
    const url = isTherapist
        ? `${base_url}/therapists/current/location`
        : `${base_url}/users/current/location`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/location` : `http://10.0.2.2:8080/users/current/location`;

    return axiosInstance().request({
        method: 'get',
        url: url
    });
}