import { BASE_URL } from '@env';
import axiosInstance from '../../helpers/axios'
import { get_appointments_request } from '../Redux/Actions/Actions'
import Store from '../Redux/Store'

const base_url = BASE_URL;

export async function post_appointment(userId, therapistId, date, duration) {
    const url = `${base_url}/appointments`
    //const url = `http://10.0.2.2:8080/appointments`;
    
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const params = new URLSearchParams();
    params.append('date', date);
    params.append('user', userId);
    params.append('therapist', therapistId);
    params.append('duration', duration);

    let result;
    try {
        result = await axiosInstance().post(url, params, config);
        Store.dispatch(get_appointments_request(false))
        return true;
    } catch (err) {
        console.log('err setAppointements:', err);
        return false
    }
}

export async function get_selected_appointment(isTherapist, startDate, endDate) {
    const url = isTherapist
      ? `${base_url}/therapists/current/appointments`
      : `${base_url}/users/current/appointments`;
    //const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/appointments` : `http://10.0.2.2:8080/users/current/appointments`;

    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    try {
        const data = await axiosInstance().get(url, params, config);
        return (data.data)
    } catch (err) {
        console.log('err setAppointements:', err);
    }

}