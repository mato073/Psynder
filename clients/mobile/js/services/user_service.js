import axios from 'axios';
import { BASE_URL } from '@env';
import axiosInstance from '../../helpers/axios'

const base_url = BASE_URL;

export async function deleteUser(isTherapist) {
    const url = isTherapist
        ? `${base_url}/therapists/current`
        : `${base_url}/users/current`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current` : `http://10.0.2.2:8080/users/current`;

    try {
        await axiosInstance().delete(url);
    } catch (err) {
        console.error('err =', err);
    }
}

export async function editUser(params, isTherapist) {
    const url = isTherapist
         ? `${base_url}/therapists/current`
         : `${base_url}/users/current`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current` : `http://10.0.2.2:8080/users/current`;

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    try {
        await axiosInstance().patch(url, params, config);
    } catch (err) {
        return (false);
    }
}

export async function new_user(
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    isTherapist,
) {
    const url = isTherapist
        ? `${base_url}/therapists/signup`
        : `${base_url}/users/signup`;
    //const url = isTherapist ? 'http://10.0.2.2:8080/therapists/signup' : 'http://10.0.2.2:8080/users/signup';

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('firstName', firstName);
    params.append('lastName', lastName);
    params.append('phoneNumber', phoneNumber);
    params.append('password', password);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    try {
        await axios.post(url, params, config);
        return true;
    }
    catch (err) {
        console.log("err new_user:", err.response.data.message)
        return (err.response.data.message);
    }
}

export async function get_Therapist_with_id(id) {
    const url = `${base_url}/therapists/${id}`

    let result;
    try {
        result = await axiosInstance().get(url);
        return result.data.therapist;
    } catch (err) {
        console.log('err get_Therapist_with_id:', err);
        return null;
    }
}

export async function new_google_user(isTherapist, uid, provider, email, firstName, lastName) {
    const url = isTherapist
        ? `${base_url}/therapists/social/signup`
        : `${base_url}/users/social/signup`;
    /* const url = isTherapist ? 'http://10.0.2.2:8080/therapists/social/signup' : 'http://10.0.2.2:8080/users/social/signup'; */
    const params = new URLSearchParams();
    params.append('uid', uid);
    params.append('email', email);
    params.append('firstName', firstName);
    params.append('lastName', lastName);
    params.append('provider', provider);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    try {
        await axios.post(url, params, config).then((data) => {
            console.log('data =', data);
            return true;
        });
    } catch (err) {
        console.log('data =', err);
        return false;
    }
}