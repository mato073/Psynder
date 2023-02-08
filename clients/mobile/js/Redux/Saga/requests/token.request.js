import axios from 'axios'

import { BASE_URL } from '@env';

const base_url = BASE_URL;

/* export function request_get_token({ email, password, isTherapist }) {
    const url = isTherapist
        ? `${base_url}/therapists/login`
        : `${base_url}/users/login`;

    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/login` : `http://10.0.2.2:8080/users/login`;
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    return axios.request({
        method: 'post',
        url: url,
        config: config,
        data: params
    });
} */

export function request_get_token({ email, password, isTherapist, provider }) {
    let url = "";
    const params = new URLSearchParams();
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    if (provider === "DEFAULT") {
        url = isTherapist
            ? `${base_url}/therapists/login`
            : `${base_url}/users/login`;

        //const url = isTherapist ? `http://10.0.2.2:8080/therapists/login` : `http://10.0.2.2:8080/users/login`;
        params.append('email', email);
        params.append('password', password);
    }

    else if (provider === "GOOGLE") {
        url = isTherapist 
            ? `${base_url}/therapists/social/login` 
            : `${base_url}/users/social/login`;
        
        //const url = isTherapist ? `http://10.0.2.2:8080/therapists/social/login` : `http://10.0.2.2:8080/users/social/login`;
        params.append('uid', email);
        params.append('provider', provider);
    }
    return axios.request({
        method: 'post',
        url: url,
        config: config,
        data: params
    });
}