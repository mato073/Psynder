import { call, put } from 'redux-saga/effects'
import { request_get_appointments } from '../requests/appointments.request';
import { get_appointments_success, get_appointments_error } from '../../Actions/Actions';

export function* handler_get_appointments(action) {
    try {
        const response = yield call(request_get_appointments, action);
        const { data } = response;
        yield put(get_appointments_success(data));
    } catch (err) {
        console.log("err =", err)
        yield put(get_appointments_error(err));
    }
}