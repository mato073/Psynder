import axios from 'axios';
import { BASE_URL } from '@env';
import axiosInstance from '../../helpers/axios';
import { get_location_request } from '../Redux/Actions/Actions';
import Store from '../Redux/Store';

const base_url = BASE_URL;

export async function post_location(
    type,
    isTherapist,
    lat,
    lng,
    formattedAddress,
) {
    const url = isTherapist
        ? `${base_url}/therapists/current/location`
        : `${base_url}/users/current/location`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/location` : `http://10.0.2.2:8080/users/current/location`;

    const params = new URLSearchParams();
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    params.append('lat', lat);
    params.append('lng', lng);
    params.append('formattedAddress', formattedAddress);

    try {
        if (type === "POST")
            await axiosInstance().post(url, params, config);
        else if (type === "PATCH")
            await axiosInstance().patch(url, params, config);
        Store.dispatch(get_location_request(false));
        return true;
    } catch (err) {
        console.log('err postLocation:', err);
        return false;
    }
}

export async function get_therapist_close_to_user(lat, lng, radius) {
    const url = `${base_url}/therapists/close-to-me?lat=${lat}&lng=${lng}&radius=${radius}`;
    //const url = `http://10.0.2.2:8080/therapists/close-to-me`;

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    
    let result;
    try {
        result = await axiosInstance().get(url, config);
        return result.data.therapists;
    } catch (err) {
        console.log('err getClose:', err);
        return null;
    }
}

export async function location_autocomplete(textValue) {
    const accessToken = "pk.14e944ff0615049f0a5f4561e0ce7fe2";
    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${accessToken}&q=${textValue}&limit=6&accept-language=fr&countrycodes=fr&tag=place:house`

    let result;
    try {
        result = await axios.get(url)
        return result.data;
    } catch (err) {
        console.log('err location_autocomplete:', err);
        return null;
    }
}

export async function location_reverseGeocoding(lat, lng) {
    const accessToken = "pk.14e944ff0615049f0a5f4561e0ce7fe2";
    const url = `https://eu1.locationiq.com/v1/reverse.php?key=${accessToken}&lat=${lat}&lon=${lng}&format=json`

    let result;
    try {
        result = await axios.get(url)
        return result.data;
    } catch (err) {
        console.log('err reverseGeocoding:', err);
        return null;
    }
}