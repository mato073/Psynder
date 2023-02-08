import axiosInstance from '../../../../helpers/axios'

import { BASE_URL } from '@env';

const base_url = BASE_URL;

export function request_get_appointments({ isTherapist, startDate, endDate }) {
    const url = isTherapist
        ? `${base_url}/therapists/current/appointments`
        : `${base_url}/users/current/appointments`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/appointments` : `http://10.0.2.2:8080/users/current/appointments`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params._searchParams.length === 0) {
        return axiosInstance().request({
            method: 'get',
            url: url
        });
    } else {
        return axiosInstance().request({
            method: 'get',
            url: url,
            params: params
        });
    }
}